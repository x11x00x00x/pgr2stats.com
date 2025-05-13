import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Paper, Typography, LinearProgress, Fade, FormControlLabel, Switch } from '@mui/material';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MatchesEntry {
  host: string;
  players: string;
}

interface MatchesChartProps {
  endpoint: string;
}

export const MatchesChart: React.FC<MatchesChartProps> = ({ endpoint }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        // First, get all available dates
        const datesResponse = await fetch('https://api.pgr2stats.com/api/dates');
        if (!datesResponse.ok) {
          throw new Error(`Failed to fetch dates: ${datesResponse.status}`);
        }
        const dates = await datesResponse.json();

        if (!dates || dates.length === 0) {
          throw new Error('No dates available');
        }

        // Process dates to get timestamps with full time
        const processedDates = dates.map((timestamp: string) => {
          const date = new Date(parseInt(timestamp) * 1000);
          return {
            timestamp,
            date,
            timeKey: date.toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          };
        });

        // Sort timestamps chronologically
        const sortedDates = processedDates
          .sort((a: any, b: any) => a.date.getTime() - b.date.getTime());

        // Filter to last 24 hours
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const filteredDates = sortedDates.filter((date: any) => 
          date.date >= twentyFourHoursAgo
        );

        // Fetch data for each timestamp
        const historicalData = await Promise.all(
          filteredDates.map(async (date: any) => {
            const url = `https://api.pgr2stats.com/api/archive/${date.timestamp}/${endpoint}`;
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${date.timestamp}: ${response.status}`);
            }
            const data = await response.json();
            
            // Calculate total players online
            const totalPlayers = data.reduce((sum: number, match: MatchesEntry) => {
              const [current, max] = match.players.split(' / ').map(Number);
              return sum + current;
            }, 0);
            
            return {
              date: date.timeKey,
              totalPlayers
            };
          })
        );

        // Prepare chart data
        const labels = historicalData.map(d => d.date);
        const dataset = {
          label: 'Players in Online Races',
          data: historicalData.map(d => d.totalPlayers),
          borderColor: '#2196F3',
          tension: 0.1,
          fill: false
        };

        setChartData({
          labels,
          datasets: [dataset]
        });
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [endpoint]);

  if (loading) {
    return (
      <Box sx={{ width: '100%', mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <LinearProgress />
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography color="error">Error: {error}</Typography>
        </Paper>
      </Box>
    );
  }

  if (!chartData) {
    return (
      <Box sx={{ width: '100%', mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography>No data available</Typography>
        </Paper>
      </Box>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Players in Online Races (Last 24 Hours)',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Players: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Players'
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ width: '100%', mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ height: { xs: 400, sm: 500, md: 600 } }}>
            <Line options={options} data={chartData} />
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}; 