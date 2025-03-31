import React, { useState, useEffect, useRef } from 'react';
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
  Chip,
  Grid,
  Tooltip,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { logout, getUserInfo } from '../../utils/auth';
import { supportService } from '../../services/api';
import { authService } from '../../services/auth';
import { representativeService } from '../../services/representative';

// Destek talebi detay sayfası
const SupportRequestDetail = ({ requestId, onClose }) => {
  const { id } = useParams();
  const actualRequestId = requestId || id;
  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Talep detaylarını ve mesajları yükle
  useEffect(() => {
    const fetchRequestDetail = async () => {
      if (!actualRequestId) return;
      
      setLoading(true);
      try {
        // Backend API'ye bağlanmayı dene
        try {
          // Talep detaylarını al
          const requestResponse = await representativeService.getRequestById(actualRequestId);
          setRequest(requestResponse.data);
          
          // Talep mesajlarını al
          const messagesResponse = await representativeService.getRequestMessages(actualRequestId);
          setMessages(messagesResponse.data);
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          // API çağrısı başarısız olursa mock veri kullan
          const now = new Date();
          const user = authService.getCurrentUser();
          
          // Mock talep verisi
          setRequest({
            id: parseInt(actualRequestId),
            subject: 'Ürün İadesi Hakkında',
            description: 'Satın aldığım ürünü iade etmek istiyorum, nasıl bir yol izlemeliyim?',
            status: 'ASSIGNED',
            createdAt: new Date(now.getTime() - 86400000).toISOString(),
            customer: { id: 4, fullName: 'Mehmet Kaya', email: 'mehmet@example.com' },
            representative: { 
              id: user?.id || 2, 
              fullName: user?.fullName || 'Ahmet Yılmaz', 
              email: user?.email || 'ahmet@example.com' 
            }
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
              sender: { 
                id: user?.id || 2, 
                fullName: user?.fullName || 'Ahmet Yılmaz', 
                role: 'REPRESENTATIVE' 
              }
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
              sender: { 
                id: user?.id || 2, 
                fullName: user?.fullName || 'Ahmet Yılmaz', 
                role: 'REPRESENTATIVE' 
              }
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
        setError('Destek talebi detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetail();
  }, [actualRequestId]);

  // Mesaj gönderme işlemi
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      // Backend API'ye bağlanmayı dene
      try {
        const response = await representativeService.sendMessage(actualRequestId, newMessage);
        setMessages([...messages, response.data]);
        setNewMessage('');
      } catch (apiError) {
        console.error('API error, using mock data for message:', apiError);
        // API çağrısı başarısız olursa mock mesaj ekle
        const user = authService.getCurrentUser();
        const mockMessage = {
          id: messages.length + 1,
          content: newMessage,
          createdAt: new Date().toISOString(),
          sender: { 
            id: user?.id || 2, 
            fullName: user?.fullName || 'Ahmet Yılmaz', 
            role: 'REPRESENTATIVE' 
          }
        };
        setMessages([...messages, mockMessage]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Mesaj gönderilirken bir hata oluştu.');
    } finally {
      setSending(false);
    }
  };

  // Talebi kapatma işlemi
  const handleCloseRequest = async () => {
    if (!window.confirm('Bu destek talebini kapatmak istediğinize emin misiniz?')) {
      return;
    }
    
    setClosing(true);
    try {
      // Backend API'ye bağlanmayı dene
      try {
        await representativeService.closeRequest(actualRequestId);
        setRequest({ ...request, status: 'CLOSED', closedAt: new Date().toISOString() });
      } catch (apiError) {
        console.error('API error, using mock data for closing request:', apiError);
        // API çağrısı başarısız olursa mock olarak talebi kapat
        setRequest({ ...request, status: 'CLOSED', closedAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error closing request:', error);
      setError('Talep kapatılırken bir hata oluştu.');
    } finally {
      setClosing(false);
    }
  };

  // Talebi üstlenme işlemi
  const handleAssignRequest = async () => {
    if (!window.confirm('Bu destek talebini üstlenmek istediğinize emin misiniz?')) {
      return;
    }
    
    setLoading(true);
    try {
      // Backend API'ye bağlanmayı dene
      try {
        const user = authService.getCurrentUser();
        await representativeService.assignRequest(actualRequestId, user.id);
        setRequest({ 
          ...request, 
          status: 'ASSIGNED', 
          representative: { 
            id: user.id, 
            fullName: user.fullName, 
            email: user.email 
          } 
        });
      } catch (apiError) {
        console.error('API error, using mock data for assigning request:', apiError);
        // API çağrısı başarısız olursa mock olarak talebi üstlen
        const user = authService.getCurrentUser();
        setRequest({ 
          ...request, 
          status: 'ASSIGNED', 
          representative: { 
            id: user?.id || 2, 
            fullName: user?.fullName || 'Ahmet Yılmaz', 
            email: user?.email || 'ahmet@example.com' 
          } 
        });
      }
    } catch (error) {
      console.error('Error assigning request:', error);
      setError('Talep üstlenilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Destek Talebi: {request?.subject}
        </Typography>
        {request?.status !== 'CLOSED' && (
          <Button 
            variant="outlined" 
            color="success" 
            startIcon={<CheckCircleIcon />}
            onClick={handleCloseRequest}
            disabled={closing}
          >
            {closing ? 'Kapatılıyor...' : 'Talebi Kapat'}
          </Button>
        )}
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Durum:</strong> {request?.status === 'OPEN' ? 'Açık' : request?.status === 'ASSIGNED' ? 'Atandı' : 'Kapatıldı'}
        </Typography>
        <Typography variant="body2">
          <strong>Oluşturulma Tarihi:</strong> {new Date(request?.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          <strong>Müşteri:</strong> {request?.customer?.fullName}
        </Typography>
        <Typography variant="body2">
          <strong>E-posta:</strong> {request?.customer?.email}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Mesajlar
      </Typography>
      
      <List sx={{ maxHeight: '400px', overflow: 'auto', mb: 3 }}>
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    variant="body1"
                    color="text.primary"
                  >
                    {message.type === 'REPRESENTATIVE' && message.sender?.id === getUserInfo().id 
                      ? 'Siz' 
                      : message.type === 'USER' 
                        ? request?.customer?.fullName 
                        : message.type === 'CHATBOT' 
                          ? 'Chatbot' 
                          : message.sender?.fullName || 'Sistem'}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {message.content}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      display="block"
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
      
      {request?.status !== 'CLOSED' && (
        <Box sx={{ display: 'flex', mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={(e) => handleSendMessage(e)}
            disabled={sending || !newMessage.trim()}
            sx={{ ml: 1 }}
          >
            Gönder
          </Button>
        </Box>
      )}
    </Paper>
  );
};

// Destek talepleri listesi
const SupportRequestList = ({ onSelectRequest }) => {
  const [requests, setRequests] = useState({
    open: [],
    assigned: [],
    closed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Kullanıcı bilgisini al
        const user = authService.getCurrentUser();
        setCurrentUser(user);

        // Backend API'ye bağlanmayı dene
        try {
          // Açık talepleri al
          const openResponse = await representativeService.getOpenRequests();
          
          // Atanmış talepleri al
          const assignedResponse = await representativeService.getAssignedRequests(user.id);
          
          // Kapatılmış talepleri al
          const closedResponse = await representativeService.getClosedRequests(user.id);
          
          setRequests({
            open: openResponse.data,
            assigned: assignedResponse.data,
            closed: closedResponse.data
          });
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          // API çağrısı başarısız olursa mock veri kullan
          const now = new Date();
          
          setRequests({
            open: [
              { 
                id: 1, 
                subject: 'Ürün İadesi Hakkında', 
                status: 'OPEN', 
                createdAt: now.toISOString(),
                customer: { id: 4, fullName: 'Mehmet Kaya', email: 'mehmet@example.com' }
              },
              { 
                id: 6, 
                subject: 'Kargo Takibi', 
                status: 'OPEN', 
                createdAt: new Date(now.getTime() - 43200000).toISOString(),
                customer: { id: 7, fullName: 'Fatma Şahin', email: 'fatma@example.com' }
              }
            ],
            assigned: [
              { 
                id: 2, 
                subject: 'Sipariş Durumu', 
                status: 'ASSIGNED', 
                createdAt: new Date(now.getTime() - 86400000).toISOString(),
                customer: { id: 5, fullName: 'Zeynep Öztürk', email: 'zeynep@example.com' },
                representative: { id: user?.id || 2, fullName: user?.fullName || 'Ahmet Yılmaz', email: user?.email || 'ahmet@example.com' }
              },
              { 
                id: 3, 
                subject: 'Fatura Bilgisi', 
                status: 'ASSIGNED', 
                createdAt: new Date(now.getTime() - 172800000).toISOString(),
                customer: { id: 6, fullName: 'Ali Can', email: 'ali@example.com' },
                representative: { id: user?.id || 2, fullName: user?.fullName || 'Ahmet Yılmaz', email: user?.email || 'ahmet@example.com' }
              }
            ],
            closed: [
              { 
                id: 4, 
                subject: 'Ödeme Sorunu', 
                status: 'CLOSED', 
                createdAt: new Date(now.getTime() - 259200000).toISOString(),
                closedAt: new Date(now.getTime() - 172800000).toISOString(),
                customer: { id: 4, fullName: 'Mehmet Kaya', email: 'mehmet@example.com' },
                representative: { id: user?.id || 2, fullName: user?.fullName || 'Ahmet Yılmaz', email: user?.email || 'ahmet@example.com' }
              },
              { 
                id: 5, 
                subject: 'Teslimat Gecikmesi', 
                status: 'CLOSED', 
                createdAt: new Date(now.getTime() - 345600000).toISOString(),
                closedAt: new Date(now.getTime() - 259200000).toISOString(),
                customer: { id: 5, fullName: 'Zeynep Öztürk', email: 'zeynep@example.com' },
                representative: { id: user?.id || 2, fullName: user?.fullName || 'Ahmet Yılmaz', email: user?.email || 'ahmet@example.com' }
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Destek talepleri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestClick = (requestId) => {
    onSelectRequest(requestId);
  };

  const handleAssignRequest = async (requestId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Bu destek talebini üstlenmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      // Backend API'ye bağlanmayı dene
      try {
        const user = authService.getCurrentUser();
        await representativeService.assignRequest(requestId, user.id);
        
        // Talebi açık listesinden kaldır ve atanmış listesine ekle
        const request = requests.open.find(r => r.id === requestId);
        if (request) {
          const updatedRequest = { 
            ...request, 
            status: 'ASSIGNED', 
            representative: { 
              id: user.id, 
              fullName: user.fullName, 
              email: user.email 
            } 
          };
          
          setRequests({
            ...requests,
            open: requests.open.filter(r => r.id !== requestId),
            assigned: [...requests.assigned, updatedRequest]
          });
        }
      } catch (apiError) {
        console.error('API error, using mock data for assigning request:', apiError);
        // API çağrısı başarısız olursa mock olarak talebi üstlen
        const user = authService.getCurrentUser();
        
        // Talebi açık listesinden kaldır ve atanmış listesine ekle
        const request = requests.open.find(r => r.id === requestId);
        if (request) {
          const updatedRequest = { 
            ...request, 
            status: 'ASSIGNED', 
            representative: { 
              id: user?.id || 2, 
              fullName: user?.fullName || 'Ahmet Yılmaz', 
              email: user?.email || 'ahmet@example.com' 
            } 
          };
          
          setRequests({
            ...requests,
            open: requests.open.filter(r => r.id !== requestId),
            assigned: [...requests.assigned, updatedRequest]
          });
        }
      }
    } catch (error) {
      console.error('Error assigning request:', error);
      alert('Talep üstlenilirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Açık ve atanmış talepleri ayrı ayrı grupla
  const openRequests = requests.open;
  const assignedRequests = requests.assigned;
  const closedRequests = requests.closed;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Destek Talepleri
      </Typography>
      
      <Grid container spacing={3}>
        {/* Açık Talepler */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Açık Talepler
          </Typography>
          
          {openRequests.length === 0 ? (
            <Typography variant="body2" sx={{ py: 2 }}>
              Açık destek talebi bulunmamaktadır.
            </Typography>
          ) : (
            <List>
              {openRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    button 
                    onClick={() => handleRequestClick(request.id)}
                    secondaryAction={
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={(e) => handleAssignRequest(request.id, e)}
                      >
                        Üstlen
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={request.subject}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Müşteri: {request.customer?.fullName}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            {new Date(request.createdAt).toLocaleString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Grid>
        
        {/* Atanmış Talepler */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Atanmış Talepleriniz
          </Typography>
          
          {assignedRequests.length === 0 ? (
            <Typography variant="body2" sx={{ py: 2 }}>
              Size atanmış destek talebi bulunmamaktadır.
            </Typography>
          ) : (
            <List>
              {assignedRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    button 
                    onClick={() => handleRequestClick(request.id)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {request.subject}
                          <Chip 
                            label="Atandı" 
                            color="primary" 
                            size="small" 
                            sx={{ ml: 1 }} 
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Müşteri: {request.customer?.fullName}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            {new Date(request.createdAt).toLocaleString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Grid>
        
        {/* Kapatılmış Talepler */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Kapatılmış Talepler
          </Typography>
          
          {closedRequests.length === 0 ? (
            <Typography variant="body2" sx={{ py: 2 }}>
              Kapatılmış destek talebi bulunmamaktadır.
            </Typography>
          ) : (
            <List>
              {closedRequests.slice(0, 5).map((request) => (
                <React.Fragment key={request.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    button 
                    onClick={() => handleRequestClick(request.id)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {request.subject}
                          <Chip 
                            label="Kapatıldı" 
                            color="default" 
                            size="small" 
                            sx={{ ml: 1 }} 
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Müşteri: {request.customer?.fullName}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            Kapatılma: {new Date(request.closedAt).toLocaleString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    </Paper>
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
          <strong>Rol:</strong> Müşteri Temsilcisi
        </Typography>
      </Box>
    </Paper>
  );
};

// Destek Aktivite Haritası Bileşeni
const SupportActivityMap = () => {
  const theme = useTheme();
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxCount, setMaxCount] = useState(10); // Varsayılan maksimum destek sayısı
  
  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      try {
        // Gerçek API'ye bağlanmayı dene
        try {
          const response = await representativeService.getSupportActivity();
          setActivityData(response.data);
          
          // Maksimum destek sayısını bul
          const max = Math.max(...response.data.map(day => day.count));
          setMaxCount(max > 0 ? max : 10);
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          
          // Mock veri oluştur - son 365 gün için
          const mockData = [];
          const today = new Date();
          
          for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Rastgele destek sayısı (0-10 arası)
            // Hafta sonları için daha az destek olasılığı
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            const randomFactor = isWeekend ? 0.3 : 1;
            const count = Math.floor(Math.random() * 10 * randomFactor);
            
            mockData.push({
              date: date.toISOString().split('T')[0],
              count: count
            });
          }
          
          setActivityData(mockData);
        }
      } catch (error) {
        console.error('Error fetching activity data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivityData();
  }, []);
  
  // Renk tonu hesaplama - Sabit mavi tonları kullanarak
  const getColorIntensity = (count) => {
    if (count === 0) return '#ebedf0'; // Boş hücre rengi
    
    // 5 farklı mavi tonu (en açıktan en koyuya)
    const blueShades = [
      '#c6e6ff', // Çok açık mavi
      '#9ecef4', // Açık mavi
      '#6bafdb', // Orta mavi
      '#3984c6', // Koyu mavi
      '#0366d6'  // Çok koyu mavi
    ];
    
    // Destek sayısına göre renk tonu seç
    const intensity = Math.min(Math.ceil((count / maxCount) * 5), 5) - 1;
    return blueShades[intensity];
  };
  
  // Haftaları ve günleri oluştur
  const renderActivityMap = () => {
    if (loading || activityData.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    // Son 52 hafta için veri al
    const last52Weeks = activityData.slice(-364);
    
    // Haftaları oluştur (7 gün x 52 hafta)
    const weeks = [];
    for (let i = 0; i < 52; i++) {
      const weekData = last52Weeks.slice(i * 7, (i + 1) * 7);
      weeks.push(weekData);
    }
    
    // Ayları hesapla
    const months = [];
    let currentMonth = '';
    let monthWidth = 0;
    
    last52Weeks.forEach((day, index) => {
      const date = new Date(day.date);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (month !== currentMonth) {
        if (currentMonth !== '') {
          months.push({ name: currentMonth, width: monthWidth });
        }
        currentMonth = month;
        monthWidth = 1;
      } else {
        monthWidth++;
      }
      
      // Son ay için
      if (index === last52Weeks.length - 1) {
        months.push({ name: currentMonth, width: monthWidth });
      }
    });
    
    // Gün isimleri
    const dayNames = ['Pzt', '', 'Çrş', '', 'Cum', '', 'Paz'];
    
    return (
      <Box sx={{ mt: 4 }}>
        {/* Ay isimleri */}
        <Box sx={{ display: 'flex', mb: 2, ml: 6 }}>
          {months.map((month, idx) => (
            <Typography 
              key={`${month.name}-${idx}`} 
              variant="caption" 
              sx={{ 
                width: `${(month.width / 364) * 100}%`,
                textAlign: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: theme.palette.text.secondary
              }}
            >
              {month.name}
            </Typography>
          ))}
        </Box>
        
        {/* Aktivite haritası */}
        <Box sx={{ display: 'flex' }}>
          {/* Gün isimleri */}
          <Box sx={{ display: 'flex', flexDirection: 'column', mr: 2, mt: 1, width: '30px' }}>
            {dayNames.map((day, idx) => (
              <Typography 
                key={day || `empty-${idx}`} 
                variant="caption" 
                sx={{ 
                  height: '20px', 
                  fontSize: '0.75rem',
                  fontWeight: day ? 'bold' : 'normal',
                  color: theme.palette.text.secondary,
                  textAlign: 'right',
                  lineHeight: '20px',
                  mb: '4px'
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>
          
          {/* Haftalar ve günler */}
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            {weeks.map((week, weekIdx) => (
              <Box key={weekIdx} sx={{ display: 'flex', flexDirection: 'column', width: '16px', mr: '4px' }}>
                {Array(7).fill(null).map((_, dayIdx) => {
                  const dayData = week[dayIdx];
                  const color = dayData ? getColorIntensity(dayData.count) : '#ebedf0';
                  const date = dayData ? new Date(dayData.date) : null;
                  const formattedDate = date ? date.toLocaleDateString() : '';
                  const count = dayData ? dayData.count : 0;
                  
                  return (
                    <Tooltip 
                      key={dayIdx} 
                      title={dayData ? `${formattedDate}: ${count} destek` : 'Veri yok'}
                      arrow
                    >
                      <Box 
                        sx={{ 
                          width: '16px', 
                          height: '16px', 
                          bgcolor: color,
                          borderRadius: '3px',
                          mb: '4px',
                          cursor: 'pointer',
                          border: '1px solid rgba(27, 31, 35, 0.06)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            opacity: 0.8,
                            transform: 'scale(1.2)'
                          }
                        }} 
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Renk skalası */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, justifyContent: 'flex-end' }}>
          <Typography variant="caption" sx={{ mr: 2, fontSize: '0.8rem', fontWeight: 'bold' }}>
            Az
          </Typography>
          {[0, 1, 2, 3, 4].map((level) => {
            const color = level === 0 ? '#ebedf0' : getColorIntensity((level / 4) * maxCount);
            return (
              <Box 
                key={level}
                sx={{ 
                  width: '16px', 
                  height: '16px', 
                  bgcolor: color,
                  borderRadius: '3px',
                  mr: '4px',
                  border: '1px solid rgba(27, 31, 35, 0.06)'
                }} 
              />
            );
          })}
          <Typography variant="caption" sx={{ ml: 2, fontSize: '0.8rem', fontWeight: 'bold' }}>
            Çok
          </Typography>
        </Box>
      </Box>
    );
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Destek Aktivite Haritanız
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Son bir yıl içinde verdiğiniz destek sayısını gösteren aktivite haritası
      </Typography>
      
      {renderActivityMap()}
    </Paper>
  );
};

// Özet sayfası
const Dashboard = () => {
  const [stats, setStats] = useState({
    openRequests: 0,
    assignedRequests: 0,
    closedRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await supportService.getRequests();
        const requests = response.data;
        const userInfo = getUserInfo();
        
        const openCount = requests.filter(req => req.status === 'OPEN').length;
        const assignedCount = requests.filter(req => 
          req.status === 'ASSIGNED' && 
          req.representative?.id === userInfo.id
        ).length;
        const closedCount = requests.filter(req => 
          req.status === 'CLOSED' && 
          req.representative?.id === userInfo.id
        ).length;
        
        setStats({
          openRequests: openCount,
          assignedRequests: assignedCount,
          closedRequests: closedCount
        });
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
    <>
      <SupportActivityMap />
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Özet
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'warning.light',
                borderRadius: '12px',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography variant="h4">{stats.openRequests}</Typography>
              <Typography variant="subtitle1">Açık Talepler</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'info.light',
                borderRadius: '12px',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography variant="h4">{stats.assignedRequests}</Typography>
              <Typography variant="subtitle1">Atanmış Talepleriniz</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'success.light',
                borderRadius: '12px',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography variant="h4">{stats.closedRequests}</Typography>
              <Typography variant="subtitle1">Kapatılmış Talepleriniz</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

// Ana temsilci paneli
const RepresentativeDashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userInfo = getUserInfo();
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectRequest = (requestId) => {
    setSelectedRequestId(requestId);
    navigate(`/representative/requests/${requestId}`);
  };

  const menuItems = [
    { text: 'Özet', icon: <DashboardIcon />, path: '/representative' },
    { text: 'Destek Talepleri', icon: <ChatIcon />, path: '/representative/requests' },
    { text: 'Profil', icon: <AccountCircleIcon />, path: '/representative/profile' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Müşteri Temsilcisi Paneli
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
        sx={{
          '& .MuiDrawer-paper': {
            background: 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Destek Merkezi
            </Typography>
          </Box>
          
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '8px',
                    mx: 1,
                    my: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
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
              <ListItemButton 
                onClick={handleLogout}
                sx={{
                  borderRadius: '8px',
                  mx: 1,
                  my: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.1)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'error.main' }}>
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
          mt: 8,
          background: 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests" element={<SupportRequestList onSelectRequest={handleSelectRequest} />} />
            <Route path="/requests/:id" element={<SupportRequestDetail requestId={selectedRequestId} onClose={() => navigate('/representative/requests')} />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default RepresentativeDashboard;

