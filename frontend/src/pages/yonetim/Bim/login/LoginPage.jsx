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

// BİM'e özel renk teması
const bimTheme = {
  primary: '#ED1C24', // BİM kırmızı rengi
  secondary: '#022169', // BİM koyu mavi rengi
  background: '#F8F8F8'
};

const BimLoginPage = () => {
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
      // BİM firma adı otomatik olarak gönderiliyor
      const user = await login(email, password, 'Bim', 'yonetim');
      
      // Başarılı giriş durumunda dashboard'a yönlendir
      navigate('/yonetim/bim/dashboard');
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
        bgcolor: bimTheme.background
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderTop: `4px solid ${bimTheme.primary}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: bimTheme.primary, fontWeight: 'bold' }}>
              BİM Yönetim Paneli
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
                bgcolor: bimTheme.primary,
                '&:hover': { bgcolor: '#c10a10' },
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
              Admin: admin@bim.com / admin123
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manager: manager@bim.com / manager123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BimLoginPage; 