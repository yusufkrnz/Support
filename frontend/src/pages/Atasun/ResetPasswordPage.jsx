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
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Card,
  useMediaQuery,
  useTheme as useMuiTheme,
  Fade,
  InputAdornment
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { 
  ArrowBack, 
  Visibility, 
  VisibilityOff, 
  Email, 
  LockReset, 
  CheckCircleOutline, 
  VpnKey 
} from '@mui/icons-material';
import theme from '../../themes/Atasun/theme';
import { authService } from '../../services/api';

const steps = ['E-posta Doğrulama', 'Kod Doğrulama', 'Şifre Değiştirme'];

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState(location.state?.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleSendVerification = async () => {
    if (!email) {
      setError('Lütfen e-posta adresinizi girin');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Backend integration will be implemented here
      // Simulation for now
      setTimeout(() => {
        setNotification({
          open: true,
          message: 'Doğrulama kodu e-posta adresinize gönderildi',
          severity: 'success'
        });
        setLoading(false);
        setActiveStep(1);
      }, 1500);
      
      // Real implementation:
      // const response = await authService.sendPasswordResetCode(email);
      // if (response.success) {
      //   setNotification({...});
      //   setActiveStep(1);
      // } else {
      //   setError(response.message);
      // }
    } catch (error) {
      setLoading(false);
      setError('Doğrulama kodu gönderilirken bir hata oluştu');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('Lütfen doğrulama kodunu girin');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Backend integration will be implemented here
      // Simulation for now
      setTimeout(() => {
        // Every code is accepted for demo purposes
        setNotification({
          open: true,
          message: 'Doğrulama kodu onaylandı',
          severity: 'success'
        });
        setLoading(false);
        setActiveStep(2);
      }, 1500);
      
      // Real implementation:
      // const response = await authService.verifyPasswordResetCode(email, verificationCode);
      // if (response.success) {
      //   setNotification({...});
      //   setActiveStep(2);
      // } else {
      //   setError(response.message);
      // }
    } catch (error) {
      setLoading(false);
      setError('Doğrulama kodu onaylanırken bir hata oluştu');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError('Lütfen yeni şifrenizi girin');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Backend integration will be implemented here
      // Simulation for now
      setTimeout(() => {
        setNotification({
          open: true,
          message: 'Şifreniz başarıyla değiştirildi! Giriş sayfasına yönlendiriliyorsunuz.',
          severity: 'success'
        });
        
        setLoading(false);
        
        // Redirect to login page
        setTimeout(() => {
          navigate('/atasun/login', { state: { email } });
        }, 2000);
      }, 1500);
      
      // Real implementation:
      // const response = await authService.resetPassword(email, verificationCode, newPassword);
      // if (response.success) {
      //   setNotification({...});
      //   setTimeout(() => navigate('/atasun/login', { state: { email } }), 2000);
      // } else {
      //   setError(response.message);
      // }
    } catch (error) {
      setLoading(false);
      setError('Şifre sıfırlanırken bir hata oluştu');
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 0:
        return <Email color={activeStep >= 0 ? 'primary' : 'disabled'} />;
      case 1:
        return <VpnKey color={activeStep >= 1 ? 'primary' : 'disabled'} />;
      case 2:
        return <LockReset color={activeStep >= 2 ? 'primary' : 'disabled'} />;
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="body1" mb={3}>
                Şifrenizi sıfırlamak için lütfen hesabınıza bağlı e-posta adresinizi girin. 
                Size bir doğrulama kodu göndereceğiz.
              </Typography>
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
              <Button
                variant="contained"
                fullWidth
                onClick={handleSendVerification}
                disabled={loading}
                sx={{
                  bgcolor: theme.primary,
                  '&:hover': {
                    bgcolor: theme.primaryDark
                  },
                  py: 1.5,
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(0, 115, 152, 0.5)',
                    color: '#fff'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Doğrulama Kodu Gönder'}
              </Button>
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="body1" mb={3}>
                E-posta adresinize gönderilen 6 haneli doğrulama kodunu girin.
              </Typography>
              <TextField
                label="Doğrulama Kodu"
                variant="outlined"
                fullWidth
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey sx={{ color: 'text.secondary' }} />
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
              <Button
                variant="contained"
                fullWidth
                onClick={handleVerifyCode}
                disabled={loading}
                sx={{
                  bgcolor: theme.primary,
                  '&:hover': {
                    bgcolor: theme.primaryDark
                  },
                  py: 1.5,
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(0, 115, 152, 0.5)',
                    color: '#fff'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Doğrulama Kodunu Onayla'}
              </Button>
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="body1" mb={3}>
                Lütfen yeni şifrenizi belirleyin. Şifreniz en az 8 karakter olmalıdır.
              </Typography>
              <TextField
                label="Yeni Şifre"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockReset sx={{ color: 'text.secondary' }} />
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
                label="Şifreyi Onayla"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockReset sx={{ color: 'text.secondary' }} />
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
              <Button
                variant="contained"
                fullWidth
                onClick={handleResetPassword}
                disabled={loading}
                sx={{
                  bgcolor: theme.primary,
                  '&:hover': {
                    bgcolor: theme.primaryDark
                  },
                  py: 1.5,
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(0, 115, 152, 0.5)',
                    color: '#fff'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Şifreyi Yenile'}
              </Button>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex',
      flexDirection: 'column', 
      bgcolor: theme.background,
      py: { xs: 3, md: 8 }
    }}>
      <Container maxWidth="md">
        <Box 
          component={RouterLink} 
          to="/atasun/login" 
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
          <Typography variant="body2">Giriş Sayfasına Dön</Typography>
        </Box>

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
            <Typography variant="h5" mb={4} color={theme.primary} fontWeight="bold" textAlign="center">
              Şifre Yenileme
            </Typography>
            
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel
              sx={{ 
                mb: 5,
                '.MuiStepLabel-label': {
                  mt: 1
                },
                '.MuiStepConnector-line': {
                  borderTopWidth: 3
                },
                '.MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                  borderColor: theme.primary
                },
                '.MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                  borderColor: theme.primary
                }
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={() => getStepIcon(index)}>
                    {!isMobile && label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  '& .MuiAlert-icon': {
                    color: '#f44336'
                  }
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}
            
            {renderStepContent()}
          </Box>
        </Card>
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

export default ResetPasswordPage; 