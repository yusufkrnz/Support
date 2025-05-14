import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../../../hooks/useAuth';

// Gratis'e özel renk teması
const gratisTheme = {
  primary: '#E6007E', // Gratis pembe rengi
  secondary: '#4A4A4A', // Koyu gri renk
  background: '#F9F2F6'
};

const GratisLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Gratis firma adı otomatik olarak gönderiliyor
      const user = await login(email, password, 'Gratis', 'yonetim');
      
      // Başarılı giriş durumunda dashboard'a yönlendir
      navigate('/yonetim/gratis/dashboard');
    } catch (err) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        bgcolor: gratisTheme.background
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderTop: `4px solid ${gratisTheme.primary}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: gratisTheme.primary, fontWeight: 'bold' }}>
              Gratis Yönetim Paneli
            </Typography>
            <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary' }}>
              Yönetici ve Admin Girişi
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-posta Adresi"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Şifre"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 3 }}
            />
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              sx={{ 
                mt: 2, 
                bgcolor: gratisTheme.primary,
                '&:hover': { bgcolor: '#c0056a' },
                py: 1.5
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
            </Button>
          </form>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Demo Kullanıcılar:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin: admin@gratis.com / admin123
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manager: manager@gratis.com / manager123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default GratisLoginPage; 