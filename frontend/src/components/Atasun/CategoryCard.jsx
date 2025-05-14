import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import theme from '../../themes/Atasun/theme';

const CategoryCard = ({ category }) => {
  const { name, icon, description, image, backgroundColor } = category;
  
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        height: 180,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0,0,0,0.08)',
        backgroundColor: backgroundColor || 'white',
        '&:hover': {
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          transform: 'translateY(-5px)'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          zIndex: 2
        }}
      >
        {icon && (
          <Box sx={{ color: theme.primary, mb: 1 }}>
            {icon}
          </Box>
        )}
        
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          textAlign="center" 
          sx={{ color: theme.text, mb: 1 }}
        >
          {name}
        </Typography>
        
        {description && (
          <Typography 
            variant="body2" 
            textAlign="center" 
            sx={{ color: theme.textSecondary }}
          >
            {description}
          </Typography>
        )}
      </Box>
      
      {image && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            opacity: 0.2,
            zIndex: 1,
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }
          }}
        >
          <img src={image} alt={name} />
        </Box>
      )}
    </Paper>
  );
};

export default CategoryCard; 