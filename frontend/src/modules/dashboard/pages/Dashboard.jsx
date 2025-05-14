import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Card, CardContent, CardHeader, Divider, Chip, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../hooks/useAuth';
import RecentTicketsWidget from '../components/RecentTicketsWidget';
import PlatformStatsWidget from '../components/PlatformStatsWidget';
import PlatformCarousel from '../components/PlatformCarousel';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { currentPlatform } = useThemeContext();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // await api.getDashboardStats()
        
        // Simulated data
        setTimeout(() => {
          setStats({
            totalTickets: 127,
            openTickets: 23,
            resolvedToday: 14,
            avgResponseTime: '42m',
            customerSatisfaction: 4.7,
            pendingActions: 8,
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hoşgeldiniz, {user?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>
      
      {/* Platform Carousel - will show the client logos in a carousel */}
      <Box sx={{ mb: 4 }}>
        <PlatformCarousel />
      </Box>
      
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Toplam Destek Talebi
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.totalTickets}
              </Typography>
              <Chip 
                label={`${stats.openTickets} Açık Talep`} 
                size="small" 
                color="primary" 
                sx={{ mt: 1 }} 
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Bugün Çözülen
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.resolvedToday}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Ort. Yanıt Süresi: {stats.avgResponseTime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Müşteri Memnuniyeti
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.customerSatisfaction}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <span key={rating} style={{ color: rating <= Math.round(stats.customerSatisfaction) ? '#FFD700' : '#e0e0e0', fontSize: '16px' }}>
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
      
      {/* Platform Stats and Recent Tickets */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <PlatformStatsWidget />
        </Grid>
        
        <Grid item xs={12} md={7}>
          <RecentTicketsWidget />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 