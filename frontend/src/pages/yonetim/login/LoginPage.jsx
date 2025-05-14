import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !company) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = await login(email, password, company, 'yonetim');
      
      // Başarılı giriş durumunda ilgili firma dashboardına yönlendir
      navigate(`/yonetim/${company.toLowerCase()}/dashboard`);
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
        minHeight: '100vh'
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Yönetim Paneli Girişi
          </Typography>
          
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
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="company-select-label">Firma</InputLabel>
              <Select
                labelId="company-select-label"
                value={company}
                label="Firma"
                onChange={(e) => setCompany(e.target.value)}
              >
                <MenuItem value="Atasun">Atasun</MenuItem>
                <MenuItem value="Gratis">Gratis</MenuItem>
                <MenuItem value="Bim">Bim</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 