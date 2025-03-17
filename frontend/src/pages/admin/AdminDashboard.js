import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  ListItemIcon,
  ListItemButton,
  CircularProgress,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  Chip,
  Avatar,
  Rating
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SupportIcon from '@mui/icons-material/Support';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout, getUserInfo } from '../../utils/auth';
import { adminService, supportService } from '../../services/api';

// Özet sayfası
const Dashboard = () => {
  const [stats, setStats] = useState({
    requests: {
      totalRequests: 0,
      openRequests: 0,
      assignedRequests: 0,
      closedRequests: 0
    },
    feedback: {
      totalFeedback: 0,
      averageRating: 0,
      ratingCounts: {}
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Backend API'ye bağlanmayı dene
        try {
          const requestStats = await adminService.getRequestAnalytics();
          const feedbackStats = await adminService.getFeedbackAnalytics();
          
          setStats({
            requests: requestStats.data,
            feedback: feedbackStats.data
          });
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          // API çağrısı başarısız olursa mock veri kullan
          setStats({
            requests: {
              totalRequests: 156,
              openRequests: 12,
              assignedRequests: 35,
              closedRequests: 109
            },
            feedback: {
              totalFeedback: 87,
              averageRating: 4.2,
              ratingCounts: {
                "NORMAL": 5,
                "FENA_DEGIL": 12,
                "IYI": 25,
                "COK_IYI": 30,
                "HARIKA": 15
              },
              sentimentCounts: {
                "POSITIVE": 65,
                "NEUTRAL": 15,
                "NEGATIVE": 7
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Yönetim Paneli
      </Typography>
      
      <Grid container spacing={3}>
        {/* Destek Talepleri İstatistikleri */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Destek Talepleri
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'primary.light' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4">{stats.requests.totalRequests}</Typography>
                    <Typography variant="body2">Toplam</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'warning.light' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4">{stats.requests.openRequests}</Typography>
                    <Typography variant="body2">Açık</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'info.light' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4">{stats.requests.assignedRequests}</Typography>
                    <Typography variant="body2">Atanmış</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'success.light' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4">{stats.requests.closedRequests}</Typography>
                    <Typography variant="body2">Kapatılmış</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Geri Bildirim İstatistikleri */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Geri Bildirimler
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                Toplam Geri Bildirim: {stats.feedback.totalFeedback}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Ortalama Puan: 
                <Rating 
                  value={stats.feedback.averageRating} 
                  precision={0.5} 
                  readOnly 
                  sx={{ ml: 1, verticalAlign: 'middle' }}
                />
                ({stats.feedback.averageRating.toFixed(1)})
              </Typography>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Puan Dağılımı:
            </Typography>
            
            <Grid container spacing={1}>
              {Object.entries(stats.feedback.ratingCounts || {}).map(([rating, count]) => (
                <Grid item xs={12} key={rating}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ minWidth: 100 }}>
                      {rating.replace('_', ' ')}:
                    </Typography>
                    <Box 
                      sx={{ 
                        flexGrow: 1, 
                        height: 10, 
                        bgcolor: 'primary.light',
                        borderRadius: 5,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: `${(count / stats.feedback.totalFeedback) * 100}%`,
                          bgcolor: 'primary.main',
                          borderRadius: 5
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 1, minWidth: 30 }}>
                      {count}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Kullanıcılar sayfası
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Backend API'ye bağlanmayı dene
        try {
          const response = await adminService.getAllUsers();
          setUsers(response.data);
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          // API çağrısı başarısız olursa mock veri kullan
          setUsers([
            { id: 1, fullName: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
            { id: 2, fullName: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'REPRESENTATIVE', assignedRequests: 8 },
            { id: 3, fullName: 'Ayşe Demir', email: 'ayse@example.com', role: 'REPRESENTATIVE', assignedRequests: 5 },
            { id: 4, fullName: 'Mehmet Kaya', email: 'mehmet@example.com', role: 'CUSTOMER', requestCount: 3 },
            { id: 5, fullName: 'Zeynep Öztürk', email: 'zeynep@example.com', role: 'CUSTOMER', requestCount: 2 },
            { id: 6, fullName: 'Ali Can', email: 'ali@example.com', role: 'CUSTOMER', requestCount: 1 },
            { id: 7, fullName: 'Fatma Şahin', email: 'fatma@example.com', role: 'CUSTOMER', requestCount: 0 }
          ]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Kullanıcıları rollerine göre grupla
  const admins = users.filter(user => user.role === 'ADMIN');
  const representatives = users.filter(user => user.role === 'REPRESENTATIVE');
  const customers = users.filter(user => user.role === 'CUSTOMER');

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Kullanıcı Yönetimi
      </Typography>
      
      <Grid container spacing={3}>
        {/* Yöneticiler */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Yöneticiler ({admins.length})
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ad Soyad</TableCell>
                    <TableCell>E-posta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.id}</TableCell>
                      <TableCell>{admin.fullName}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Müşteri Temsilcileri */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Müşteri Temsilcileri ({representatives.length})
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ad Soyad</TableCell>
                    <TableCell>E-posta</TableCell>
                    <TableCell>Atanan Talepler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {representatives.map((rep) => (
                    <TableRow key={rep.id}>
                      <TableCell>{rep.id}</TableCell>
                      <TableCell>{rep.fullName}</TableCell>
                      <TableCell>{rep.email}</TableCell>
                      <TableCell>{rep.assignedRequests || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Müşteriler */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Müşteriler ({customers.length})
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ad Soyad</TableCell>
                    <TableCell>E-posta</TableCell>
                    <TableCell>Destek Talepleri</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.fullName}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.requestCount || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Destek talepleri sayfası
const SupportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Backend API'ye bağlanmayı dene
        try {
          const response = await supportService.getRequests();
          setRequests(response.data);
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          // API çağrısı başarısız olursa mock veri kullan
          const now = new Date();
          setRequests([
            { 
              id: 1, 
              subject: 'Ürün İadesi Hakkında', 
              status: 'OPEN', 
              createdAt: now.toISOString(),
              customer: { id: 4, fullName: 'Mehmet Kaya', email: 'mehmet@example.com' }
            },
            { 
              id: 2, 
              subject: 'Sipariş Durumu', 
              status: 'ASSIGNED', 
              createdAt: new Date(now.getTime() - 86400000).toISOString(),
              customer: { id: 5, fullName: 'Zeynep Öztürk', email: 'zeynep@example.com' },
              representative: { id: 2, fullName: 'Ahmet Yılmaz', email: 'ahmet@example.com' }
            },
            { 
              id: 3, 
              subject: 'Fatura Bilgisi', 
              status: 'ASSIGNED', 
              createdAt: new Date(now.getTime() - 172800000).toISOString(),
              customer: { id: 6, fullName: 'Ali Can', email: 'ali@example.com' },
              representative: { id: 3, fullName: 'Ayşe Demir', email: 'ayse@example.com' }
            },
            { 
              id: 4, 
              subject: 'Ödeme Sorunu', 
              status: 'CLOSED', 
              createdAt: new Date(now.getTime() - 259200000).toISOString(),
              closedAt: new Date(now.getTime() - 172800000).toISOString(),
              customer: { id: 4, fullName: 'Mehmet Kaya', email: 'mehmet@example.com' },
              representative: { id: 2, fullName: 'Ahmet Yılmaz', email: 'ahmet@example.com' }
            },
            { 
              id: 5, 
              subject: 'Teslimat Gecikmesi', 
              status: 'CLOSED', 
              createdAt: new Date(now.getTime() - 345600000).toISOString(),
              closedAt: new Date(now.getTime() - 259200000).toISOString(),
              customer: { id: 5, fullName: 'Zeynep Öztürk', email: 'zeynep@example.com' },
              representative: { id: 3, fullName: 'Ayşe Demir', email: 'ayse@example.com' }
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestClick = (requestId) => {
    navigate(`/admin/requests/${requestId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Tüm Destek Talepleri
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Konu</TableCell>
                <TableCell>Müşteri</TableCell>
                <TableCell>Temsilci</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Tarih</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow 
                  key={request.id}
                  hover
                  onClick={() => handleRequestClick(request.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.subject}</TableCell>
                  <TableCell>{request.customer?.fullName}</TableCell>
                  <TableCell>
                    {request.representative ? request.representative.fullName : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={
                        request.status === 'OPEN' ? 'Açık' : 
                        request.status === 'ASSIGNED' ? 'Atandı' : 
                        'Kapatıldı'
                      }
                      color={
                        request.status === 'OPEN' ? 'warning' : 
                        request.status === 'ASSIGNED' ? 'primary' : 
                        'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

// Destek talebi detay sayfası
const SupportRequestDetail = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestDetail = async () => {
      try {
        // Backend API'ye bağlanmayı dene
        try {
          const requestResponse = await supportService.getRequestById(id);
          setRequest(requestResponse.data);
          
          const messagesResponse = await supportService.getRequestMessages(id);
          setMessages(messagesResponse.data);
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          // API çağrısı başarısız olursa mock veri kullan
          const now = new Date();
          
          // Mock talep verisi
          setRequest({
            id: parseInt(id),
            subject: 'Ürün İadesi Hakkında',
            description: 'Satın aldığım ürünü iade etmek istiyorum, nasıl bir yol izlemeliyim?',
            status: 'ASSIGNED',
            createdAt: new Date(now.getTime() - 86400000).toISOString(),
            customer: { id: 4, fullName: 'Mehmet Kaya', email: 'mehmet@example.com' },
            representative: { id: 2, fullName: 'Ahmet Yılmaz', email: 'ahmet@example.com' }
          });
          
          // Mock mesaj verisi
          setMessages([
            {
              id: 1,
              content: 'Satın aldığım ürünü iade etmek istiyorum, nasıl bir yol izlemeliyim?',
              createdAt: new Date(now.getTime() - 86400000).toISOString(),
              sender: { id: 4, fullName: 'Mehmet Kaya', role: 'CUSTOMER' }
            },
            {
              id: 2,
              content: 'Merhaba, iade işleminiz için öncelikle ürünün faturası ve kutusuyla birlikte en yakın mağazamıza gelmeniz gerekiyor.',
              createdAt: new Date(now.getTime() - 82800000).toISOString(),
              sender: { id: 2, fullName: 'Ahmet Yılmaz', role: 'REPRESENTATIVE' }
            },
            {
              id: 3,
              content: 'Teşekkürler, peki iade süresi ne kadar?',
              createdAt: new Date(now.getTime() - 79200000).toISOString(),
              sender: { id: 4, fullName: 'Mehmet Kaya', role: 'CUSTOMER' }
            },
            {
              id: 4,
              content: 'İade süresi ürünü teslim aldığınız tarihten itibaren 14 gündür. Faturanızda belirtilen tarihe göre hala iade süreniz devam ediyor.',
              createdAt: new Date(now.getTime() - 75600000).toISOString(),
              sender: { id: 2, fullName: 'Ahmet Yılmaz', role: 'REPRESENTATIVE' }
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetail();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Destek Talebi Detayı
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Talep Bilgileri
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>ID:</strong> {request.id}
              </Typography>
              <Typography variant="body1">
                <strong>Konu:</strong> {request.subject}
              </Typography>
              <Typography variant="body1">
                <strong>Durum:</strong> {
                  request.status === 'OPEN' ? 'Açık' : 
                  request.status === 'ASSIGNED' ? 'Atandı' : 
                  'Kapatıldı'
                }
              </Typography>
              <Typography variant="body1">
                <strong>Oluşturulma Tarihi:</strong> {new Date(request.createdAt).toLocaleString()}
              </Typography>
              {request.closedAt && (
                <Typography variant="body1">
                  <strong>Kapatılma Tarihi:</strong> {new Date(request.closedAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              İlgili Kişiler
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Müşteri:</strong> {request.customer?.fullName} ({request.customer?.email})
              </Typography>
              {request.representative ? (
                <Typography variant="body1">
                  <strong>Temsilci:</strong> {request.representative.fullName} ({request.representative.email})
                </Typography>
              ) : (
                <Typography variant="body1">
                  <strong>Temsilci:</strong> Henüz atanmadı
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Mesajlar
        </Typography>
        
        <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          mr: 1, 
                          bgcolor: 
                            message.type === 'USER' ? 'primary.main' : 
                            message.type === 'REPRESENTATIVE' ? 'secondary.main' : 
                            'success.main'
                        }}
                      >
                        {message.type === 'USER' ? 'M' : 
                         message.type === 'REPRESENTATIVE' ? 'T' : 
                         'C'}
                      </Avatar>
                      <Typography variant="subtitle2">
                        {message.type === 'USER' ? request.customer?.fullName : 
                         message.type === 'REPRESENTATIVE' ? message.sender?.fullName : 
                         'Chatbot'}
                      </Typography>
                      <Chip 
                        label={
                          message.type === 'USER' ? 'Müşteri' : 
                          message.type === 'REPRESENTATIVE' ? 'Temsilci' : 
                          'Chatbot'
                        }
                        size="small"
                        sx={{ ml: 1 }}
                        color={
                          message.type === 'USER' ? 'primary' : 
                          message.type === 'REPRESENTATIVE' ? 'secondary' : 
                          'success'
                        }
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body1"
                        color="text.primary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        {message.content}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(message.timestamp).toLocaleString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

// Profil sayfası
const Profile = () => {
  const userInfo = getUserInfo();

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Profil Bilgileriniz
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          <strong>Ad Soyad:</strong> {userInfo?.fullName}
        </Typography>
        <Typography variant="body1">
          <strong>E-posta:</strong> {userInfo?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Rol:</strong> Yönetici
        </Typography>
      </Box>
    </Paper>
  );
};

// Ana admin paneli
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userInfo = getUserInfo();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Özet', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Kullanıcılar', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Destek Talepleri', icon: <SupportIcon />, path: '/admin/requests' },
    { text: 'Profil', icon: <AccountCircleIcon />, path: '/admin/profile' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Yönetici Paneli
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {userInfo?.fullName}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Çıkış Yap" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/requests" element={<SupportRequests />} />
            <Route path="/requests/:id" element={<SupportRequestDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 