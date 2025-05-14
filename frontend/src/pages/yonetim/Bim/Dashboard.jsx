import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Divider, 
  Chip, 
  CircularProgress,
  useTheme,
  Avatar,
  Stack,
  LinearProgress,
  Button
} from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';

// BİM'e özel renk teması
const bimTheme = {
  primary: '#ED1C24', // BİM kırmızı rengi
  secondary: '#003368', // BİM lacivert rengi
  background: '#F5F5F5'
};

const BimDashboard = () => {
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
            totalTickets: 156,
            openTickets: 28,
            resolvedToday: 15,
            avgResponseTime: '29m',
            customerSatisfaction: 4.3,
            pendingActions: 10,
            ticketCategories: [
              { name: 'Ürün', count: 58, percent: 37 },
              { name: 'Teslimat', count: 38, percent: 24 },
              { name: 'Fiyatlandırma', count: 31, percent: 20 },
              { name: 'Stok Bilgisi', count: 17, percent: 11 },
              { name: 'Diğer', count: 12, percent: 8 }
            ],
            agentPerformance: [
              { name: 'Murat Demir', resolvedTickets: 27, avgTime: '25m', avatar: 'M' },
              { name: 'Ayşe Kılıç', resolvedTickets: 23, avgTime: '33m', avatar: 'A' },
              { name: 'Hasan Yıldız', resolvedTickets: 21, avgTime: '29m', avatar: 'H' }
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
        <CircularProgress style={{ color: bimTheme.primary }} />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, bgcolor: bimTheme.background, minHeight: '100vh' }}>
      {/* Header Bölümü */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: bimTheme.primary, fontWeight: 'bold' }}>
            BİM Yönetim Paneli
          </Typography>
          
          <Typography variant="subtitle1" sx={{ color: bimTheme.secondary }}>
            Hoşgeldiniz, {user?.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'right' }}>
          <Chip 
            icon={<BarChartIcon />}
            label="Destek İstatistikleri" 
            sx={{ 
              bgcolor: bimTheme.secondary, 
              color: 'white', 
              fontWeight: 'bold',
              padding: '4px'
            }} 
          />
        </Box>
      </Box>
      
      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={2} sx={{ 
            bgcolor: '#fff', 
            borderRadius: '8px',
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' },
            border: `1px solid ${bimTheme.primary}`, 
            borderTopWidth: '4px'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Toplam Destek Talebi
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: bimTheme.primary }}>
                    {stats.totalTickets}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: bimTheme.primary, width: 48, height: 48 }}>
                  <SupportAgentIcon />
                </Avatar>
              </Box>
              <Chip 
                label={`${stats.openTickets} Açık Talep`} 
                size="small" 
                sx={{ mt: 1, bgcolor: bimTheme.secondary, color: '#fff' }} 
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card elevation={2} sx={{ 
            bgcolor: '#fff', 
            borderRadius: '8px',
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' },
            border: '1px solid #FF9800',
            borderTopWidth: '4px'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Bugün Çözülen
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                    {stats.resolvedToday}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FF9800', width: 48, height: 48 }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Ort. Yanıt Süresi: {stats.avgResponseTime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card elevation={2} sx={{ 
            bgcolor: '#fff', 
            borderRadius: '8px',
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' },
            border: '1px solid #4CAF50',
            borderTopWidth: '4px'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Müşteri Memnuniyeti
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                    {stats.customerSatisfaction}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 48, height: 48 }}>
                  ★
                </Avatar>
              </Box>
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
        
        <Grid item xs={12} md={3}>
          <Card elevation={2} sx={{ 
            bgcolor: '#fff', 
            borderRadius: '8px',
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' },
            border: `1px solid ${bimTheme.secondary}`,
            borderTopWidth: '4px'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Benim Taleplerim
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: bimTheme.secondary }}>
                    {stats.pendingActions}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: bimTheme.secondary, width: 48, height: 48 }}>
                  <SupervisorAccountIcon />
                </Avatar>
              </Box>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => window.location.href = '/yonetim/bim/my-tickets'}
                sx={{ 
                  mt: 1, 
                  color: bimTheme.secondary, 
                  borderColor: bimTheme.secondary,
                  '&:hover': { borderColor: bimTheme.secondary, bgcolor: 'rgba(0, 51, 104, 0.08)' } 
                }}
              >
                Taleplere Git
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Talep Kategorileri ve Temsilci Performansı */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '8px', bgcolor: '#fff' }}>
            <Typography variant="h6" gutterBottom sx={{ color: bimTheme.primary, fontWeight: 'bold' }}>
              Talep Kategorileri
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.ticketCategories.map((category, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{category.name}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {category.count} ({category.percent}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={category.percent} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 5,
                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: bimTheme.primary
                    }
                  }} 
                />
              </Box>
            ))}
          </Paper>
        </Grid>
        
        {/* Temsilci Performansı */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '8px', bgcolor: '#fff' }}>
            <Typography variant="h6" gutterBottom sx={{ color: bimTheme.primary, fontWeight: 'bold' }}>
              Temsilci Performansı
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.agentPerformance.map((agent, index) => (
              <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                    color: index === 0 ? '#000' : '#fff',
                    mr: 2
                  }}
                >
                  {agent.avatar}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="medium">{agent.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {agent.resolvedTickets} talep · {agent.avgTime}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(agent.resolvedTickets / stats.agentPerformance[0].resolvedTickets) * 100} 
                    sx={{ 
                      mt: 1,
                      height: 6, 
                      borderRadius: 5,
                      bgcolor: 'rgba(0, 0, 0, 0.08)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                      }
                    }} 
                  />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Hızlı Erişim */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: '8px', bgcolor: '#fff' }}>
        <Typography variant="h6" gutterBottom sx={{ color: bimTheme.primary, fontWeight: 'bold' }}>
          Hızlı Erişim
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                borderRadius: '8px',
                '&:hover': { 
                  bgcolor: bimTheme.background,
                  transform: 'translateY(-5px)'
                },
                transition: 'transform 0.2s',
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                height: '100%',
                border: `1px solid ${bimTheme.primary}`
              }}
              onClick={() => window.location.href = '/yonetim/bim/tickets-pool'}
            >
              <Typography variant="subtitle1" color={bimTheme.primary} fontWeight="bold">İstek Havuzu</Typography>
              <Typography variant="h4" sx={{ color: bimTheme.primary, my: 1 }}>{stats.openTickets}</Typography>
              <Typography variant="body2" color="text.secondary">Açık talepler</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                borderRadius: '8px',
                '&:hover': { 
                  bgcolor: bimTheme.background,
                  transform: 'translateY(-5px)'
                },
                transition: 'transform 0.2s',
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                height: '100%',
                border: `1px solid ${bimTheme.secondary}`
              }}
              onClick={() => window.location.href = '/yonetim/bim/my-tickets'}
            >
              <Typography variant="subtitle1" color={bimTheme.secondary} fontWeight="bold">Benim Taleplerim</Typography>
              <Typography variant="h4" sx={{ color: bimTheme.secondary, my: 1 }}>{stats.pendingActions}</Typography>
              <Typography variant="body2" color="text.secondary">İşlem bekleyen</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                borderRadius: '8px',
                '&:hover': { 
                  bgcolor: bimTheme.background,
                  transform: 'translateY(-5px)'
                },
                transition: 'transform 0.2s',
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                height: '100%',
                border: '1px solid #4CAF50'
              }}
              onClick={() => window.location.href = '/yonetim/bim/users'}
            >
              <Typography variant="subtitle1" color="#4CAF50" fontWeight="bold">Kullanıcı Yönetimi</Typography>
              <Typography variant="h4" sx={{ color: '#4CAF50', my: 1 }}>
                <SupervisorAccountIcon fontSize="large" />
              </Typography>
              <Typography variant="body2" color="text.secondary">Kullanıcıları yönet</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                borderRadius: '8px',
                '&:hover': { 
                  bgcolor: bimTheme.background,
                  transform: 'translateY(-5px)'
                },
                transition: 'transform 0.2s',
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                height: '100%',
                border: '1px solid #9C27B0'
              }}
              onClick={() => window.location.href = '/yonetim/bim/analytics'}
            >
              <Typography variant="subtitle1" color="#9C27B0" fontWeight="bold">Analitik</Typography>
              <Typography variant="h4" sx={{ color: '#9C27B0', my: 1 }}>
                <TrendingUpIcon fontSize="large" />
              </Typography>
              <Typography variant="body2" color="text.secondary">Raporlar ve istatistikler</Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BimDashboard; 