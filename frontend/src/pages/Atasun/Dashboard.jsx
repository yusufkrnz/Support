import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Divider, 
  Badge, 
  IconButton, 
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme as useMuiTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link
} from '@mui/material';
import theme from '../../themes/Atasun/theme';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import SupportIcon from '@mui/icons-material/Support';
import HistoryIcon from '@mui/icons-material/History';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { authService, userService } from '../../services/api';

const AtasunDashboard = () => {
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchUserDashboard = useCallback(async (userId) => {
    try {
      setLoading(true);
      
      // Use our userService to fetch dashboard data
      const dashboardData = await userService.getUserDashboard(userId);
      
      if (dashboardData) {
        // Set user profile data
        setUserData({
          id: dashboardData.userProfile.id,
          name: dashboardData.userProfile.name,
          email: dashboardData.userProfile.email,
          phone: dashboardData.userProfile.phone,
          lastLogin: new Date().toISOString() // Use current date if not provided
        });
        
        // Set tickets data
        setTickets(dashboardData.supportTickets || []);
        
        // Set orders data
        setOrders(dashboardData.orders || []);
        
        // Set unread messages count
        setUnreadMessages(dashboardData.unreadMessageCount || 0);
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
      setError('Could not load your dashboard data. Please try again later.');
      
      // Use mock data for fallback
      setUserData({
        name: 'Ahmet Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        phone: '+90 (555) 123 4567',
        lastLogin: '2023-06-15T10:30:00'
      });
      
      setTickets([
        {
          id: 'ATS-1234',
          subject: 'Sipariş ettiğim gözlük hala gelmedi',
          status: 'OPEN',
          createdAt: '2023-06-12T14:30:00',
          lastUpdated: '2023-06-14T09:15:00'
        },
        {
          id: 'ATS-1187',
          subject: 'Garanti kapsamında lens değişimi',
          status: 'CLOSED',
          createdAt: '2023-05-22T11:20:00',
          lastUpdated: '2023-05-25T16:45:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const customerLoggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
    const customerCompany = localStorage.getItem('customerCompany');
    const authToken = localStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data');
    
    setIsLoggedIn(customerLoggedIn && customerCompany === 'atasun');
    
    if (customerLoggedIn && customerCompany === 'atasun' && authToken && userDataStr) {
      try {
        const userDataObj = JSON.parse(userDataStr);
        
        // Fetch user dashboard data from backend using our userService
        fetchUserDashboard(userDataObj.id);
      } catch (error) {
        console.error('Error parsing user data', error);
        setError('User data could not be loaded properly');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchUserDashboard]);

  const handleLogout = () => {
    try {
      const companyName = localStorage.getItem('customerCompany');
      authService.logout(companyName);
      
      // Trigger storage event for other windows (e.g. chatbot)
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('isCustomerLoggedIn');
    localStorage.removeItem('customerCompany');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    setIsLoggedIn(false);
    navigate('/atasun');
  };

  const closeError = () => {
    setError(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case 'OPEN':
        return { 
          label: 'Açık', 
          color: 'warning',
          variant: 'outlined'
        };
      case 'CLOSED':
        return { 
          label: 'Kapalı', 
          color: 'success',
          variant: 'outlined'
        };
      case 'IN_PROGRESS':
        return { 
          label: 'İşlemde', 
          color: 'info',
          variant: 'outlined'
        };
      default:
        return { 
          label: 'Beklemede', 
          color: 'default',
          variant: 'outlined'
        };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor={theme.background}>
        <CircularProgress style={{ color: theme.primary }} />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return (
      <Box sx={{ 
        background: theme.background, 
        color: theme.text, 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Navigation Header */}
        <Box sx={{ 
          py: 2, 
          px: 3, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: '#fff'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/assets/logos/atasun.svg" alt="Atasun Optik" style={{ height: 40 }} />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              color="primary" 
              onClick={() => navigate('/atasun/chatbot')}
              sx={{ 
                fontWeight: 'medium',
                '&:hover': { color: theme.primaryDark }
              }}
            >
              Hızlı Destek
            </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate('/atasun/login')}
            sx={{ 
              borderColor: theme.primary,
                color: theme.primary,
                fontWeight: 'medium',
              '&:hover': {
                borderColor: theme.primaryDark,
                  backgroundColor: 'rgba(0,115,152,0.04)'
              }
            }}
          >
            Giriş Yap
          </Button>
          </Box>
        </Box>

        {/* Hero Section */}
        <Box sx={{ 
          py: { xs: 6, md: 10 }, 
          px: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          gap: { xs: 4, md: 6 }
        }}>
          <Box sx={{ 
            maxWidth: { xs: '100%', md: '50%' }, 
            order: { xs: 2, md: 1 },
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color={theme.primary}
              gutterBottom
              sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              Görüşünüzü Netleştiriyoruz
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              gutterBottom
              sx={{ mb: 3, fontWeight: 'normal' }}
            >
              Atasun Optik müşteri portalı ile tüm gözlük ve lens ihtiyaçlarınızı 
              karşılayabilir, siparişlerinizi takip edebilir ve destek alabilirsiniz.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
          <Button 
            variant="contained" 
                size="large"
                onClick={() => navigate('/atasun/login')}
            sx={{
              bgcolor: theme.primary,
                  fontWeight: 'medium',
                  px: 4,
                  py: 1.5,
              '&:hover': {
                bgcolor: theme.primaryDark
              }
            }}
          >
                Müşteri Portalına Giriş
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/atasun/chatbot')}
                sx={{ 
                  borderColor: theme.primary,
                  color: theme.primary,
                  fontWeight: 'medium',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: theme.primaryDark,
                    backgroundColor: 'rgba(0,115,152,0.04)'
                  }
                }}
              >
                Canlı Destek
          </Button>
        </Box>
          </Box>
          <Box sx={{ 
            order: { xs: 1, md: 2 },
            width: { xs: '80%', sm: '60%', md: '40%' },
            maxWidth: '450px'
          }}>
            <img 
              src="/assets/illustrations/glasses.svg" 
              alt="Gözlük Illustration" 
              style={{ width: '100%', height: 'auto' }} 
            />
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ 
          py: 8, 
          px: 3,
          backgroundColor: theme.background
        }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              gutterBottom
              textAlign="center"
              color={theme.primary}
              sx={{ mb: 6 }}
            >
              Atasun Müşteri Portalı Avantajları
            </Typography>
            
            <Grid container spacing={4}>
              {/* Feature 1 */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,115,152,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}>
                    <HistoryIcon sx={{ fontSize: 40, color: theme.primary }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Sipariş Takibi
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Tüm sipariş detaylarınızı görüntüleyin ve siparişlerinizin durumunu anında takip edin.
                  </Typography>
                </Paper>
              </Grid>
              
              {/* Feature 2 */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,115,152,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}>
                    <SupportIcon sx={{ fontSize: 40, color: theme.primary }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    7/24 Destek
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Alanında uzman müşteri hizmetleri ekibimizle tüm sorularınıza anında yanıt alın.
                  </Typography>
                </Paper>
              </Grid>
              
              {/* Feature 3 */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,115,152,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}>
                    <MessageIcon sx={{ fontSize: 40, color: theme.primary }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Hızlı İletişim
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Mesajlaşma sistemimiz sayesinde siparişleriniz ve talepleriniz hakkında anında bilgi alın.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Product Showcase */}
        <Box sx={{ 
          py: 8, 
          px: 3,
          backgroundColor: 'white'
        }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 4, md: 6 }
            }}>
              <Box sx={{ flex: 1 }}>
                <img 
                  src="/assets/illustrations/eyewear.svg" 
                  alt="Gözlük Çeşitleri" 
                  style={{ width: '100%', maxWidth: '500px', height: 'auto', margin: '0 auto', display: 'block' }} 
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  color={theme.primary}
                  gutterBottom
                >
                  Zengin Ürün Çeşitliliği
            </Typography>
            <Typography variant="body1" paragraph>
                  Atasun Optik'te, dünyaca ünlü markaların en yeni model gözlük ve lens seçenekleri sizleri bekliyor. 
                  Güneş gözlüğünden numaralı gözlüğe, lens çeşitlerinden aksesuvarlara kadar tüm ihtiyaçlarınızı 
                  karşılayabilirsiniz.
            </Typography>
                <List>
                  <ListItem sx={{ p: 0, mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircleIcon sx={{ color: theme.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="Dünyaca ünlü markaların en yeni modelleri" />
                  </ListItem>
                  <ListItem sx={{ p: 0, mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircleIcon sx={{ color: theme.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="Her bütçeye uygun geniş fiyat aralığı" />
                  </ListItem>
                  <ListItem sx={{ p: 0, mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircleIcon sx={{ color: theme.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="Tüm lens çeşitleri ve yardımcı aksesuvarlar" />
                  </ListItem>
                </List>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="large"
                  sx={{ 
                    mt: 2,
                    borderColor: theme.primary,
                    color: theme.primary,
                    fontWeight: 'medium',
                    '&:hover': {
                      borderColor: theme.primaryDark,
                      backgroundColor: 'rgba(0,115,152,0.04)'
                    }
                  }}
                >
                  Ürünleri Keşfedin
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Customer Service Section */}
        <Box sx={{ 
          py: 8, 
          px: 3,
          backgroundColor: theme.background
        }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 4, md: 6 }
            }}>
              <Box sx={{ 
                flex: 1,
                order: { xs: 2, md: 1 }
              }}>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  color={theme.primary}
                  gutterBottom
                >
                  Uzman Müşteri Hizmetleri
                </Typography>
                <Typography variant="body1" paragraph>
                  Müşteri memnuniyeti odaklı ekibimiz, satış öncesi ve sonrası tüm sorularınıza yanıt vermek için 
                  7/24 hizmetinizdedir. Online müşteri portalımızdan kolayca destek talepleri oluşturabilir, 
                  siparişlerinizi takip edebilirsiniz.
                </Typography>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.08)',
                  mb: 2
                }}>
                  <Typography fontWeight="medium" gutterBottom>
                    "Atasun Optik'in müşteri hizmetleri ekibi sorunumu çok hızlı bir şekilde çözdü. 
                    Teşekkür ederim!"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    — Ayşe Y., İstanbul
                  </Typography>
                </Paper>
            <Button 
              variant="contained" 
                  color="primary" 
              size="large" 
                  onClick={() => navigate('/atasun/chatbot')}
                  startIcon={<SupportIcon />}
              sx={{
                bgcolor: theme.primary,
                    fontWeight: 'medium',
                '&:hover': {
                  bgcolor: theme.primaryDark
                }
              }}
            >
                  Hızlı Destek Alın
            </Button>
          </Box>
              <Box sx={{ 
                flex: 1,
                order: { xs: 1, md: 2 },
                display: 'flex',
                justifyContent: 'center'
              }}>
                <img 
                  src="/assets/illustrations/customer-service.svg" 
                  alt="Müşteri Hizmetleri" 
                  style={{ width: '100%', maxWidth: '400px', height: 'auto' }} 
                />
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Call to Action */}
        <Box sx={{ 
          py: 8, 
          px: 3,
          backgroundColor: theme.primary,
          backgroundImage: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`
        }}>
          <Container maxWidth="md">
            <Box textAlign="center">
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color="white"
                gutterBottom
              >
                Atasun Müşteri Portalına Katılın
              </Typography>
              <Typography 
                variant="body1" 
                color="rgba(255,255,255,0.9)"
                sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
              >
                Siparişlerinizi takip edin, destek taleplerinizi oluşturun ve müşteri temsilcilerimizle 
                hızlıca iletişime geçin.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/atasun/login')}
                sx={{ 
                  bgcolor: 'white',
                  color: theme.primary,
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Hemen Giriş Yapın
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          py: 5, 
          px: 3,
          backgroundColor: '#fff',
          borderTop: '1px solid rgba(0,0,0,0.08)'
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: { xs: 3, md: 0 } }}>
                  <img src="/assets/logos/atasun.svg" alt="Atasun Optik" style={{ height: 40, marginBottom: 16 }} />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Atasun Optik, Türkiye'nin lider optik perakendecisidir. Yüksek kaliteli gözlük, lens ve güneş gözlüğü ürünleri sunar.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Hakkımızda
                </Typography>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Şirket Profili
                </Link>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Mağazalarımız
                </Link>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Kariyer
                </Link>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Ürünler
                </Typography>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Gözlükler
                </Link>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Güneş Gözlükleri
                </Link>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Lensler
                </Link>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Destek
                </Typography>
                <Link href="/atasun/chatbot" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Canlı Destek
                </Link>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Sıkça Sorulan Sorular
                </Link>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  İletişim
                </Link>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Yasal
                </Typography>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Gizlilik Politikası
                </Link>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  Kullanım Koşulları
                </Link>
                <Link href="#" underline="hover" color="inherit" display="block" sx={{ mb: 1 }}>
                  KVKK
                </Link>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              © {new Date().getFullYear()} Atasun Optik. Tüm hakları saklıdır.
            </Typography>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: theme.background, 
      color: theme.text, 
      minHeight: '100vh',
      pb: 4
    }}>
      {/* Header */}
      <Box sx={{ 
        py: 2, 
        px: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={theme.logo} alt="Atasun" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h6" fontWeight="bold" color={theme.primary} sx={{ display: { xs: 'none', sm: 'block' } }}>
            Müşteri Portalı
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            aria-label="messages" 
            onClick={() => navigate('/atasun/messaging')}
            sx={{ color: theme.primary }}
          >
            <Badge badgeContent={unreadMessages} color="error">
              <MessageIcon />
            </Badge>
          </IconButton>
          
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
                bgcolor: 'rgba(0, 115, 152, 0.05)'
              },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            Çıkış Yap
          </Button>
          
          <IconButton 
            aria-label="logout"
            onClick={handleLogout}
            sx={{ 
              ml: 1,
              color: theme.primary,
              display: { xs: 'flex', sm: 'none' }
            }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Welcome Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            backgroundColor: theme.primary,
            color: '#fff',
            backgroundImage: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
            boxShadow: '0 4px 20px rgba(0, 115, 152, 0.25)'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
          Hoş Geldiniz, {userData?.name || 'Değerli Müşterimiz'}
        </Typography>
              <Typography variant="body1">
                Atasun Optik müşteri portalında destek taleplerinizi görüntüleyebilir, 
                mesajlarınızı kontrol edebilir ve siparişlerinizi takip edebilirsiniz.
        </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button 
                  variant="contained" 
                  startIcon={<SupportIcon />}
                  onClick={() => navigate('/atasun/chatbot')}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    color: theme.primary,
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,1)'
                    },
                    mr: { xs: 2, md: 0 }
                  }}
                >
                  Destek Al
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Grid container spacing={3}>
          {/* User Info Card */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                border: '1px solid rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.primary,
                    width: 56,
                    height: 56,
                    mr: 2 
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {userData?.name || 'İsim Mevcut Değil'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Müşteri ID: {userData?.id || 'N/A'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  E-posta
                </Typography>
                <Typography variant="body1">
                  {userData?.email || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Telefon
                </Typography>
                <Typography variant="body1">
                  {userData?.phone || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Son Giriş
                </Typography>
                <Typography variant="body1">
                  {userData?.lastLogin ? formatDate(userData.lastLogin) : 'N/A'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Tickets Section */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium" color={theme.primary}>
                  <SupportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Destek Talepleriniz
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => {/* Create new ticket logic */}}
                  sx={{ 
                    color: theme.primary,
                    borderColor: theme.primary,
                    '&:hover': {
                      borderColor: theme.primaryDark,
                      bgcolor: 'rgba(0, 115, 152, 0.05)'
                    }
                  }}
                >
                  Yeni Talep
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {tickets.length > 0 ? (
                <Box>
                  {tickets.map((ticket, index) => (
                    <Card 
                      key={ticket.id} 
                      variant="outlined" 
                      sx={{ 
                        mb: 2, 
                        borderColor: 'rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: theme.primary,
                          backgroundColor: 'rgba(0, 115, 152, 0.03)'
                        }
                      }}
                      onClick={() => navigate(`/atasun/messaging/${ticket.id}`)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={12} sm={7}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {ticket.subject}
                        </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {ticket.id} • Oluşturuldu: {formatDate(ticket.createdAt)}
                        </Typography>
                          </Grid>
                          <Grid item xs={12} sm={5} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Chip 
                              {...getStatusChipProps(ticket.status)} 
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          <Typography 
                              variant="caption" 
                              color="text.secondary"
                              component="span"
                              sx={{ display: 'inline-flex', alignItems: 'center' }}
                          >
                              <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                              Son güncelleme: {formatDate(ticket.lastUpdated)}
                          </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <FolderIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Henüz bir destek talebiniz bulunmuyor.
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      mt: 2,
                      bgcolor: theme.primary,
                      '&:hover': {
                        bgcolor: theme.primaryDark
                      }
                    }}
                    onClick={() => {/* Create new ticket logic */}}
                  >
                    Talep Oluştur
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Orders Section */}
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
                  sx={{ 
                p: 3, 
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                    '&:hover': {
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HistoryIcon sx={{ color: theme.primary, mr: 1 }} />
                <Typography variant="h6" fontWeight="medium" color={theme.primary}>
                  Sipariş Geçmişi
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {orders.length > 0 ? (
                <Grid container spacing={2}>
                  {orders.map((order) => (
                    <Grid item xs={12} md={6} lg={4} key={order.id}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                          borderColor: 'rgba(0,0,0,0.1)',
                          transition: 'all 0.2s ease',
                        '&:hover': {
                            borderColor: theme.primary,
                            backgroundColor: 'rgba(0, 115, 152, 0.03)'
                        }
                      }}
                    >
                      <CardContent>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Sipariş #{order.id}
                            </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Tarih: {formatDate(order.date)}
                            </Typography>
                          <Typography variant="body2">
                            {order.description}
                            </Typography>
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {order.price} TL
                            </Typography>
                            <Chip 
                              label={order.status} 
                              size="small" 
                              color={order.status === 'Tamamlandı' ? 'success' : 
                                     order.status === 'İşlemde' ? 'info' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                      </CardContent>
                    </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Henüz bir sipariş geçmişiniz bulunmuyor.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={closeError}>
        <Alert onClose={closeError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AtasunDashboard; 