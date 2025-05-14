import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseChatbot from '../../basechatbot/BaseChatbot';
import theme from '../../../themes/Bim/theme';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const BimChatbot = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı kimlik doğrulama durumunu kontrol et
    const checkAuth = async () => {
      try {
        // API'den kimlik doğrulamasını kontrol et (demo için localStorage kullanıyoruz)
        const token = localStorage.getItem('auth_token');
        const userDataStr = localStorage.getItem('user_data');
        
        if (token && userDataStr) {
          // Demo: Token varsa kullanıcı giriş yapmış kabul ediyoruz
          setIsAuthenticated(true);
          setUserData(JSON.parse(userDataStr));
        } else {
          // Kullanıcı giriş yapmadıysa anonim kullanıcı olarak devam et
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    // Login sayfasına yönlendir
    navigate('/bim/login', { state: { returnUrl: '/bim/chatbot' } });
  };

  // Loading durumunda yükleniyor göster
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
        }}
      >
        <CircularProgress sx={{ color: '#fff', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#fff' }}>
          Yükleniyor...
        </Typography>
      </Box>
    );
  }

  // Doğrudan chatbot göster, login olmayan kullanıcılar için de erişilebilir
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {!isAuthenticated && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            zIndex: 100 
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            sx={{
              backgroundColor: theme.primary,
              '&:hover': {
                backgroundColor: theme.secondary,
              },
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Giriş Yap
          </Button>
        </Box>
      )}
      
      <BaseChatbot
        logo={theme.logo}
        title="Bim Chatbot"
        primary={theme.primary}
        secondary={theme.secondary}
        companyName="Bim"
        userData={userData}
        isAuthenticated={isAuthenticated}
        onLoginRequired={handleLogin}
      />
    </Box>
  );
};

export default BimChatbot; 