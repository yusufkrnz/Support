import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SettingsPage = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1">
          This is a placeholder for the Settings page. Here you will be able to configure application settings.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage; 