import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Paper,
  Divider,
  Link,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import SupportIcon from '@mui/icons-material/Support';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import theme from '../../themes/Atasun/theme';
import { motion } from 'framer-motion';

// Product images
import atasunImage1 from '../../assets/images/atasunn1.webp';
import atasunImage2 from '../../assets/images/atasunn2.webp';
import atasunImage3 from '../../assets/images/atasunn3.webp';

// Sample product data with improved images
const popularProducts = [
  {
    id: 1,
    name: 'Ray-Ban Aviator',
    price: 1299,
    rating: 4.8,
    discount: 15,
    image: '/assets/illustrations/glasses.svg',
    description: 'Klasik metal çerçeve, UV korumalı cam'
  },
  {
    id: 2,
    name: 'Gucci GG0396S',
    price: 1749,
    rating: 4.5,
    isNew: true,
    image: '/assets/illustrations/glasses.svg',
    description: 'Modern tasarım, premium kalite'
  },
  {
    id: 3,
    name: 'Atasun Oval',
    price: 599,
    rating: 4.7,
    image: '/assets/illustrations/glasses.svg',
    description: 'Hafif çerçeve, konforlu kullanım'
  },
  {
    id: 4,
    name: 'Police SPL744',
    price: 899,
    discount: 20,
    image: '/assets/illustrations/glasses.svg',
    description: 'Sportif tasarım, dayanıklı yapı'
  },
  {
    id: 5,
    name: 'Tommy Hilfiger',
    price: 999,
    discount: 10,
    image: '/assets/illustrations/glasses.svg',
    description: 'Şık tasarım, unisex model'
  },
  {
    id: 6,
    name: 'Carrera 1007/S',
    price: 1199,
    rating: 4.6,
    image: '/assets/illustrations/glasses.svg',
    description: 'Polarize cam, metal çerçeve'
  }
];

// Featured cards for rotating showcase
const featuredItems = [
  {
    id: 1,
    title: 'Tasarım Gözlükler',
    subtitle: 'En son koleksiyon',
    image: atasunImage1,
    color: '#2A9DF4'
  },
  {
    id: 2,
    title: 'Güneş Gözlükleri',
    subtitle: 'Yaz sezonu',
    image: atasunImage2,
    color: '#FF6B6B'
  },
  {
    id: 3,
    title: 'Optik Çerçeveler',
    subtitle: 'Hafif & Dayanıklı',
    image: atasunImage3,
    color: '#37B47E'
  }
];

// Brands we carry
const brands = [
  { id: 1, name: 'Ray-Ban', logo: '/assets/logos/atasun.svg' },
  { id: 2, name: 'Gucci', logo: '/assets/logos/atasun.svg' },
  { id: 3, name: 'Prada', logo: '/assets/logos/atasun.svg' },
  { id: 4, name: 'Versace', logo: '/assets/logos/atasun.svg' }
];

const RotatingCard = ({ item, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 5000 + (index * 1000)); // Stagger the flipping
    
    return () => clearInterval(interval);
  }, [index]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      style={{ 
        width: '100%', 
        height: 380, 
        perspective: 1000,
        cursor: 'pointer'
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front of card */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backgroundColor: item.color,
            backfaceVisibility: 'hidden',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: 3
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="white" sx={{ mb: 1 }}>
            {item.title}
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.8, mb: 2 }}>
            {item.subtitle}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 'auto',
            color: 'white'
          }}>
            <Button 
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                color: 'white',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Keşfet
            </Button>
          </Box>
          <Box sx={{ 
            position: 'absolute', 
            right: -50, 
            bottom: -50, 
            width: 220, 
            height: 220, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255,255,255,0.1)' 
          }} />
          <Box sx={{ 
            position: 'absolute', 
            right: -30, 
            top: -30, 
            width: 100, 
            height: 100, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255,255,255,0.1)' 
          }} />
        </Box>
        
        {/* Back of card */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            overflow: 'hidden'
          }}
        >
          <img 
            src={item.image} 
            alt={item.title}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            p: 3
          }}>
            <Typography variant="h5" fontWeight="bold" color="white">
              {item.title}
            </Typography>
            <Typography variant="body1" color="white" sx={{ opacity: 0.8, mb: 2 }}>
              {item.subtitle}
            </Typography>
            <Button 
              variant="contained"
              sx={{ 
                bgcolor: 'white', 
                color: theme.primary,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
              }}
            >
              İncele
            </Button>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
};

