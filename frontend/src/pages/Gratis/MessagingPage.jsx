import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Button, 
  CircularProgress, 
  Avatar,
  IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomerMessaging from '../../components/CustomerMessaging';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// Gratis teması
const theme = {
  primary: '#E6007E', // Gratis pembe
  primaryDark: '#C5006B', // Gratis koyu pembe
  secondary: '#10069F', // Gratis lacivert
  background: '#F9F0F5', // Açık pembe tonlu arkaplan
  text: '#333',
  logo: '/assets/logos/gratis.png'
};

const GratisMessagingPage = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState('102'); // Demo için sabit ID
  const [managerId, setManagerId] = useState('202'); // Demo için sabit ID
  
  useEffect(() => {
    // Check if user is logged in
    const customerLoggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
    const customerCompany = localStorage.getItem('customerCompany');
    
    setIsLoggedIn(customerLoggedIn && customerCompany === 'gratis');
    
    if (!customerLoggedIn || customerCompany !== 'gratis') {
      navigate('/gratis/login');
      return;
    }
    
    // Demo için veri yükleme simülasyonu
    setTimeout(() => {
      setTicket({
        id: ticketId || 'GRT-1234',
        subject: 'Siparişimdeki ürünler eksik geldi',
        status: 'OPEN',
        createdAt: '2023-06-10T11:30:00',
        lastUpdated: '2023-06-12T14:15:00',
        priority: 'HIGH',
        assignedManager: {
          id: '202',
          name: 'Ayşe Yıldız',
          department: 'Müşteri Hizmetleri'
        }
      });
      setLoading(false);
    }, 1000);
  }, [ticketId, navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('isCustomerLoggedIn');
    localStorage.removeItem('customerCompany');
    navigate('/gratis');
  };
  
  const handleBackToDashboard = () => {
    navigate('/gratis/dashboard');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor={theme.background}>
        <CircularProgress style={{ color: theme.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: theme.background, color: theme.text, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        py: 2, 
        px: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.12)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={theme.logo} alt="Gratis" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h6" fontWeight="bold" color={theme.primary}>
            Müşteri Portalı
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<ExitToAppIcon />} 
            onClick={handleLogout} 
            size="small"
            sx={{ 
              ml: 2,
              color: theme.primary,
              borderColor: theme.primary,
              '&:hover': {
                borderColor: theme.primaryDark,
                bgcolor: 'rgba(230, 0, 126, 0.05)'
              }
            }}
          >
            Çıkış Yap
          </Button>
        </Box>
      </Box>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="text" 
          onClick={handleBackToDashboard}
          sx={{ mb: 2, color: theme.primary }}
        >
          Panele Geri Dön
        </Button>
        
        <Grid container spacing={3}>
          {/* Ticket Detayları */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" color={theme.primary} gutterBottom>
                Talep Detayları
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Talep Numarası
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {ticket.id}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Konu
                </Typography>
                <Typography variant="body1">
                  {ticket.subject}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Durum
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: ticket.status === 'OPEN' ? 'orange' : 
                           ticket.status === 'CLOSED' ? 'green' : 
                           theme.primary 
                  }}
                >
                  {ticket.status === 'OPEN' ? 'Açık' : 
                   ticket.status === 'CLOSED' ? 'Kapalı' : 
                   ticket.status === 'IN_PROGRESS' ? 'İşlemde' : 
                   'Beklemede'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Oluşturulma Tarihi
                </Typography>
                <Typography variant="body1">
                  {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Son Güncelleme
                </Typography>
                <Typography variant="body1">
                  {new Date(ticket.lastUpdated).toLocaleDateString('tr-TR')}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Öncelik
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: ticket.priority === 'HIGH' ? 'error.main' : 
                           ticket.priority === 'MEDIUM' ? 'warning.main' : 
                           'success.main' 
                  }}
                >
                  {ticket.priority === 'HIGH' ? 'Yüksek' : 
                   ticket.priority === 'MEDIUM' ? 'Orta' : 'Düşük'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom color={theme.primary}>
                Yetkili Müşteri Temsilcisi
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.primary,
                    width: 36,
                    height: 36,
                    mr: 2
                  }}
                >
                  {ticket.assignedManager.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {ticket.assignedManager.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.assignedManager.department}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Mesajlaşma Alanı */}
          <Grid item xs={12} md={8}>
            <CustomerMessaging 
              ticketId={ticket.id}
              customerId={customerId}
              managerId={managerId}
              companyType="gratis"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default GratisMessagingPage; 