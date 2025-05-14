import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  Chip, 
  CircularProgress,
  useTheme
} from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';

// Atasun'a özel renk teması burada kullanılacak
const atasunTheme = {
  primary: '#00539B', // Atasun mavi rengi
  secondary: '#FF671F', // Turuncu vurgu rengi
  background: '#F5F7FA'
};

const AtasunDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Gerçek uygulamada API'den veri çekilecek
        // await api.getDashboardStats()
        
        // Simüle edilmiş veri
        setTimeout(() => {
          setStats({
            totalTickets: 89,
            openTickets: 17,
            resolvedToday: 8,
            avgResponseTime: '37m',
            customerSatisfaction: 4.5,
            pendingActions: 6,
            agentPerformance: [
              { name: 'Ahmet Yılmaz', resolvedTickets: 23, avgTime: '28m' },
              { name: 'Zeynep Kaya', resolvedTickets: 31, avgTime: '22m' },
              { name: 'Murat Demir', resolvedTickets: 18, avgTime: '35m' }
            ]
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Dashboard verisi çekilirken hata oluştu:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress style={{ color: atasunTheme.primary }} />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, bgcolor: atasunTheme.background, minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: atasunTheme.primary, fontWeight: 'bold' }}>
          Atasun Yönetim Paneli
        </Typography>
        
        <Typography variant="subtitle1" sx={{ color: atasunTheme.primary }}>
          Hoşgeldiniz, {user?.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>
      
      {/* İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ bgcolor: '#fff', borderTop: `4px solid ${atasunTheme.primary}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Toplam Destek Talebi
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: atasunTheme.primary }}>
                {stats.totalTickets}
              </Typography>
              <Chip 
                label={`${stats.openTickets} Açık Talep`} 
                size="small" 
                sx={{ mt: 1, bgcolor: atasunTheme.secondary, color: '#fff' }} 
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ bgcolor: '#fff', borderTop: `4px solid ${atasunTheme.primary}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Bugün Çözülen
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: atasunTheme.primary }}>
                {stats.resolvedToday}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Ort. Yanıt Süresi: {stats.avgResponseTime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ bgcolor: '#fff', borderTop: `4px solid ${atasunTheme.primary}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Müşteri Memnuniyeti
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: atasunTheme.primary }}>
                {stats.customerSatisfaction}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <span key={rating} style={{ 
                    color: rating <= Math.round(stats.customerSatisfaction) ? '#FFD700' : '#e0e0e0', 
                    fontSize: '16px' 
                  }}>
                    ★
                  </span>
                ))}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  (Son 30 gün)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Temsilci Performansı */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: '#fff' }}>
        <Typography variant="h6" gutterBottom sx={{ color: atasunTheme.primary }}>
          Temsilci Performansı
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          {stats.agentPerformance.map((agent, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1">{agent.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Çözülen Talepler: {agent.resolvedTickets}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ort. Çözüm Süresi: {agent.avgTime}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Hızlı Erişim */}
      <Paper elevation={1} sx={{ p: 3, bgcolor: '#fff' }}>
        <Typography variant="h6" gutterBottom sx={{ color: atasunTheme.primary }}>
          Hızlı Erişim
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                '&:hover': { bgcolor: atasunTheme.background },
                borderLeft: `4px solid ${atasunTheme.primary}`
              }}
              onClick={() => window.location.href = '/yonetim/atasun/tickets-pool'}
            >
              <Typography variant="subtitle1">İstek Havuzu</Typography>
              <Typography variant="h4" sx={{ color: atasunTheme.primary }}>{stats.openTickets}</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                '&:hover': { bgcolor: atasunTheme.background },
                borderLeft: `4px solid ${atasunTheme.secondary}`
              }}
              onClick={() => window.location.href = '/yonetim/atasun/my-tickets'}
            >
              <Typography variant="subtitle1">Benim Taleplerim</Typography>
              <Typography variant="h4" sx={{ color: atasunTheme.secondary }}>{stats.pendingActions}</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                '&:hover': { bgcolor: atasunTheme.background },
                borderLeft: `4px solid #4CAF50`
              }}
              onClick={() => window.location.href = '/yonetim/atasun/users'}
            >
              <Typography variant="subtitle1">Kullanıcı Yönetimi</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                '&:hover': { bgcolor: atasunTheme.background },
                borderLeft: `4px solid #9C27B0`
              }}
              onClick={() => window.location.href = '/yonetim/atasun/analytics'}
            >
              <Typography variant="subtitle1">Analitik</Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AtasunDashboard; 