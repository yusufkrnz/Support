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
  CircularProgress,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import demoLoginInfo from '../../demo-login-info';
import { authService } from '../../services/api';

// BİM teması
const theme = {
  primary: '#ED1C24', // BİM kırmızı
  primaryDark: '#C8151B', // BİM koyu kırmızı
  secondary: '#003368', // BİM lacivert
  background: '#F5F5F5', // Açık gri arkaplan
  text: '#333',
  logo: '/assets/logos/bim.png'
};

const BimLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoInfo, setShowDemoInfo] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Login isteği gönderiliyor:', { email, password, company: 'BIM' });
      
      // Login işlemi
      const response = await authService.login({ 
        email, 
        password, 
        company: 'BIM' 
      });
      
      console.log('Login yanıtı:', response);
      
      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user || {}));
        
        // Kullanıcı tipine göre yönlendirme
        const userType = response.user?.userType || '';
        
        if (userType.toUpperCase() === 'ADMIN') {
          navigate('/bim/admin/dashboard');
        } else if (userType.toUpperCase() === 'MANAGER') {
          navigate('/bim/manager/dashboard');
        } else if (userType.toUpperCase() === 'CUSTOMER') {
          navigate('/bim/customer/dashboard');
        } else {
          navigate('/bim/dashboard');
        }
      } else {
        setError('Geçersiz yanıt formatı. Token bulunamadı.');
      }
    } catch (err) {
      console.error('Giriş hatası:', err);
      let errorMessage = 'Giriş başarısız';
      
      if (err.response) {
        // Sunucudan gelen hata mesajı
        errorMessage += ': ' + (err.response.data?.message || 'Sunucu hatası');
        console.error('Sunucu yanıtı:', err.response.data);
      } else if (err.request) {
        // İstek gönderildi ama yanıt gelmedi
        errorMessage += ': Sunucudan yanıt alınamadı';
        console.error('İstek detayları:', err.request);
      } else {
        // İstek oluşturulurken hata
        errorMessage += ': ' + (err.message || 'Bilinmeyen hata');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const fillDemoUser = (user) => {
    setEmail(user.email);
    setPassword(user.password);
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
            <img src={theme.logo} alt="BİM" style={{ maxWidth: '180px', marginBottom: '1rem' }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color={theme.primary}>
              BİM Destek
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              BİM müşteri destek portalına hoş geldiniz.
            </Typography>
            <Box component="img" 
              src="/assets/bim-support.png" 
              alt="Support" 
              sx={{ 
                maxWidth: '100%', 
                height: 'auto',
                display: { xs: 'none', md: 'block' }
              }} 
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            {showDemoInfo && (
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">Demo Giriş Bilgileri</Typography>
                  <Button size="small" onClick={() => setShowDemoInfo(false)}>Gizle</Button>
                </Box>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'left' }}>
                  Aşağıdaki demo kullanıcılarla giriş yapabilirsiniz:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, justifyContent: 'center' }}>
                  {demoLoginInfo.users.map((user, index) => (
                    <Button 
                      key={index}
                      variant="outlined" 
                      size="small"
                      onClick={() => fillDemoUser(user)}
                      sx={{ mb: 1 }}
                    >
                      {user.role}: {user.email}
                    </Button>
                  ))}
                </Box>
                
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Tüm demo kullanıcılar için şifre: password123
                </Typography>
              </Paper>
            )}
            
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
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
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
                onClick={() => navigate('/bim')}
                sx={{ 
                  color: theme.primary, 
                  borderColor: theme.primary,
                  '&:hover': {
                    borderColor: theme.primaryDark,
                    bgcolor: 'rgba(237, 28, 36, 0.05)'
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

export default BimLoginPage; 