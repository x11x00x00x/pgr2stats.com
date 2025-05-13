import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, LinearProgress, Box, Paper, Fade } from '@mui/material';

interface DateSelectorProps {
  onDateChange: (date: string | null) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch('https://api.pgr2stats.com/api/dates');
        const data = await response.json();
        
        // Get current timestamp
        const now = new Date().getTime();
        const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
        
        // Process dates
        const processedDates = data.map((timestamp: string) => {
          // Convert Unix timestamp to milliseconds
          const date = new Date(parseInt(timestamp) * 1000);
          return {
            timestamp,
            date,
            isRecent: date.getTime() > twentyFourHoursAgo
          };
        });

        // Sort by date (newest first)
        processedDates.sort((a: any, b: any) => b.date.getTime() - a.date.getTime());

        // Group dates
        const groupedDates = processedDates.reduce((acc: any, curr: any) => {
          if (curr.isRecent) {
            // For recent dates, keep all timestamps with full time
            acc.push({
              label: curr.date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }),
              value: curr.timestamp
            });
          } else {
            // For older dates, group by day
            const dayKey = curr.date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
            if (!acc.some((item: any) => item.label.startsWith(dayKey))) {
              acc.push({
                label: dayKey,
                value: curr.timestamp
              });
            }
          }
          return acc;
        }, []);

        setDates(groupedDates);
      } catch (error) {
        console.error('Error fetching dates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  const handleDateChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedDate(value);
    onDateChange(value === 'current' ? null : value);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mb: 2 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <LinearProgress />
        </Paper>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ width: '100%', mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Select Date</InputLabel>
          <Select
            value={selectedDate}
            onChange={handleDateChange}
            label="Select Date"
          >
            <MenuItem value="current">Current Data</MenuItem>
            {dates.map((date: any) => (
              <MenuItem key={date.value} value={date.value}>
                {date.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Fade>
  );
}; 