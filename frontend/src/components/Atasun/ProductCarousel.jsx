import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, useMediaQuery } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import theme from '../../themes/Atasun/theme';

// Atasun görselleri
import atasunImage1 from '../../assets/images/atasunn1.webp';
import atasunImage2 from '../../assets/images/atasunn2.webp';
import atasunImage3 from '../../assets/images/atasunn3.webp';

const images = [
  { 
    src: atasunImage1, 
    alt: 'Atasun Koleksiyon 1', 
    title: 'Yeni Sezon', 
    subtitle: 'En son moda gözlük çerçeveleri ve güneş gözlükleri' 
  },
  { 
    src: atasunImage2, 
    alt: 'Atasun Koleksiyon 2', 
    title: 'Modern Tasarımlar', 
    subtitle: 'Her yüz şekline uygun çeşitler' 
  },
  { 
    src: atasunImage3, 
    alt: 'Atasun Koleksiyon 3', 
    title: 'Lüks Markalar', 
    subtitle: 'Dünyaca ünlü markaların en yeni modelleri' 
  }
];

const ProductCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  // Auto-rotation for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: { xs: '300px', sm: '400px', md: '500px' },
      borderRadius: '8px',
      overflow: 'hidden',
      mb: 4
    }}>
      {/* Images */}
      {images.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentImageIndex ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }
          }}
        >
          <img src={image.src} alt={image.alt} />
          
          {/* Text overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              color: 'white',
              p: { xs: 2, md: 4 },
              textAlign: 'left',
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {image.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {image.subtitle}
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: theme.primary,
                '&:hover': {
                  bgcolor: theme.primaryDark
                }
              }}
            >
              Keşfet
            </Button>
          </Box>
        </Box>
      ))}
      
      {/* Navigation buttons */}
      <IconButton
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.4)',
          color: theme.primary,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.7)',
          },
          display: isMobile ? 'none' : 'flex'
        }}
        onClick={prevImage}
      >
        <NavigateBeforeIcon />
      </IconButton>
      
      <IconButton
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.4)',
          color: theme.primary,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.7)',
          },
          display: isMobile ? 'none' : 'flex'
        }}
        onClick={nextImage}
      >
        <NavigateNextIcon />
      </IconButton>
      
      {/* Dots indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: index === currentImageIndex ? theme.primary : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProductCarousel; 