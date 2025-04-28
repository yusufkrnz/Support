import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SupportTickets = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Destek Talepleri
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Destek talepleriniz burada listelenecek.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SupportTickets; 