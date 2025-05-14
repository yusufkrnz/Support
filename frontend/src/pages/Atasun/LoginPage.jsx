import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme as useMuiTheme,
  Fade,
  Card,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import theme from '../../themes/Atasun/theme';
import { authService } from '../../services/api';

const AtasunLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Return URL if provided, otherwise default dashboard
  const returnUrl = location.state?.returnUrl || '/atasun/dashboard';

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
    const customerCompany = localStorage.getItem('customerCompany');
    
    if (isLoggedIn && customerCompany === 'atasun') {
      navigate('/atasun/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authentication using authService
      const response = await authService.login({
        email: email,
        password: password,
        companyCode: 'atasun',
        companyName: 'Atasun'
      });
      
      if (response && response.success) {
        setNotification({
          open: true,
          message: 'Giriş başarılı, yönlendiriliyorsunuz...',
          severity: 'success'
        });
        
        // Save user info to localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        
        // Save session info
        localStorage.setItem('isCustomerLoggedIn', 'true');
        localStorage.setItem('customerCompany', 'atasun');
        
        // Redirect
        setTimeout(() => {
          navigate(returnUrl);
        }, 1000);
      } else {
        setError(response?.message || 'Giriş başarısız.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.');
      setLoading(false);
    }
  };

  const handlePasswordReset = () => {
    navigate('/atasun/reset-password', { state: { email } });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex',
      flexDirection: 'column', 
      bgcolor: theme.background,
      py: { xs: 3, md: 8 }
    }}>
      <Container maxWidth="lg">
        <Box 
          component={RouterLink} 
          to="/atasun" 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            mb: 4, 
            color: theme.primary,
            textDecoration: 'none',
            '&:hover': { color: theme.primaryDark }
          }}
        >
          <ArrowBack sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="body2">Ana Sayfaya Dön</Typography>
        </Box>

        <Fade in={true} timeout={800}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6} sx={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <img 
                src={theme.logo} 
                alt="Atasun" 
                style={{ 
                  maxWidth: '180px', 
                  marginBottom: '1rem' 
                }} 
              />
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                gutterBottom 
                color={theme.primary}
                sx={{ mb: 2 }}
              >
                Atasun Destek
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                mb={4}
                sx={{ 
                  maxWidth: '80%', 
                  mx: 'auto' 
                }}
              >
                Atasun Optik müşteri destek portalına hoş geldiniz. Siparişleriniz ve 
                ürünleriniz hakkında destek alabilirsiniz.
              </Typography>
              <Box 
                component="img" 
                src="/assets/atasun-support.png" 
                alt="Support" 
                sx={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  display: { xs: 'none', md: 'block' },
                  maxHeight: 350,
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)'
                }} 
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    p: 1, 
                    bgcolor: theme.primary,
                    backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                  }}
                />
                <Box sx={{ p: 4 }}>
                  <Typography 
                    variant="h5" 
                    mb={3} 
                    color={theme.primary} 
                    fontWeight="bold"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Lock sx={{ mr: 1 }} />
                    Müşteri Girişi
                  </Typography>
                  
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        '& .MuiAlert-icon': {
                          color: '#f44336'
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  <Box 
                    component="form" 
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ width: '100%' }}
                  >
                    <TextField
                      label="E-posta"
                      variant="outlined"
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 3,
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
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label={showPassword ? 'şifreyi gizle' : 'şifreyi göster'}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 1,
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
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        mb: 3
                      }}
                    >
                      <Link 
                        component="button"
                        variant="body2"
                        onClick={handlePasswordReset}
                        underline="hover"
                        sx={{ 
                          color: theme.primary,
                          '&:hover': {
                            color: theme.primaryDark
                          }
                        }}
                      >
                        Şifremi Unuttum
                      </Link>
                    </Box>
                    
                    <Button 
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{ 
                        py: 1.5, 
                        bgcolor: theme.primary,
                        '&:hover': {
                          bgcolor: theme.primaryDark
                        },
                        '&.Mui-disabled': {
                          bgcolor: 'rgba(0, 115, 152, 0.5)',
                          color: '#fff'
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Giriş Yap'
                      )}
                    </Button>
                  </Box>
                  
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      veya
                    </Typography>
                  </Divider>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/atasun/chatbot')}
                    sx={{ 
                      py: 1.5,
                      color: theme.primary,
                      borderColor: theme.primary,
                      '&:hover': {
                        borderColor: theme.primaryDark,
                        bgcolor: 'rgba(0, 115, 152, 0.05)'
                      }
                    }}
                  >
                    Hızlı Destek Al
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          mt: 'auto', 
          py: 3, 
          textAlign: 'center',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          mt: 6
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Atasun Optik. Tüm hakları saklıdır.
        </Typography>
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AtasunLoginPage; 