const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        elevation={isHovered ? 4 : 0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-8px)' : 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {product.discount && (
          <Box sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: '#FF3D57',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            px: 1.5,
            py: 0.5,
            borderRadius: 10,
            zIndex: 1
          }}>
            %{product.discount}
          </Box>
        )}
        
        {product.isNew && (
          <Box sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: theme.primary,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            px: 1.5,
            py: 0.5,
            borderRadius: 10,
            zIndex: 1
          }}>
            Yeni
          </Box>
        )}
        
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          sx={{ 
            objectFit: 'contain', 
            bgcolor: '#f8f9fa',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        
        <CardContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          p: 3
        }}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            {product.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2, flexGrow: 1 }}
          >
            {product.description}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto'
          }}>
            <Box>
              {product.discount ? (
                <>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {Math.round(product.price * (100 / (100 - product.discount)))} TL
                  </Typography>
                  <Typography variant="h6" color="#FF3D57" fontWeight="bold">
                    {product.price} TL
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" fontWeight="bold">
                  {product.price} TL
                </Typography>
              )}
            </Box>
            
            <IconButton
              sx={{ 
                bgcolor: theme.primary,
                color: 'white',
                '&:hover': {
                  bgcolor: theme.primaryDark
                }
              }}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ECommerceDashboard = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.down('lg'));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                color="inherit" 
                sx={{ display: { xs: 'flex', md: 'none' }, color: theme.text, mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <img src="/assets/logos/atasun.svg" alt="Atasun Optik" style={{ height: 40 }} />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: '#f5f5f5', 
              borderRadius: 2,
              px: 2,
              flex: 1,
              mx: 3,
              maxWidth: 400,
              display: { xs: 'none', md: 'flex' } 
            }}>
              <InputBase
                placeholder="Ürün Ara..."
                sx={{ flex: 1 }}
              />
              <IconButton sx={{ color: theme.primary }}>
                <SearchIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton sx={{ color: theme.text, display: { xs: 'flex', md: 'none' } }}>
                <SearchIcon />
              </IconButton>
              
              <Button 
                color="primary" 
                startIcon={<SupportIcon />}
                onClick={() => navigate('/atasun/chatbot')}
                sx={{ 
                  display: { xs: 'none', sm: 'flex' },
                  fontWeight: 'medium',
                  '&:hover': { color: theme.primaryDark }
                }}
              >
                Hızlı Destek
              </Button>
              
              <IconButton sx={{ color: theme.text }}>
                <Badge badgeContent={2} color="error">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
              
              <IconButton sx={{ color: theme.text }}>
                <Badge badgeContent={3} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              
              <IconButton sx={{ color: theme.text }} onClick={() => navigate('/atasun/login')}>
                <PersonIcon />
              </IconButton>
            </Box>
          </Toolbar>
          
          {/* Navigation Tabs */}
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                minWidth: 'auto',
                px: 2
              },
              '& .Mui-selected': {
                color: `${theme.primary} !important`,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.primary,
              }
            }}
          >
            <Tab label="Ana Sayfa" />
            <Tab label="Optik Gözlükler" />
            <Tab label="Güneş Gözlükleri" />
            <Tab label="Lensler" />
            <Tab label="Markalar" />
            <Tab label="Kampanyalar" />
          </Tabs>
        </Container>
      </AppBar>

      {/* Featured Rotating Cards Section */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {featuredItems.map((item, index) => (
            <Grid item xs={12} md={4} key={item.id}>
              <RotatingCard item={item} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Popular Products */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" fontWeight="bold">
            Popüler Ürünler
          </Typography>
          <Button 
            variant="text" 
            endIcon={<ArrowForwardIcon />}
            sx={{ color: theme.primary }}
          >
            Tümünü Gör
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {popularProducts.slice(0, isTablet ? 4 : 6).map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={product.id}>
              <ProductCard product={product} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Support Banner */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: theme.primary,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Yardıma mı ihtiyacınız var?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Ürünlerimiz, siparişleriniz veya diğer konularda destek almak için hızlı destek hattımızı kullanabilirsiniz.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/atasun/chatbot')}
                startIcon={<SupportIcon />}
                sx={{ 
                  bgcolor: 'white',
                  color: theme.primary,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Hızlı Destek
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img 
                  src="/assets/illustrations/customer-service.svg" 
                  alt="Müşteri Hizmetleri" 
                  style={{ maxHeight: 150, objectFit: 'contain' }} 
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
      {/* Brands Carousel */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
          Markalar
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {brands.map((brand) => (
            <Grid item xs={6} sm={3} key={brand.id}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  borderRadius: 4,
                  height: 120,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  style={{ height: 40, marginBottom: 10 }} 
                />
                <Typography variant="body1" fontWeight="medium">
                  {brand.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Footer */}
      <Box sx={{ bgcolor: 'white', py: 4, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <img src="/assets/logos/atasun.svg" alt="Atasun Optik" style={{ height: 40, marginBottom: 16 }} />
                <Typography variant="body2" color="text.secondary">
                  Atasun Optik, Türkiye'nin lider optik perakendecisidir. 1935'ten bu yana yüksek kaliteli gözlük, lens ve güneş gözlüğü ürünleri sunar.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Ürünlerimiz
              </Typography>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>Optik Gözlükler</Link>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>Güneş Gözlükleri</Link>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>Lensler</Link>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Kurumsal
              </Typography>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>Hakkımızda</Link>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>Mağazalar</Link>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>İletişim</Link>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Müşteri Hizmetleri
              </Typography>
              <Link 
                href="#" 
                underline="hover" 
                color="inherit" 
                display="block" 
                sx={{ mb: 1 }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/atasun/chatbot');
                }}
              >
                Hızlı Destek
              </Link>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>SSS</Link>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>İade Koşulları</Link>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Yasal
              </Typography>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>Gizlilik Politikası</Link>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>Kullanım Koşulları</Link>
              <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>KVKK</Link>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Atasun Optik. Tüm hakları saklıdır.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ECommerceDashboard; 