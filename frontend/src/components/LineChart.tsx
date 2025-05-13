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

interface LeaderboardEntry {
  rank: string;
  name: string;
  score: string;
}

interface TimeAttackEntry {
  rank: string;
  name: string;
  time: string;
}

interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  tension: number;
  fill: boolean;
}

interface LineChartProps {
  endpoint: string;
}

export const LineChart: React.FC<LineChartProps> = ({ endpoint }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllTime, setShowAllTime] = useState<boolean>(false);
  const [showTopGainers, setShowTopGainers] = useState<boolean>(false);

  const isTimeAttack = endpoint.includes('timeattack');
  const isTopChart = endpoint === 'top3' || endpoint === 'top10';
  const isLeaderboard001 = endpoint === 'leaderboard_001';

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

        // Process dates to get one per day
        const processedDates = dates.map((timestamp: string) => {
          const date = new Date(parseInt(timestamp) * 1000);
          return {
            timestamp,
            date,
            dayKey: date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })
          };
        });

        // Group dates by day and keep only the latest timestamp for each day
        const uniqueDays = processedDates.reduce((acc: any, curr: any) => {
          if (!acc[curr.dayKey] || acc[curr.dayKey].date < curr.date) {
            acc[curr.dayKey] = curr;
          }
          return acc;
        }, {});

        // Sort days chronologically
        const sortedDays = Object.values(uniqueDays)
          .sort((a: any, b: any) => a.date.getTime() - b.date.getTime());

        // If not showing all time, filter to last 30 days
        const filteredDays = showAllTime 
          ? sortedDays 
          : sortedDays.filter((day: any) => {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return day.date >= thirtyDaysAgo;
            });

        // Fetch data for each day
        const historicalData = await Promise.all(
          filteredDays.map(async (day: any) => {
            const url = `https://api.pgr2stats.com/api/archive/${day.timestamp}/${endpoint}`;
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${day.timestamp}: ${response.status}`);
            }
            const data = await response.json();
            return {
              date: day.dayKey,
              data: isTimeAttack ? data.slice(0, 3) : data
            };
          })
        );

        // Get the current entries
        const currentEntries = historicalData[historicalData.length - 1].data;
        
        // Calculate score changes for all players
        const playerChanges = new Map<string, number>();
        currentEntries.forEach((entry: LeaderboardEntry) => {
          const playerName = entry.name;
          const currentScore = parseInt(entry.score);
          
          // Find the earliest score for this player in the last 30 days
          const earliestData = historicalData[0].data.find((d: LeaderboardEntry) => d.name === playerName);
          const earliestScore = earliestData ? parseInt(earliestData.score) : 0;
          
          // Calculate the change
          const change = currentScore - earliestScore;
          playerChanges.set(playerName, change);
        });

        // Sort players by score change
        const sortedPlayers = Array.from(playerChanges.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        // Prepare chart data
        const labels = historicalData.map(d => d.date);
        let datasets;

        if (isLeaderboard001 && showTopGainers) {
          // Show top 10 gainers
          datasets = sortedPlayers.map(([playerName, change], index) => {
            const dataPoints = historicalData.map(dayData => {
              const playerData = dayData.data.find((d: LeaderboardEntry) => d.name === playerName);
              if (!playerData) return 0;
              
              const currentScore = parseInt(playerData.score);
              const earliestData = historicalData[0].data.find((d: LeaderboardEntry) => d.name === playerName);
              const earliestScore = earliestData ? parseInt(earliestData.score) : 0;
              
              // Show change from starting score
              return currentScore - earliestScore;
            });

            return {
              label: `${playerName} (+${change.toLocaleString()})`,
              data: dataPoints,
              borderColor: getColor(index),
              tension: 0.1,
              fill: false
            };
          });
        } else {
          // Show regular top entries
          const topEntries = isTimeAttack ? currentEntries.slice(0, 3) : currentEntries.slice(0, 10);
          datasets = topEntries.map((entry: LeaderboardEntry | TimeAttackEntry, index: number) => {
            const playerName = entry.name;
            const dataPoints = historicalData.map(dayData => {
              const playerData = dayData.data.find((d: LeaderboardEntry | TimeAttackEntry) => d.name === playerName);
              if (!playerData) return 0;

              if (isTimeAttack) {
                const timeStr = (playerData as TimeAttackEntry).time;
                const [minutes, seconds] = timeStr.split(':').map(Number);
                return minutes * 60 + seconds;
              } else {
                const score = parseInt((playerData as LeaderboardEntry).score);
                if (!showAllTime && score > 0) {
                  const minScore = Math.min(...historicalData.map(d => 
                    d.data.find((p: LeaderboardEntry) => p.name === playerName)?.score || 0
                  ));
                  return score - minScore;
                }
                return score;
              }
            });

            return {
              label: playerName,
              data: dataPoints,
              borderColor: getColor(index),
              tension: 0.1,
              fill: false
            };
          });
        }

        setChartData({
          labels,
          datasets
        });
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [endpoint, showAllTime, showTopGainers]);

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

  const getChartTitle = () => {
    if (isLeaderboard001 && showTopGainers) {
      return 'Top 10 Score Gainers (Last 30 Days)';
    } else if (isTimeAttack) {
      return showAllTime 
        ? 'Top 3 Historical Times (All Time)' 
        : 'Top 3 Historical Times (Last 30 Days)';
    } else if (isTopChart) {
      return showAllTime 
        ? 'Top Historical Kudos (All Time)' 
        : 'Top Historical Kudos (Last 30 Days)';
    } else {
      return showAllTime 
        ? 'Top 10 Historical Kudos (All Time)' 
        : 'Top 10 Historical Kudos (Last 30 Days - Score Changes)';
    }
  };

  const formatValue = (value: number) => {
    if (isTimeAttack) {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return value.toLocaleString();
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 20,
          padding: 10
        }
      },
      title: {
        display: true,
        text: getChartTitle(),
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = showAllTime 
              ? context.parsed.y 
              : context.parsed.y + Math.min(...context.dataset.data);
            return `${context.dataset.label}: ${formatValue(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatValue(value);
          }
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
            {isLeaderboard001 && (
              <FormControlLabel
                control={
                  <Switch
                    checked={showTopGainers}
                    onChange={(e) => setShowTopGainers(e.target.checked)}
                  />
                }
                label="Show Top Gainers"
              />
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={showAllTime}
                  onChange={(e) => setShowAllTime(e.target.checked)}
                />
              }
              label="Show All Time"
            />
          </Box>
          <Box sx={{ 
            height: { 
              xs: isTimeAttack || isTopChart || endpoint === 'arcade' ? 800 : 400,
              sm: 600,
              md: 600 
            } 
          }}>
            <Line options={options} data={chartData} />
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

function getColor(index: number): string {
  const colors = [
    '#FFD700', // Gold
    '#C0C0C0', // Silver
    '#CD7F32', // Bronze
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#FF9800', // Orange
    '#E91E63', // Pink
    '#607D8B', // Blue Grey
    '#795548'  // Brown
  ];
  return colors[index % colors.length];
} 