import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Endpoint } from '../config/endpoints';

interface EndpointSelectorProps {
  endpoints: Endpoint[];
  selectedEndpoint: string;
  onEndpointChange: (endpoint: string) => void;
}

export const EndpointSelector: React.FC<EndpointSelectorProps> = ({
  endpoints,
  selectedEndpoint,
  onEndpointChange,
}) => {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Select Endpoint</InputLabel>
      <Select
        value={selectedEndpoint}
        onChange={(e) => onEndpointChange(e.target.value)}
        label="Select Endpoint"
      >
        {endpoints.map((endpoint) => (
          <MenuItem key={endpoint.id} value={endpoint.id}>
            {endpoint.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}; 