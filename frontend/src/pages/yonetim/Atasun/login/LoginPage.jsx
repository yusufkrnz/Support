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

// Atasun'a özel renk teması
const atasunTheme = {
  primary: '#00539B', // Atasun mavi rengi
  secondary: '#FF671F', // Turuncu vurgu rengi
  background: '#F5F7FA'
};

const AtasunLoginPage = () => {
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
      // Atasun firma adı otomatik olarak gönderiliyor
      const user = await login(email, password, 'Atasun', 'yonetim');
      
      // Başarılı giriş durumunda dashboard'a yönlendir
      navigate('/yonetim/atasun/dashboard');
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
        bgcolor: atasunTheme.background
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderTop: `4px solid ${atasunTheme.primary}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: atasunTheme.primary, fontWeight: 'bold' }}>
              Atasun Yönetim Paneli
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
                bgcolor: atasunTheme.primary,
                '&:hover': { bgcolor: '#003a6d' },
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
              Admin: admin@atasun.com / admin123
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manager: manager@atasun.com / manager123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AtasunLoginPage; 