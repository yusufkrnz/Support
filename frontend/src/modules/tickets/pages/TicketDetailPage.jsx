import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Chip, 
  Button, 
  IconButton, 
  Avatar, 
  Divider, 
  TextField, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  CircularProgress,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon,
  LocalOffer as TagIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { formatDistanceToNow, format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Helper fonksiyonları
const getStatusColor = (status) => {
  switch (status) {
    case 'open':
      return 'error';
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'resolved':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'open':
      return 'Açık';
    case 'pending':
      return 'Beklemede';
    case 'in_progress':
      return 'İşleniyor';
    case 'resolved':
      return 'Çözüldü';
    default:
      return status;
  }
};

const getPlatformColor = (platform) => {
  switch (platform) {
    case 'trendyol':
      return '#F27A1A';
    case 'hepsiburada':
      return '#FF6000';
    case 'gratis':
      return '#7B1FA2';
    default:
      return '#1976D2';
  }
};

const TicketDetailPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [status, setStatus] = useState('');
  const [assignee, setAssignee] = useState('');
  const [starred, setStarred] = useState(false);
  
  // Bilet detaylarını ve mesajları çek
  useEffect(() => {
    const fetchTicketDetails = async () => {
      setLoading(true);
      try {
        // Gerçek uygulamada API çağrısı yapılır
        // const response = await api.getTicketDetails(id);
        // setTicket(response.data.ticket);
        // setMessages(response.data.messages);
        // setStatus(response.data.ticket.status);
        // setAssignee(response.data.ticket.assignee?.id || '');
        
        // Mock veri
        setTimeout(() => {
          const mockTicket = {
            id,
            subject: `Ürün iade işlemi #${id}`,
            description: 'Merhaba, geçen hafta sipariş ettiğim ürünü iade etmek istiyorum. Ürün açıklamada belirtildiği gibi değil ve beklentilerimi karşılamıyor. İade sürecini nasıl başlatabilirim?',
            customer: {
              id: 'cust-123',
              name: 'Ahmet Yılmaz',
              email: 'ahmet@example.com',
              avatar: null
            },
            status: 'in_progress',
            platform: 'trendyol',
            createdAt: new Date(Date.now() - (1000 * 60 * 60 * 24 * 2)), // 2 gün önce
            updatedAt: new Date(Date.now() - (1000 * 60 * 30)), // 30 dakika önce
            priority: 'high',
            orderNumber: 'TYL-1234567',
            tags: ['iade', 'ürün_sorunu'],
            assignee: {
              id: 'user-456',
              name: 'Zeynep Şahin',
              avatar: null
            }
          };
          
          const mockMessages = [
            {
              id: 'msg-1',
              body: 'Merhaba, geçen hafta sipariş ettiğim ürünü iade etmek istiyorum. Ürün açıklamada belirtildiği gibi değil ve beklentilerimi karşılamıyor. İade sürecini nasıl başlatabilirim?',
              sender: {
                id: 'cust-123',
                name: 'Ahmet Yılmaz',
                type: 'customer',
                avatar: null
              },
              createdAt: new Date(Date.now() - (1000 * 60 * 60 * 24 * 2)), // 2 gün önce
              attachments: []
            },
            {
              id: 'msg-2',
              body: 'Merhaba Ahmet Bey, talebiniz için teşekkür ederiz. İade talebinizi işleme alabilmemiz için sipariş numaranızı ve iade etmek istediğiniz ürünün kodunu paylaşabilir misiniz?',
              sender: {
                id: 'user-456',
                name: 'Zeynep Şahin',
                type: 'agent',
                avatar: null
              },
              createdAt: new Date(Date.now() - (1000 * 60 * 60 * 24 * 1)), // 1 gün önce
              attachments: []
            },
            {
              id: 'msg-3',
              body: 'Sipariş numaram TYL-1234567, ürün kodu ise ABC123. İade süreci hakkında bilgi alabilir miyim?',
              sender: {
                id: 'cust-123',
                name: 'Ahmet Yılmaz',
                type: 'customer',
                avatar: null
              },
              createdAt: new Date(Date.now() - (1000 * 60 * 60 * 20)), // 20 saat önce
              attachments: []
            },
            {
              id: 'msg-4',
              body: 'Teşekkürler Ahmet Bey. İade talebinizi sisteme kaydettim. Size bir iade kodu göndereceğim, bu kodu kullanarak ürünü anlaşmalı kargo şirketimiz üzerinden ücretsiz olarak gönderebilirsiniz. İade kodunuz: RTN-7890. Bu kodu kargo görevlisine iletmeniz yeterli olacaktır. Başka bir sorunuz var mı?',
              sender: {
                id: 'user-456',
                name: 'Zeynep Şahin',
                type: 'agent',
                avatar: null
              },
              createdAt: new Date(Date.now() - (1000 * 60 * 60 * 18)), // 18 saat önce
              attachments: []
            }
          ];
          
          setTicket(mockTicket);
          setMessages(mockMessages);
          setStatus(mockTicket.status);
          setAssignee(mockTicket.assignee?.id || '');
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Bilet detayları yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };
    
    fetchTicketDetails();
  }, [id]);
  
  // Yeni mesaj gönder
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Gerçek uygulamada API çağrısı yapılır
    // api.sendMessage(id, newMessage);
    
    // Mock veri - yeni mesaj oluştur ve listeye ekle
    const newMsg = {
      id: `msg-${messages.length + 1}`,
      body: newMessage,
      sender: {
        id: 'user-456',
        name: 'Zeynep Şahin',
        type: 'agent',
        avatar: null
      },
      createdAt: new Date(),
      attachments: []
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  // Durum güncelle
  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    
    // Gerçek uygulamada API çağrısı yapılır
    // api.updateTicketStatus(id, newStatus);
  };
  
  // Görevli değiştir
  const handleAssigneeChange = (event) => {
    const newAssignee = event.target.value;
    setAssignee(newAssignee);
    
    // Gerçek uygulamada API çağrısı yapılır
    // api.updateTicketAssignee(id, newAssignee);
  };
  
  // Yıldızla/yıldızı kaldır
  const handleStarToggle = () => {
    setStarred(!starred);
    
    // Gerçek uygulamada API çağrısı yapılır
    // api.toggleTicketStar(id, !starred);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs ve ana başlık */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link 
            component={RouterLink} 
            to="/dashboard"
            underline="hover"
            color="inherit"
          >
            Dashboard
          </Link>
          <Link 
            component={RouterLink} 
            to="/tickets"
            underline="hover"
            color="inherit"
          >
            Destek Talepleri
          </Link>
          <Typography color="text.primary">{ticket.id}</Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={() => navigate('/tickets')}
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">
              {ticket.subject}
            </Typography>
            <IconButton onClick={handleStarToggle}>
              {starred ? <StarIcon sx={{ color: '#FFD700' }} /> : <StarBorderIcon />}
            </IconButton>
          </Box>
          
          <Button 
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => {
              if (window.confirm('Bu destek talebini silmek istediğinize emin misiniz?')) {
                // Gerçek uygulamada API çağrısı yapılır
                // api.deleteTicket(id);
                alert('Destek talebi silindi');
                navigate('/tickets');
              }
            }}
          >
            Sil
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Sol taraf - Mesajlar ve yanıt formu */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 0, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, mb: 3 }}>
            {/* Mesaj listesi */}
            <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ 
                      p: 3, 
                      bgcolor: message.sender.type === 'agent' ? 'background.paper' : 'primary.light' 
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        alt={message.sender.name} 
                        src={message.sender.avatar}
                        sx={{ 
                          bgcolor: message.sender.type === 'agent' ? 'primary.main' : getPlatformColor(ticket.platform)
                        }}
                      >
                        {message.sender.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="span" fontWeight="medium">
                            {message.sender.name} 
                            {message.sender.type === 'agent' && 
                              <Chip 
                                size="small" 
                                label="Destek Ekibi" 
                                sx={{ ml: 1, height: 20 }}
                                color="primary"
                              />
                            }
                          </Typography>
                          <Tooltip title={format(new Date(message.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}>
                            <Typography variant="caption" component="span" color="text.secondary">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: tr })}
                            </Typography>
                          </Tooltip>
                        </Box>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          sx={{ 
                            display: 'block', 
                            mt: 1,
                            whiteSpace: 'pre-line'
                          }}
                        >
                          {message.body}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < messages.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          {/* Yanıt formu */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              border: `1px solid ${theme.palette.divider}`, 
              borderRadius: 2 
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Yanıtınızı buraya yazın..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                onClick={() => alert('Dosya ekleme henüz aktif değil')}
              >
                Dosya Ekle
              </Button>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                Yanıt Gönder
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Sağ taraf - Destek talebi detayları */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              mb: 3, 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Destek Talebi Detayları
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body1">
                    {ticket.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Durum
                  </Typography>
                  <Chip 
                    label={getStatusText(ticket.status)} 
                    color={getStatusColor(ticket.status)} 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Platform
                  </Typography>
                  <Chip
                    label={ticket.platform.charAt(0).toUpperCase() + ticket.platform.slice(1)}
                    size="small"
                    sx={{ 
                      bgcolor: getPlatformColor(ticket.platform) + '20', 
                      color: getPlatformColor(ticket.platform),
                      fontWeight: 'medium'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Öncelik
                  </Typography>
                  <Chip 
                    label={
                      ticket.priority === 'high' ? 'Yüksek' : 
                      ticket.priority === 'medium' ? 'Orta' : 'Düşük'
                    } 
                    color={
                      ticket.priority === 'high' ? 'error' : 
                      ticket.priority === 'medium' ? 'warning' : 'success'
                    } 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Oluşturma Tarihi
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" />
                    {format(new Date(ticket.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                  </Typography>
                </Grid>
                {ticket.orderNumber && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Sipariş Numarası
                    </Typography>
                    <Typography variant="body1">
                      {ticket.orderNumber}
                    </Typography>
                  </Grid>
                )}
                {ticket.tags && ticket.tags.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Etiketler
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {ticket.tags.map(tag => (
                        <Chip 
                          key={tag}
                          label={tag} 
                          size="small"
                          variant="outlined"
                          icon={<TagIcon fontSize="small" />}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
          
          <Card 
            elevation={0} 
            sx={{ 
              mb: 3, 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2 
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Müşteri Bilgileri
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  alt={ticket.customer.name} 
                  src={ticket.customer.avatar}
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    mr: 2,
                    bgcolor: getPlatformColor(ticket.platform)
                  }}
                >
                  {ticket.customer.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {ticket.customer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.customer.email}
                  </Typography>
                </Box>
              </Box>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => alert('Müşteri profili henüz aktif değil')}
              >
                Müşteri Profilini Görüntüle
              </Button>
            </CardContent>
          </Card>
          
          <Card 
            elevation={0} 
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2 
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                İşlemler
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="status-select-label">Durum</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={status}
                  label="Durum"
                  onChange={handleStatusChange}
                  size="small"
                >
                  <MenuItem value="open">Açık</MenuItem>
                  <MenuItem value="pending">Beklemede</MenuItem>
                  <MenuItem value="in_progress">İşleniyor</MenuItem>
                  <MenuItem value="resolved">Çözüldü</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="assignee-select-label">Görevli</InputLabel>
                <Select
                  labelId="assignee-select-label"
                  value={assignee}
                  label="Görevli"
                  onChange={handleAssigneeChange}
                  size="small"
                >
                  <MenuItem value="">Görevli Yok</MenuItem>
                  <MenuItem value="user-456">Zeynep Şahin</MenuItem>
                  <MenuItem value="user-789">Mehmet Yıldız</MenuItem>
                  <MenuItem value="user-123">Ayşe Kaya</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => alert('Düzenleme henüz aktif değil')}
                >
                  Düzenle
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => alert('Yenileme henüz aktif değil')}
                >
                  Yenile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketDetailPage; 