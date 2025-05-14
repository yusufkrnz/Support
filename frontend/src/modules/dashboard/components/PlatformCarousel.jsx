import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PlatformCard = ({ name, logo, color, active, onClick }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        m: 1, 
        borderRadius: 2,
        height: 90,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        borderLeft: active ? `4px solid ${color}` : 'none',
        boxShadow: active ? 3 : 1,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4,
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        p: 2
      }}>
        <Box 
          component="img"
          src={logo}
          alt={`${name} logo`}
          sx={{ 
            height: 40, 
            mb: 1,
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />
        <Typography 
          variant="body2" 
          fontWeight={active ? 'bold' : 'normal'}
          color={active ? color : 'text.secondary'}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

const PlatformCarousel = () => {
  const theme = useTheme();
  const { currentPlatform, changePlatformTheme } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const platforms = [
    { 
      id: 'trendyol', 
      name: 'Trendyol', 
      logo: '/frontend/src/assets/logos/trendyol/trnd1.png',
      color: '#F27A1A'
    },
    { 
      id: 'hepsiburada', 
      name: 'Hepsiburada', 
      logo: '/frontend/src/assets/logos/hepsiburada/hep1.png',
      color: '#FF6000'
    },
    { 
      id: 'gratis', 
      name: 'Gratis', 
      logo: '/frontend/src/assets/logos/gratis/grs1.png',
      color: '#7B1FA2'
    },
    { 
      id: 'superadmin', 
      name: 'Super Admin', 
      logo: '/frontend/src/assets/logos/superadmin.png',
      color: '#1976D2'
    }
  ];
  
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <ArrowBackIos sx={{ color: theme.palette.primary.main }} />,
    nextArrow: <ArrowForwardIos sx={{ color: theme.palette.primary.main }} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  
  const handlePlatformChange = (platformId) => {
    changePlatformTheme(platformId);
  };
  
  return (
    <Paper
      elevation={0}
      sx={{ 
        p: 2, 
        borderRadius: 2, 
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ ml: 1 }}>
        Platformlar
      </Typography>
      
      <Slider {...settings}>
        {platforms.map((platform) => (
          <Box key={platform.id} sx={{ px: 1 }}>
            <PlatformCard
              name={platform.name}
              logo={platform.logo}
              color={platform.color}
              active={currentPlatform === platform.id}
              onClick={() => handlePlatformChange(platform.id)}
            />
          </Box>
        ))}
      </Slider>
    </Paper>
  );
};

export default PlatformCarousel; 