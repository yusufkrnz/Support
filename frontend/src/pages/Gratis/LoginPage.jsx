import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container, 
  Grid, 
  Link, 
  InputAdornment, 
  IconButton, 
  CircularProgress 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Gratis teması
const theme = {
  primary: '#E6007E', // Gratis pembe
  primaryDark: '#C5006B', // Gratis koyu pembe
  secondary: '#10069F', // Gratis lacivert
  background: '#F9F0F5', // Açık pembe tonlu arkaplan
  text: '#333',
  logo: '/assets/logos/gratis.png'
};

const GratisLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gerçek uygulamada API'ye istek yapılacak
      // const response = await api.login({ email, password });
      
      // Simüle edilmiş login
      setTimeout(() => {
        setLoading(false);
        // localStorage.setItem('token', response.token);
        // localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isCustomerLoggedIn', 'true');
        localStorage.setItem('customerCompany', 'gratis');
        navigate('/gratis/dashboard');
      }, 1500);
    } catch (error) {
      setLoading(false);
      setError('Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      bgcolor: theme.background,
      py: 8 
    }}>
      <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <img src={theme.logo} alt="Gratis" style={{ maxWidth: '180px', marginBottom: '1rem' }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color={theme.primary}>
              Gratis Destek
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Gratis müşteri destek portalına hoş geldiniz.
            </Typography>
            <Box component="img" 
              src="/assets/gratis-support.png" 
              alt="Support" 
              sx={{ 
                maxWidth: '100%', 
                height: 'auto',
                display: { xs: 'none', md: 'block' }
              }} 
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                border: `1px solid ${theme.primary}`,
                borderLeft: `5px solid ${theme.primary}`
              }}
            >
              <Typography variant="h5" mb={3} color={theme.primary} fontWeight="bold">
                Müşteri Girişi
              </Typography>
              
              {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="E-posta"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: theme.primary,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.primary,
                    }
                  }} 
                />
                
                <TextField
                  label="Şifre"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
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
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: theme.primary,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.primary,
                    }
                  }} 
                />
                
                <Button 
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 2, 
                    mb: 2, 
                    py: 1.5,
                    bgcolor: theme.primary,
                    '&:hover': {
                      bgcolor: theme.primaryDark
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
                </Button>
                
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Link 
                      href="#" 
                      variant="body2"
                      sx={{ 
                        color: theme.primary,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Şifremi Unuttum
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link 
                      href="#" 
                      variant="body2"
                      sx={{ 
                        color: theme.primary,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Yeni Hesap Oluştur
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            
            <Box mt={3} textAlign="center">
              <Button 
                variant="outlined" 
                onClick={() => navigate('/gratis')}
                sx={{ 
                  color: theme.primary, 
                  borderColor: theme.primary,
                  '&:hover': {
                    borderColor: theme.primaryDark,
                    bgcolor: 'rgba(230, 0, 126, 0.05)'
                  } 
                }}
              >
                Ana Sayfaya Dön
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default GratisLoginPage; 