import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const Login = ({ companyName, logo, primary, secondary }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // URL'den şirket adını al
  const companySlug = companyName.toLowerCase();
  
  // Eğer yönlendirme yapılan bir sayfa varsa al
  useEffect(() => {
    // returnUrl parametresini al
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('returnUrl');
    
    // LocalStorage'den önceki konumu kontrol et
    const savedPath = localStorage.getItem(`${companySlug}_return_path`);
    
    // Eğer kullanıcı zaten giriş yapmışsa, yönlendir
    if (authService.isAuthenticated()) {
      if (returnUrl) {
        navigate(returnUrl);
      } else if (savedPath) {
        localStorage.removeItem(`${companySlug}_return_path`);
        navigate(savedPath);
      } else {
        navigate(`/${companySlug}/chatbot`);
      }
    }
  }, [navigate, location.search, companySlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials = {
        email,
        password,
        companyName: companySlug
      };

      const response = await authService.login(credentials);

      if (response.success) {
        // Başarılı giriş
        console.log('Giriş başarılı');
        
        // returnUrl parametresini al
        const params = new URLSearchParams(location.search);
        const returnUrl = params.get('returnUrl');
        
        // LocalStorage'den önceki konumu kontrol et
        const savedPath = localStorage.getItem(`${companySlug}_return_path`);
        
        // Saklanan kullanıcı verilerini kontrol et
        try {
          const userData = JSON.parse(localStorage.getItem('user_data'));
          if (userData) {
            console.log('Kullanıcı verileri:', userData);
          }
        } catch (e) {
          console.error('Kullanıcı verileri okunamadı:', e);
        }
        
        // Yönlendirme yap
        if (returnUrl) {
          navigate(returnUrl);
        } else if (savedPath) {
          localStorage.removeItem(`${companySlug}_return_path`);
          navigate(savedPath);
        } else {
          navigate(`/${companySlug}/chatbot`);
        }
      } else {
        setError(response.message || 'Giriş başarısız');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Giriş sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        padding: 2
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
          borderRadius: 3
        }}
      >
        <Avatar
          src={logo}
          alt={`${companyName} Logo`}
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            border: `3px solid ${primary}`,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        />
        
        <Typography variant="h5" fontWeight="bold" color={primary} gutterBottom>
          {companyName} - Giriş
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
            disabled={loading}
            sx={{ mb: 2 }}
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
            disabled={loading}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            sx={{
              py: 1.2,
              backgroundColor: primary,
              '&:hover': {
                backgroundColor: secondary,
              },
              fontWeight: 'bold',
              borderRadius: 2
            }}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate(`/${companySlug}/chatbot`)}
            sx={{ mt: 2, color: 'text.secondary' }}
          >
            Giriş yapmadan devam et
          </Button>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Demo hesaplar:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              E-posta: admin@support.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Şifre: password123
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 