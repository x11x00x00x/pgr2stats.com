import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import {
  Box,
  Container,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fade,
  Backdrop,
} from '@mui/material';
import { theme } from './theme';
import { endpoints, Endpoint } from './config/endpoints';
import { EndpointSelector } from './components/EndpointSelector';
import { DateSelector } from './components/DateSelector';
import { DataTable, DataTableProps } from './components/DataTable';
import { CountsVisualization } from './components/CountsVisualization';
import { LineChart } from './components/LineChart';
import { MatchesChart } from './components/MatchesChart';
import axios from 'axios';

const App: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('leaderboard_001');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [useExcelData, setUseExcelData] = useState(false);
  const [showMergedData, setShowMergedData] = useState(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        let url = `https://api.pgr2stats.com/api/${selectedEndpoint}`;
        if (selectedDate) {
          url = `https://api.pgr2stats.com/api/archive/${selectedDate}/${selectedEndpoint}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.text();
        const parsedData = JSON.parse(rawData);
        
        // Check if the endpoint is a leaderboard endpoint between 001 and 017
        const isLeaderboard = /^leaderboard_(0(0[1-9]|[1-9][0-9])|1[0-9][0-9]|2[0-6][0-9]|468|469|470)$/.test(selectedEndpoint);
        
        if (isLeaderboard && useExcelData) {
          try {
            // Fetch legacy data
            const legacyResponse = await fetch(`https://api.pgr2stats.com/api/og/${selectedEndpoint}`);
            if (!legacyResponse.ok) {
              throw new Error(`Failed to fetch legacy data: ${legacyResponse.status}`);
            }
            
            let legacyData = [];
            const legacyText = await legacyResponse.text();
            if (legacyText.trim()) {
              legacyData = JSON.parse(legacyText);
            }
            
            // Prepare data for display
            const currentData = parsedData.map((item: any) => ({
              ...item,
              source: 'current',
              isLegacy: false
            }));
            
            const legacyDataWithSource = legacyData.map((item: any) => ({
              ...item,
              source: 'legacy',
              isLegacy: true
            }));
            
            // Combine data
            const combinedData = [...currentData, ...legacyDataWithSource];
            
            // Sort by score in descending order
            combinedData.sort((a: any, b: any) => parseInt(b.score) - parseInt(a.score));
            
            setData(combinedData);
          } catch (legacyError) {
            console.error('Error processing legacy data:', legacyError);
            // If there's an error with legacy data, just show current data
            setData(parsedData);
          }
        } else {
          setData(parsedData);
        }
        
        setInitialLoad(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setData(null);
        setInitialLoad(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedEndpoint, selectedDate, useExcelData]);

  const filteredData = data?.filter((item) => {
    if (!item) return false;
    const searchableFields = Object.values(item).filter(value => 
      typeof value === 'string' || typeof value === 'number'
    );
    return searchableFields.some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) ?? [];

  // Function to check if data is in counts format
  const isCountsData = (data: any): boolean => {
    if (!Array.isArray(data)) return false;
    return data.every(item => 
      typeof item === 'object' && 
      item !== null && 
      'Name' in item && 
      'Counts' in item &&
      typeof item.Counts === 'object'
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Backdrop
            sx={{ 
              color: '#fff', 
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Fade in={!loading} timeout={500}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                PGR2 Stats
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <EndpointSelector
                  endpoints={endpoints}
                  selectedEndpoint={selectedEndpoint}
                  onEndpointChange={setSelectedEndpoint}
                />
                <DateSelector onDateChange={setSelectedDate} />
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
                {/^leaderboard_(0(0[1-9]|[1-9][0-9])|1[0-9][0-9]|2[0-6][0-9]|468|469|470)$/.test(selectedEndpoint) && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useExcelData}
                        onChange={(e) => setUseExcelData(e.target.checked)}
                      />
                    }
                    label="Legacy"
                  />
                )}
              </Box>
              {error ? (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              ) : data ? (
                <>
                  {selectedEndpoint === 'leaderboard_001' && !selectedDate && !useExcelData && (
                    <LineChart endpoint={selectedEndpoint} />
                  )}
                  {selectedEndpoint === 'matches' && !selectedDate && (
                    <MatchesChart endpoint={selectedEndpoint} />
                  )}
                  {isCountsData(data) ? (
                    <CountsVisualization data={data} />
                  ) : (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {Object.keys(data[0]).filter(key => key !== 'isLegacy' && key !== 'source').map((key) => (
                              <TableCell key={key}>{key}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData.map((row, index) => (
                            <TableRow 
                              key={index}
                              sx={{
                                backgroundColor: row.isLegacy ? 'rgba(255, 255, 255, 0.1)' : 'inherit'
                              }}
                            >
                              {Object.entries(row)
                                .filter(([key]) => key !== 'isLegacy' && key !== 'source')
                                .map(([_, value], cellIndex) => (
                                  <TableCell key={`${index}-${cellIndex}`}>
                                    {String(value)}
                                  </TableCell>
                                ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              ) : null}
            </Box>
          </Fade>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App; 