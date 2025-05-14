import React from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import theme from '../../themes/Bim/theme';
import { useNavigate } from 'react-router-dom';
import MessageIcon from '@mui/icons-material/Message';
import SupportIcon from '@mui/icons-material/Support';

const BimDashboard = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ background: theme.background, color: theme.text, minHeight: '100vh', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/bim/login')}
        >
          Giriş Yap
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => navigate('/bim/chatbot')}
        >
          Hızlı Destek
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <img src={theme.logo} alt="Bim" style={{ height: 80 }} />
        <Typography variant="h3" fontWeight="bold" sx={{ mt: 2 }}>Bim Destek</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>Uygun fiyat, hızlı destek!</Typography>
        
        <Container maxWidth="sm" sx={{ mt: 6 }}>
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<SupportIcon />}
            onClick={() => navigate('/bim/chatbot')}
            sx={{ 
              my: 2, 
              bgcolor: theme.primary,
              '&:hover': {
                bgcolor: theme.primaryDark
              }
            }}
          >
            Yeni Destek Talebi
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<MessageIcon />}
            onClick={() => navigate('/bim/messaging')}
            sx={{ 
              my: 2, 
              bgcolor: theme.primary,
              '&:hover': {
                bgcolor: theme.primaryDark
              }
            }}
          >
            Mesajlarım
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default BimDashboard; 