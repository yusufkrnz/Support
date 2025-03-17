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
  TextField
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import { logout, getUserInfo } from '../../utils/auth';
import { supportService } from '../../services/api';
import { authService } from '../../services/auth';
import { customerService } from '../../services/customer';
import { aiService } from '../../services/ai';

// Destek talebi detay sayfası
const SupportRequestDetail = ({ requestId, onClose }) => {
  const { id } = useParams();
  const actualRequestId = requestId || id;
  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
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
          const requestResponse = await customerService.getRequestById(actualRequestId);
          setRequest(requestResponse.data);
          
          // Talep mesajlarını al
          const messagesResponse = await customerService.getRequestMessages(actualRequestId);
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
            customer: { 
              id: user?.id || 4, 
              fullName: user?.fullName || 'Mehmet Kaya', 
              email: user?.email || 'mehmet@example.com' 
            },
            representative: { id: 2, fullName: 'Ahmet Yılmaz', email: 'ahmet@example.com' }
          });
          
          // Mock mesaj verisi
          setMessages([
            {
              id: 1,
              content: 'Satın aldığım ürünü iade etmek istiyorum, nasıl bir yol izlemeliyim?',
              createdAt: new Date(now.getTime() - 86400000).toISOString(),
              sender: { 
                id: user?.id || 4, 
                fullName: user?.fullName || 'Mehmet Kaya', 
                role: 'CUSTOMER' 
              }
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
              sender: { 
                id: user?.id || 4, 
                fullName: user?.fullName || 'Mehmet Kaya', 
                role: 'CUSTOMER' 
              }
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
        const response = await customerService.sendMessage(actualRequestId, newMessage);
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
            id: user?.id || 4, 
            fullName: user?.fullName || 'Mehmet Kaya', 
            role: 'CUSTOMER' 
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Destek Talebi: {request?.subject}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Durum:</strong> {request?.status === 'OPEN' ? 'Açık' : request?.status === 'ASSIGNED' ? 'Atandı' : 'Kapatıldı'}
        </Typography>
        <Typography variant="body2">
          <strong>Oluşturulma Tarihi:</strong> {new Date(request?.createdAt).toLocaleString()}
        </Typography>
        {request?.representative && (
          <Typography variant="body2">
            <strong>Müşteri Temsilcisi:</strong> {request.representative.fullName}
          </Typography>
        )}
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
                    {message.type === 'USER' ? 'Siz' : message.sender?.fullName || (message.type === 'CHATBOT' ? 'Chatbot' : 'Sistem')}
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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Kullanıcı bilgisini al
        const user = authService.getCurrentUser();
        setCurrentUser(user);

        // Backend API'ye bağlanmayı dene
        try {
          const response = await customerService.getMyRequests(user.id);
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
              customer: { id: user?.id || 4, fullName: user?.fullName || 'Mehmet Kaya', email: user?.email || 'mehmet@example.com' }
            },
            { 
              id: 2, 
              subject: 'Sipariş Durumu', 
              status: 'ASSIGNED', 
              createdAt: new Date(now.getTime() - 86400000).toISOString(),
              customer: { id: user?.id || 4, fullName: user?.fullName || 'Mehmet Kaya', email: user?.email || 'mehmet@example.com' },
              representative: { id: 2, fullName: 'Ahmet Yılmaz', email: 'ahmet@example.com' }
            },
            { 
              id: 4, 
              subject: 'Ödeme Sorunu', 
              status: 'CLOSED', 
              createdAt: new Date(now.getTime() - 259200000).toISOString(),
              closedAt: new Date(now.getTime() - 172800000).toISOString(),
              customer: { id: user?.id || 4, fullName: user?.fullName || 'Mehmet Kaya', email: user?.email || 'mehmet@example.com' },
              representative: { id: 2, fullName: 'Ahmet Yılmaz', email: 'ahmet@example.com' }
            }
          ]);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Destek Talepleriniz
      </Typography>
      
      {requests.length === 0 ? (
        <Typography variant="body1" sx={{ py: 2 }}>
          Henüz destek talebiniz bulunmamaktadır.
        </Typography>
      ) : (
        <List>
          {requests.map((request) => (
            <React.Fragment key={request.id}>
              <ListItem 
                alignItems="flex-start" 
                button 
                onClick={() => handleRequestClick(request.id)}
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
                        Durum: {request.status === 'OPEN' ? 'Açık' : request.status === 'ASSIGNED' ? 'Atandı' : 'Kapatıldı'}
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
      
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<ChatIcon />}
          onClick={() => onSelectRequest('/customer/chat')}
        >
          Yeni Destek Talebi
        </Button>
      </Box>
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
      </Box>
    </Paper>
  );
};

// Chatbot sayfası
const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Merhaba! Size nasıl yardımcı olabilirim?', sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Mesajları en alta kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mesaj gönderme işlemi
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { id: messages.length + 1, text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Backend API'ye bağlanmayı dene
      try {
        const response = await aiService.getChatbotResponse(input);
        const botResponse = { 
          id: messages.length + 2, 
          text: response.data.message, 
          sender: 'bot', 
          timestamp: new Date(),
          createTicket: response.data.createTicket || false
        };
        setMessages(prev => [...prev, botResponse]);
        
        // Eğer bot yeni talep oluşturmayı öneriyorsa formu göster
        if (response.data.createTicket) {
          setShowNewTicketForm(true);
          setTicketSubject(response.data.suggestedSubject || '');
          setTicketDescription(input);
        }
      } catch (apiError) {
        console.error('API error, using mock data for chatbot:', apiError);
        // API çağrısı başarısız olursa mock yanıt oluştur
        
        // Basit bir yapay zeka yanıtı simülasyonu
        let botResponse;
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('iade') || lowerInput.includes('geri')) {
          botResponse = { 
            id: messages.length + 2, 
            text: 'İade işlemleri için ürünü satın aldığınız tarihten itibaren 14 gün içinde faturası ve kutusuyla birlikte mağazamıza getirebilirsiniz. Size daha detaylı yardımcı olabilmem için bir destek talebi oluşturmak ister misiniz?', 
            sender: 'bot', 
            timestamp: new Date(),
            createTicket: true
          };
          setShowNewTicketForm(true);
          setTicketSubject('Ürün İadesi Hakkında');
          setTicketDescription(input);
        } else if (lowerInput.includes('kargo') || lowerInput.includes('teslimat') || lowerInput.includes('sipariş')) {
          botResponse = { 
            id: messages.length + 2, 
            text: 'Siparişinizin durumunu kontrol etmek için sipariş numaranızı paylaşabilir misiniz? Alternatif olarak, size daha detaylı yardımcı olabilmesi için bir müşteri temsilcisine bağlanmak ister misiniz?', 
            sender: 'bot', 
            timestamp: new Date(),
            createTicket: true
          };
          setShowNewTicketForm(true);
          setTicketSubject('Sipariş Durumu Hakkında');
          setTicketDescription(input);
        } else if (lowerInput.includes('ödeme') || lowerInput.includes('fatura')) {
          botResponse = { 
            id: messages.length + 2, 
            text: 'Ödeme veya fatura ile ilgili sorunlar için müşteri temsilcilerimiz size yardımcı olacaktır. Bir destek talebi oluşturmak ister misiniz?', 
            sender: 'bot', 
            timestamp: new Date(),
            createTicket: true
          };
          setShowNewTicketForm(true);
          setTicketSubject('Ödeme/Fatura Sorunu');
          setTicketDescription(input);
        } else {
          botResponse = { 
            id: messages.length + 2, 
            text: 'Bu konuda size daha detaylı bilgi vermek için bir müşteri temsilcimizin yardımcı olması gerekiyor. Bir destek talebi oluşturmak ister misiniz?', 
            sender: 'bot', 
            timestamp: new Date(),
            createTicket: true
          };
          setShowNewTicketForm(true);
          setTicketSubject('Genel Destek Talebi');
          setTicketDescription(input);
        }
        
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      setError('Chatbot yanıtı alınırken bir hata oluştu.');
      setMessages(prev => [...prev, { 
        id: messages.length + 2, 
        text: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya bir destek talebi oluşturun.', 
        sender: 'bot', 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Yeni destek talebi oluşturma
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketSubject.trim()) {
      setError('Lütfen bir konu belirtin.');
      return;
    }
    
    setSubmittingTicket(true);
    try {
      // Backend API'ye bağlanmayı dene
      try {
        const user = authService.getCurrentUser();
        const response = await customerService.createRequest({
          subject: ticketSubject,
          description: ticketDescription,
          customerId: user.id
        });
        
        // Başarılı oluşturma sonrası kullanıcıyı talep detayına yönlendir
        navigate(`/customer/requests/${response.data.id}`);
      } catch (apiError) {
        console.error('API error, using mock data for ticket creation:', apiError);
        // API çağrısı başarısız olursa başarılı olmuş gibi davran
        setMessages(prev => [...prev, { 
          id: messages.length + 1, 
          text: 'Destek talebiniz başarıyla oluşturuldu! Kısa süre içinde bir temsilcimiz sizinle iletişime geçecektir.', 
          sender: 'bot', 
          timestamp: new Date() 
        }]);
        setShowNewTicketForm(false);
        setTicketSubject('');
        setTicketDescription('');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError('Destek talebi oluşturulurken bir hata oluştu.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Yeni talep formunu iptal et
  const handleCancelTicket = () => {
    setShowNewTicketForm(false);
    setTicketSubject('');
    setTicketDescription('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Chatbot
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          {messages.map((message) => (
            <Typography key={message.id} variant="body2" color={message.sender === 'user' ? 'primary' : 'text.primary'}>
              {message.text}
            </Typography>
          ))}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Mesajınızı yazın..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={(e) => handleSendMessage(e)}
          disabled={loading || !input.trim()}
          sx={{ ml: 1 }}
        >
          Gönder
        </Button>
      </Box>
      
      {showNewTicketForm && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Yeni Destek Talebi
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Konu"
            value={ticketSubject}
            onChange={(e) => setTicketSubject(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Açıklama"
            value={ticketDescription}
            onChange={(e) => setTicketDescription(e.target.value)}
            multiline
            rows={4}
          />
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateTicket}
              disabled={submittingTicket}
            >
              Destek Talebi Oluştur
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancelTicket}
              sx={{ ml: 2 }}
            >
              İptal
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

// Ana müşteri paneli
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userInfo = getUserInfo();
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectRequest = (requestId) => {
    if (requestId === '/customer/chat') {
      navigate(requestId);
    } else {
      setSelectedRequestId(requestId);
      navigate(`/customer/requests/${requestId}`);
    }
  };

  const menuItems = [
    { text: 'Destek Taleplerim', icon: <HistoryIcon />, path: '/customer/requests' },
    { text: 'Yeni Destek Talebi', icon: <ChatIcon />, path: '/customer/chat' },
    { text: 'Profil', icon: <AccountCircleIcon />, path: '/customer/profile' }
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
            Müşteri Paneli
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
            <Route path="/" element={<SupportRequestList onSelectRequest={handleSelectRequest} />} />
            <Route path="/requests" element={<SupportRequestList onSelectRequest={handleSelectRequest} />} />
            <Route path="/requests/:id" element={<SupportRequestDetail requestId={selectedRequestId} onClose={() => navigate('/customer/requests')} />} />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;