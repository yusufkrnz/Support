import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import theme from '../../themes/Atasun/theme';

const FeatureCard = ({ feature }) => {
  const { title, description, icon, backgroundColor } = feature;
  
  return (
    <Paper
      elevation={0}
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: '1px solid rgba(0,0,0,0.08)',
        backgroundColor: backgroundColor || 'white',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ 
        width: 70, 
        height: 70, 
        borderRadius: '50%',
        backgroundColor: theme.backgroundDark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        color: theme.primary
      }}>
        {icon}
      </Box>
      
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        gutterBottom
        sx={{ color: theme.text }}
      >
        {title}
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ color: theme.textSecondary }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

export default FeatureCard; 