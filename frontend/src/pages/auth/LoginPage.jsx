import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import authService from '../../services/auth';
import { motion } from 'framer-motion';
import animatedCharacter from '../../assets/animated-character.gif';

const PageContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'stretch',
  padding: 0,
  margin: 0,
  maxWidth: '100% !important',
  overflow: 'hidden'
}));

const IllustrationContainer = styled(Box)(({ theme }) => ({
  flex: '1.4',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(4, 3),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

const WelcomeText = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  width: '100%',
  maxWidth: '500px'
}));

const AnimatedCharacter = styled('img')(({ theme }) => ({
  width: '45%',
  height: 'auto',
  objectFit: 'contain',
  position: 'relative'
}));

const LoginForm = styled(Box)(({ theme }) => ({
  flex: '0.6',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(4, 3),
  [theme.breakpoints.down('md')]: {
    flex: '1',
  }
}));

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '320px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  width: '100%'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#F5F5F5',
    height: '45px',
    marginBottom: theme.spacing(1),
    '& fieldset': {
      borderColor: 'transparent'
    },
    '&:hover fieldset': {
      borderColor: '#FFA500'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFA500'
    }
  }
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2)
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#FFA500',
  height: '40px',
  '&:hover': {
    backgroundColor: '#FF8C00',
  }
}));

const ChatbotButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#4CAF50',
  color: '#fff',
  height: '40px',
  whiteSpace: 'nowrap',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: '#388E3C',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1)
  }
}));

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Kullanıcı bilgilerini kontrol et
      let userData;
      if (username === 'admin@example.com' && password === 'admin') {
        userData = {
          id: 1,
          username: 'admin@example.com',
          fullName: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
          token: 'mock-jwt-token-admin'
        };
      } else if (username === 'rep@example.com' && password === 'rep') {
        userData = {
          id: 2,
          username: 'rep@example.com',
          fullName: 'Ahmet Yılmaz',
          email: 'rep@example.com',
          role: 'REPRESENTATIVE',
          token: 'mock-jwt-token-rep'
        };
      } else if (username === 'customer@example.com' && password === 'customer') {
        userData = {
          id: 4,
          username: 'customer@example.com',
          fullName: 'Mehmet Kaya',
          email: 'customer@example.com',
          role: 'CUSTOMER',
          token: 'mock-jwt-token-customer'
        };
      } else {
        throw new Error('Geçersiz kullanıcı adı veya şifre');
      }

      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Role göre yönlendirme
      switch (userData.role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'REPRESENTATIVE':
          navigate('/representative');
          break;
        case 'CUSTOMER':
          navigate('/customer');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError('Kullanıcı adı veya şifre hatalı');
      console.error('Login error:', err);
    }
  };

  const handleChatbot = () => {
    // Geçici misafir kullanıcı oluştur
    const guestUser = {
      id: Date.now(),
      username: `guest_${Date.now()}`,
      fullName: 'Misafir Kullanıcı',
      email: `guest_${Date.now()}@example.com`,
      role: 'GUEST',
      token: 'mock-jwt-token-guest'
    };

    // Geçici kullanıcı bilgilerini localStorage'a kaydet
    localStorage.setItem('user', JSON.stringify(guestUser));
    
    // Chatbot sayfasına yönlendir
    navigate('/customer/chat');
  };

  return (
    <PageContainer maxWidth={false} disableGutters>
      <IllustrationContainer>
        <WelcomeText>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              color: '#2C3E50',
              mb: 1.5,
              fontSize: { xs: '2rem', md: '2.4rem' }
            }}
          >
            Hoş Geldiniz! 👋
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#666',
              mb: 1.5,
              fontWeight: 500,
              fontSize: '1.2rem'
            }}
          >
            7/24 Destek Hizmeti
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              fontSize: '1rem',
              maxWidth: '450px',
              margin: '0 auto'
            }}
          >
            Size yardımcı olmak için buradayız. Hızlı çözümler ve profesyonel destek için giriş yapın veya chatbot ile görüşün.
          </Typography>
        </WelcomeText>
        <AnimatedCharacter
          src={animatedCharacter}
          alt="Support character"
          component={motion.img}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </IllustrationContainer>
      <LoginForm component="form" onSubmit={handleSubmit}>
        <FormContainer>
          <StyledPaper elevation={3}>
            <Box sx={{ mb: 3, textAlign: 'left' }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  mb: 1,
                  color: '#2C3E50'
                }}
              >
                Tekrar Hoşgeldiniz
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  fontSize: '0.9rem'
                }}
              >
                Destek sistemine giriş yapın
              </Typography>
            </Box>

            <StyledTextField
              fullWidth
              placeholder="Kullanıcı Adı"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
            />

            <StyledTextField
              fullWidth
              placeholder="Şifre"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              helperText={error}
            />

            <ButtonContainer>
              <StyledButton
                fullWidth
                variant="contained"
                type="submit"
              >
                Giriş Yap
              </StyledButton>
              <ChatbotButton
                fullWidth
                variant="contained"
                onClick={handleChatbot}
                startIcon={<span role="img" aria-label="chat">💬</span>}
              >
                Sizi Dinliyoruz
              </ChatbotButton>
            </ButtonContainer>
          </StyledPaper>
        </FormContainer>
      </LoginForm>
    </PageContainer>
  );
};

export default LoginPage; 