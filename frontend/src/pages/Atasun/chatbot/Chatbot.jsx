import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseChatbot from '../../basechatbot/BaseChatbot';
import theme from '../../../themes/Atasun/theme';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Button, 
  Paper,
  useMediaQuery,
  useTheme as useMuiTheme,
  Fade,
  IconButton
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatIcon from '@mui/icons-material/Chat';

const AtasunChatbot = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const checkAuth = useCallback(async () => {
    try {
      // Check authentication status (using localStorage for demo)
      const token = localStorage.getItem('auth_token');
      const userDataStr = localStorage.getItem('user_data');
      
      if (token && userDataStr) {
        // Demo: If token exists, user is considered logged in
        setIsAuthenticated(true);
        setUserData(JSON.parse(userDataStr));
      } else {
        // Continue as anonymous user if not logged in
        setIsAuthenticated(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    
    // Listen for storage changes (e.g., when user logs out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  const handleLogin = () => {
    // Redirect to login page
    navigate('/atasun/login', { state: { returnUrl: '/atasun/chatbot' } });
  };
  
  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  // Show loading indicator
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

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Login Button (for non-authenticated users) */}
      {!isAuthenticated && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            zIndex: 100,
            display: 'flex',
            gap: 1
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: theme.primary,
              '&:hover': {
                backgroundColor: '#fff',
              },
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(4px)'
            }}
          >
            Giriş Yap
          </Button>
        </Box>
      )}
      
      {/* Info Banner - Shows usage information for anonymous users */}
      {!isAuthenticated && showInfo && (
        <Fade in={showInfo}>
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              top: isMobile ? 80 : 16,
              left: isMobile ? 16 : 'auto',
              right: isMobile ? 16 : 16,
              zIndex: 100,
              p: 2,
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(4px)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              maxWidth: isMobile ? 'auto' : 320,
              border: '1px solid rgba(0,115,152,0.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <SupportAgentIcon sx={{ color: theme.primary, mr: 1.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Üye girişi yapmadan da destek alabilirsiniz. Daha kişiselleştirilmiş destek için giriş yapın.
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={handleCloseInfo}
              sx={{ ml: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Fade>
      )}
      
      {/* Main Chatbot Component */}
      <BaseChatbot
        logo={theme.logo}
        title="Atasun Optik Asistan"
        primary={theme.primary}
        secondary={theme.secondary}
        companyName="Atasun"
        userData={userData}
        isAuthenticated={isAuthenticated}
        onLoginRequired={handleLogin}
        welcomeMessage={isAuthenticated 
          ? `Merhaba ${userData?.name || ''}! Size nasıl yardımcı olabilirim?` 
          : 'Merhaba! Atasun Optik online asistanı olarak size nasıl yardımcı olabilirim?'
        }
        suggestions={[
          'Siparişimi nasıl takip edebilirim?',
          'Lenslerin kullanım süresi ne kadardır?',
          'En yakın mağazanız nerede?',
          'İade ve değişim koşulları nelerdir?'
        ]}
        placeholderText="Bir soru sorun..."
        sendButtonAriaLabel="Mesajı gönder"
        poweredByText="Atasun Optik"
      />
    </Box>
  );
};

export default AtasunChatbot; 