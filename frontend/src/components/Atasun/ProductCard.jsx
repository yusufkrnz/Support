import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Button, 
  Rating,
  Chip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import theme from '../../themes/Atasun/theme';

const ProductCard = ({ product }) => {
  const { name, price, image, rating, discount, isNew, colors } = product;
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
          transform: 'translateY(-5px)'
        }
      }}
    >
      {/* Discount or New tag */}
      {discount && (
        <Chip 
          label={`${discount}% İndirim`} 
          color="error"
          size="small"
          sx={{ 
            position: 'absolute', 
            left: 8, 
            top: 8, 
            zIndex: 1,
            fontWeight: 'bold'
          }} 
        />
      )}
      
      {isNew && !discount && (
        <Chip 
          label="Yeni" 
          size="small" 
          sx={{ 
            position: 'absolute', 
            left: 8, 
            top: 8, 
            zIndex: 1,
            bgcolor: theme.primary,
            color: 'white',
            fontWeight: 'bold'
          }} 
        />
      )}
      
      {/* Favorite button */}
      <Box 
        sx={{ 
          position: 'absolute', 
          right: 8, 
          top: 8, 
          zIndex: 1,
          color: 'grey.500',
          bgcolor: 'rgba(255,255,255,0.8)',
          borderRadius: '50%',
          p: 0.5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          '&:hover': {
            color: theme.secondary,
            bgcolor: 'rgba(255,255,255,0.9)',
          }
        }}
      >
        <FavoriteBorderIcon fontSize="small" />
      </Box>
      
      {/* Product image */}
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={name}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      
      {/* Color options */}
      {colors && colors.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: -2, mb: 1 }}>
          {colors.map((color, index) => (
            <Box 
              key={index}
              sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                bgcolor: color,
                border: '1px solid rgba(0,0,0,0.1)',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
            />
          ))}
        </Box>
      )}
      
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 0.5 }}>
          {name}
        </Typography>
        
        {rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <Rating value={rating} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              ({rating})
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          {discount ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {Math.round(price * (100 / (100 - discount)))} TL
              </Typography>
              <Typography variant="h6" color="error.main" fontWeight="bold">
                {price} TL
              </Typography>
            </>
          ) : (
            <Typography variant="h6" color="text.primary" fontWeight="bold">
              {price} TL
            </Typography>
          )}
        </Box>
        
        <Button 
          variant="outlined" 
          fullWidth 
          sx={{ 
            mt: 2,
            color: theme.primary,
            borderColor: theme.primary,
            '&:hover': {
              borderColor: theme.primaryDark,
              bgcolor: 'rgba(0,115,152,0.04)'
            }
          }}
        >
          İncele
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 