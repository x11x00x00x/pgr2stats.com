import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography, Paper } from '@mui/material';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CountsData {
  Name: string;
  Counts: {
    [key: string]: number;
  };
}

interface CountsVisualizationProps {
  data: CountsData[];
}

export const CountsVisualization: React.FC<CountsVisualizationProps> = ({ data }) => {
  // Check if data is empty or invalid
  if (!data || data.length === 0) {
    return (
      <Box sx={{ width: '100%', height: 400, mt: 2 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="body1" align="center">
            No data available
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Check if the first item has Counts property
  if (!data[0].Counts) {
    return (
      <Box sx={{ width: '100%', height: 400, mt: 2 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="body1" align="center">
            Data format not supported for visualization
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Transform the data for the chart
  const chartData = {
    labels: data.map(player => player.Name),
    datasets: Object.keys(data[0].Counts).map(position => ({
      label: `Position ${position}`,
      data: data.map(player => player.Counts[position]),
      backgroundColor: getPositionColor(position),
      stack: 'stack0',
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Position Distribution',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: 400, mt: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Bar options={options} data={chartData} />
      </Paper>
    </Box>
  );
};

function getPositionColor(position: string): string {
  const positionColors: { [key: string]: string } = {
    '1': '#FFD700', // Gold
    '2': '#C0C0C0', // Silver
    '3': '#CD7F32', // Bronze
    '4': '#4CAF50', // Green
    '5': '#2196F3', // Blue
    '6': '#9C27B0', // Purple
    '7': '#FF9800', // Orange
    '8': '#E91E63', // Pink
    '9': '#607D8B', // Blue Grey
    '10': '#795548'  // Brown
  };
  return positionColors[position] || '#000000';
} 