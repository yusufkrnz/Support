import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: '7/24 Destek',
      description: 'Uzman ekibimiz her zaman yanınızda.',
      image: 'https://source.unsplash.com/400x300/?customer-service',
    },
    {
      title: 'Hızlı Çözüm',
      description: 'Sorunlarınıza anında çözüm buluyoruz.',
      image: 'https://source.unsplash.com/400x300/?solution',
    },
    {
      title: 'Güvenilir Hizmet',
      description: 'Kaliteli ve güvenilir hizmet garantisi.',
      image: 'https://source.unsplash.com/400x300/?trust',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            SupportHub Destek Merkezi
          </Typography>
          <Typography variant="h5" paragraph>
            Müşteri hizmetlerinde yanınızdayız
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/register"
            sx={{ mt: 2 }}
          >
            Hemen Başla
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography>{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Yardıma mı ihtiyacınız var?
          </Typography>
          <Typography variant="h6" paragraph color="text.secondary">
            Destek ekibimiz size yardımcı olmak için hazır.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/login"
          >
            Giriş Yap
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 