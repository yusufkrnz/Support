import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const UsersPage = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Users Management
        </Typography>
        <Typography variant="body1">
          This is a placeholder for the Users Management page. Here you will be able to add, edit, and manage users.
        </Typography>
      </Paper>
    </Box>
  );
};

export default UsersPage; 