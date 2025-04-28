import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Settings = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Ayarlar
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Hesap ayarlarınızı buradan yönetebilirsiniz.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings; 