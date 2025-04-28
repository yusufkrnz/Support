import React, { useRef } from 'react';
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
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ChatIcon from '@mui/icons-material/Chat';
import AndroidIcon from '@mui/icons-material/Android';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const chatbotRef = useRef();

  const features = [
    {
      title: '7/24 Destek',
      description: 'Uzman ekibimiz her zaman yanınızda.',
      image: 'https://source.unsplash.com/400x300/?customer-service',
      icon: <HeadsetMicIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    },
    {
      title: 'Hızlı Çözüm',
      description: 'Sorunlarınıza anında çözüm buluyoruz.',
      image: 'https://source.unsplash.com/400x300/?solution',
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    },
    {
      title: 'Güvenilir Hizmet',
      description: 'Kaliteli ve güvenilir hizmet garantisi.',
      image: 'https://source.unsplash.com/400x300/?trust',
      icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    },
  ];

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.4,
        zIndex: -1,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.75) 0%, rgba(195, 207, 226, 0.75) 100%)',
        zIndex: -1,
      }
    }}>
      <Box
        sx={{
          color: 'text.primary',
          py: 4,
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            SupportHub Destek Merkezi
          </Typography>
          <Typography variant="h5" paragraph sx={{ color: 'text.secondary' }}>
            Müşteri hizmetlerinde yanınızdayız
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item key={index} xs={12} sm={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => chatbotRef.current?.setOpen(true)}
              startIcon={<AndroidIcon />}
              sx={{
                background: 'linear-gradient(45deg, #ff4081 30%, #ff80ab 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
                },
                minWidth: '200px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Sorun Nedir?
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/login"
              startIcon={<ChatIcon />}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                },
                minWidth: '200px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Giriş Yap
            </Button>
          </Box>
        </Container>
      </Box>
      <Chatbot ref={chatbotRef} />
    </Box>
  );
};

export default Home; 