import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  Paper
} from '@mui/material';
import { login, mockAuthenticate } from '../../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gerçek API yerine mock kimlik doğrulama kullan
      const result = mockAuthenticate(email, password);
      
      if (result) {
        const { token, userInfo } = result;
        
        // Token ve kullanıcı bilgilerini kaydet
        login(token, userInfo);
        
        // Kullanıcı rolüne göre yönlendir
        switch (userInfo.role) {
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
            navigate('/login');
        }
      } else {
        setError('Geçersiz e-posta veya şifre');
      }
    } catch (err) {
      setError('Giriş sırasında bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSupportClick = () => {
    navigate('/support');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Destek Hizmeti Giriş
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="text" 
                color="primary" 
                onClick={handleSupportClick}
                size="small"
              >
                Destek Hattı
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Demo Kullanıcılar:
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Admin: admin@example.com / admin123
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Temsilci: rep@example.com / rep123
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Müşteri: customer@example.com / customer123
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage; 