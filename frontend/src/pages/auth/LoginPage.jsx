import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import authService from '../../services/auth';
import { motion } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import animatedCharacter from '../../assets/animated-character.gif';

const PageContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '1000px',
  minHeight: '600px',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  }
}));

const LeftSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(33, 150, 243, 0.9) 100%)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

const RightSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '& fieldset': {
      borderColor: 'rgba(25, 118, 210, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: '10px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
  color: 'white',
  width: '100%',
  '&:hover': {
    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
  }
}));

const SocialButton = styled(Button)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  borderRadius: '10px',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  margin: theme.spacing(0.5),
  borderColor: '#1976d2',
  color: '#1976d2',
  '&:hover': {
    borderColor: '#2196f3',
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
  }
}));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.login(email, password);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Geçersiz e-posta veya şifre');
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = () => {
    // Google ile giriş işlemleri
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    // Facebook ile giriş işlemleri
    console.log('Facebook login');
  };

  return (
    <PageContainer maxWidth={false}>
      <LoginContainer>
        <LeftSection
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Hoş Geldiniz! 👋
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              7/24 Destek Hizmeti
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '400px', margin: '0 auto' }}>
              Size yardımcı olmak için buradayız. Hızlı çözümler ve profesyonel destek için giriş yapın.
            </Typography>
          </Box>
          <Box
            component="img"
            src={animatedCharacter}
            alt="Support character"
            sx={{ width: '60%', maxWidth: '300px' }}
          />
        </LeftSection>

        <RightSection
          component={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper elevation={0}>
            <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
              Giriş Yap
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <StyledTextField
                fullWidth
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                placeholder="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                helperText={error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ width: '100%', textAlign: 'right', mb: 2 }}>
                <Link href="#" variant="body2" sx={{ color: '#ff1744' }}>
                  Şifremi Unuttum
                </Link>
              </Box>

              <StyledButton
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mb: 2 }}
              >
                Giriş Yap
              </StyledButton>

              <Divider sx={{ my: 2, width: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  veya
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 2 }}>
                <SocialButton
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleLogin}
                >
                  Google
                </SocialButton>
                <SocialButton
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  onClick={handleFacebookLogin}
                >
                  Facebook
                </SocialButton>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Hesabınız yok mu?{' '}
                  <Link href="/register" color="primary">
                    Kayıt Ol
                  </Link>
                </Typography>
              </Box>
            </Box>
          </StyledPaper>
        </RightSection>
      </LoginContainer>
    </PageContainer>
  );
};

export default LoginPage; 