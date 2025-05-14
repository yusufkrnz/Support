import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AnalyticsPage = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1">
          This is a placeholder for the Analytics Dashboard. Here you will be able to view reports and statistics.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AnalyticsPage; 