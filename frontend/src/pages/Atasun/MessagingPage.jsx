import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  Button, 
  CircularProgress, 
  Badge,
  IconButton,
  TextField,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme as useMuiTheme,
  Tooltip
} from '@mui/material';
import theme from '../../themes/Atasun/theme';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomerMessaging from '../../components/CustomerMessaging';
import ChatIcon from '@mui/icons-material/Chat';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DoneIcon from '@mui/icons-material/Done';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const AtasunMessagingPage = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState('101'); // Demo ID
  const [managerId, setManagerId] = useState('201'); // Demo ID
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  useEffect(() => {
    // Check if user is logged in
    const customerLoggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
    const customerCompany = localStorage.getItem('customerCompany');
    
    setIsLoggedIn(customerLoggedIn && customerCompany === 'atasun');
    
    if (!customerLoggedIn || customerCompany !== 'atasun') {
      navigate('/atasun/login');
      return;
    }
    
    // Demo data loading simulation
    setTimeout(() => {
      // Set ticket data
      setTicket({
        id: ticketId || 'ATS-1234',
        subject: 'Sipariş ettiğim gözlük hala gelmedi',
        status: 'OPEN',
        createdAt: '2023-06-12T14:30:00',
        lastUpdated: '2023-06-14T09:15:00',
        priority: 'MEDIUM',
        category: 'Sipariş Takibi',
        assignedManager: {
          id: '201',
          name: 'Merve Yılmaz',
          department: 'Müşteri Hizmetleri'
        }
      });
      
      // Set demo messages
      setMessages([
        {
          id: 'm1',
          sender: 'customer',
          senderId: customerId,
          text: 'Merhaba, 5 Haziran tarihinde verdiğim gözlük siparişi hala elime ulaşmadı. Sipariş numarası: SIP-78945.',
          timestamp: '2023-06-12T14:30:00',
          read: true
        },
        {
          id: 'm2',
          sender: 'manager',
          senderId: managerId,
          text: 'Merhaba, siparişinizi kontrol ediyorum. Lütfen bekleyin.',
          timestamp: '2023-06-13T09:15:00',
          read: true
        },
        {
          id: 'm3',
          sender: 'manager',
          senderId: managerId,
          text: 'Siparişiniz hazırlanmış ve kargoya verilmiş görünüyor. Kargo takip numarası: TR123456789. Bugün veya yarın teslim edilmesi bekleniyor.',
          timestamp: '2023-06-13T09:25:00',
          read: true
        },
        {
          id: 'm4',
          sender: 'customer',
          senderId: customerId,
          text: 'Teşekkür ederim. Kargo şirketi hangisi acaba?',
          timestamp: '2023-06-13T10:45:00',
          read: true
        },
        {
          id: 'm5',
          sender: 'manager',
          senderId: managerId,
          text: 'Yurtiçi Kargo ile gönderilmiş. Takip numarası ile Yurtiçi Kargo web sitesinden takip edebilirsiniz.',
          timestamp: '2023-06-13T11:05:00',
          read: true
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [ticketId, navigate, customerId, managerId]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleLogout = () => {
    localStorage.removeItem('isCustomerLoggedIn');
    localStorage.removeItem('customerCompany');
    navigate('/atasun');
  };
  
  const handleBackToDashboard = () => {
    navigate('/atasun/dashboard');
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedFile) return;
    
    setSending(true);
    
    // Simulate sending message
    setTimeout(() => {
      const newMsg = {
        id: `m${messages.length + 1}`,
        sender: 'customer',
        senderId: customerId,
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        attachment: selectedFile ? {
          name: selectedFile.name,
          type: selectedFile.type,
          url: URL.createObjectURL(selectedFile)
        } : null
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setSelectedFile(null);
      setSending(false);
      
      // Simulate agent response after 2 seconds
      if (messages.length < 10) {
        setTimeout(() => {
          const responseMsg = {
            id: `m${messages.length + 2}`,
            sender: 'manager',
            senderId: managerId,
            text: 'Mesajınız için teşekkürler. En kısa sürede yanıt vereceğim.',
            timestamp: new Date().toISOString(),
            read: false
          };
          
          setMessages(prev => [...prev, responseMsg]);
        }, 2000);
      }
    }, 500);
  };
  
  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
  
  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return { color: 'warning.main', label: 'Açık' };
      case 'CLOSED':
        return { color: 'success.main', label: 'Kapalı' };
      case 'IN_PROGRESS':
        return { color: 'info.main', label: 'İşlemde' };
      default:
        return { color: 'text.secondary', label: 'Beklemede' };
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return { color: 'error.main', label: 'Yüksek' };
      case 'MEDIUM':
        return { color: 'warning.main', label: 'Orta' };
      case 'LOW':
        return { color: 'success.main', label: 'Düşük' };
      default:
        return { color: 'text.secondary', label: 'Normal' };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor={theme.background}>
        <CircularProgress style={{ color: theme.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: theme.background, 
      color: theme.text, 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
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
      
      <Container maxWidth="lg" sx={{ 
        mt: 3, 
        mb: 3, 
        display: 'flex', 
        flexDirection: 'column',
        flexGrow: 1
      }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="text" 
          onClick={handleBackToDashboard}
          sx={{ mb: 2, color: theme.primary, alignSelf: 'flex-start' }}
        >
          Panele Geri Dön
        </Button>
        
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          {/* Ticket Details */}
          <Grid item xs={12} md={4} lg={3}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 2,
                height: '100%',
                border: '1px solid rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                }
              }}
            >
              <Box sx={{ 
                p: 2, 
                background: 'linear-gradient(to right, #007398, #00526D)',
                color: 'white'
              }}>
                <Typography variant="h6" fontWeight="bold">
                Talep Detayları
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  #{ticket.id}
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Konu
                </Typography>
                  <Typography variant="body1" fontWeight="medium">
                  {ticket.subject}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Durum
                </Typography>
                  <Chip 
                    label={getStatusColor(ticket.status).label}
                    size="small"
                  sx={{ 
                      color: getStatusColor(ticket.status).color,
                      borderColor: getStatusColor(ticket.status).color,
                      fontWeight: 'medium'
                    }}
                    variant="outlined"
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Öncelik
                </Typography>
                  <Chip 
                    icon={<PriorityHighIcon sx={{ fontSize: '16px !important' }} />}
                    label={getPriorityColor(ticket.priority).label}
                    size="small"
                    sx={{ 
                      color: getPriorityColor(ticket.priority).color,
                      fontWeight: 'medium'
                    }}
                    variant="outlined"
                  />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Kategori
                </Typography>
                  <Typography variant="body2">
                    {ticket.category || 'Genel'}
                </Typography>
              </Box>
                
                <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Oluşturulma Tarihi
                </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    {formatDate(ticket.createdAt)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Son Güncelleme
                </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    {formatDate(ticket.lastUpdated)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
                <Box sx={{ mb: 0 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Atanan Yetkili
              </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                        width: 32, 
                        height: 32, 
                    bgcolor: theme.primary,
                        mr: 1.5,
                        fontSize: 14
                  }}
                >
                  {ticket.assignedManager.name.charAt(0)}
                </Avatar>
                <Box>
                      <Typography variant="body2" fontWeight="medium">
                    {ticket.assignedManager.name}
                  </Typography>
                      <Typography variant="caption" color="text.secondary">
                    {ticket.assignedManager.department}
                  </Typography>
                </Box>
              </Box>
                </Box>
                
                {!isMobile && ticket.status !== 'CLOSED' && (
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<HighlightOffIcon />}
                    sx={{ 
                      mt: 3,
                      borderColor: 'error.main',
                      color: 'error.main',
                      '&:hover': {
                        borderColor: 'error.dark',
                        bgcolor: 'rgba(211, 47, 47, 0.04)'
                      }
                    }}
                  >
                    Talebi Kapat
                  </Button>
                )}
                
                {!isMobile && ticket.status === 'CLOSED' && (
                  <Button
                    variant="outlined"
                    color="success"
                    fullWidth
                    startIcon={<DoneIcon />}
                    disabled
                    sx={{ 
                      mt: 3,
                      borderColor: 'success.main',
                      color: 'success.main'
                    }}
                  >
                    Talep Kapatıldı
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Chat Section */}
          <Grid item xs={12} md={8} lg={9}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.08)',
                '&:hover': {
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                }
              }}
            >
              <Box sx={{ 
                p: 2, 
                bgcolor: '#f5f5f5',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <ChatIcon color="primary" />
                <Typography variant="h6" fontWeight="medium">
                  Mesajlar
                </Typography>
                {isMobile && (
                  <Chip 
                    label={getStatusColor(ticket.status).label}
                    size="small"
                    sx={{ 
                      ml: 'auto',
                      color: getStatusColor(ticket.status).color,
                      borderColor: getStatusColor(ticket.status).color,
                      fontWeight: 'medium'
                    }}
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Box sx={{ 
                flexGrow: 1, 
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                bgcolor: '#f9f9f9'
              }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: message.sender === 'customer' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      alignSelf: message.sender === 'customer' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1
                    }}>
                      {message.sender !== 'customer' && (
                        <Avatar
                          src={message.sender === 'manager' ? '/assets/agent-avatar.png' : null}
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: message.sender === 'manager' ? theme.primary : '#9C27B0'
                          }}
                        >
                          {message.sender === 'manager' ? 'MY' : 'C'}
                        </Avatar>
                      )}
                      
                      <Box>
                        <Box
                          sx={{
                            bgcolor: message.sender === 'customer' ? 'rgba(0, 115, 152, 0.1)' : '#fff',
                            borderRadius: 2,
                            p: 2,
                            maxWidth: '100%',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            border: '1px solid',
                            borderColor: message.sender === 'customer' ? 'rgba(0, 115, 152, 0.2)' : 'rgba(0,0,0,0.05)'
                          }}
                        >
                          <Typography variant="body1" component="div" sx={{ overflowWrap: 'break-word' }}>
                            {message.text}
                          </Typography>
                          
                          {message.attachment && (
                            <Box sx={{ mt: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AttachFileIcon />}
                                sx={{ 
                                  textTransform: 'none', 
                                  borderRadius: 1,
                                  color: 'text.secondary',
                                  borderColor: 'rgba(0,0,0,0.15)'
                                }}
                                href={message.attachment.url}
                                target="_blank"
                              >
                                {message.attachment.name}
                              </Button>
                            </Box>
                          )}
                        </Box>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            mt: 0.5, 
                            display: 'flex', 
                            justifyContent: message.sender === 'customer' ? 'flex-end' : 'flex-start',
                            px: 1
                          }}
                        >
                          {formatMessageTime(message.timestamp)}
                        </Typography>
                      </Box>
                      
                      {message.sender === 'customer' && (
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: theme.secondary
                          }}
                        >
                          C
                        </Avatar>
                      )}
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              
              {ticket.status !== 'CLOSED' ? (
                <Box sx={{ 
                  p: 2, 
                  borderTop: '1px solid rgba(0,0,0,0.08)',
                  bgcolor: '#fff'
                }}>
                  {selectedFile && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        bgcolor: 'rgba(0,0,0,0.05)',
                        p: 1,
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <AttachFileIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>
                        {selectedFile.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={handleRemoveFile}
                        sx={{ color: 'text.secondary' }}
                      >
                        <HighlightOffIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Mesajınızı yazın..."
                      variant="outlined"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      multiline
                      maxRows={4}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: theme.primary,
                          },
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <Box>
                      <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      />
                      <Tooltip title="Dosya Ekle">
                        <IconButton 
                          color="primary" 
                          sx={{ 
                            mr: 1,
                            color: theme.primary 
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <AttachFileIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Gönder">
                        <span>
                          <IconButton 
                            color="primary" 
                            onClick={handleSendMessage} 
                            disabled={(!newMessage.trim() && !selectedFile) || sending}
                            sx={{ 
                              bgcolor: theme.primary,
                              color: 'white',
                              '&:hover': {
                                bgcolor: theme.primaryDark
                              },
                              '&.Mui-disabled': {
                                bgcolor: 'rgba(0, 115, 152, 0.3)',
                                color: 'white'
                              }
                            }}
                          >
                            {sending ? (
                              <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                              <SendIcon />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    p: 3, 
                    borderTop: '1px solid rgba(0,0,0,0.08)',
                    bgcolor: 'rgba(76, 175, 80, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}
                >
                  <DoneIcon color="success" />
                  <Typography color="success.main">
                    Bu talep kapatılmıştır. Yeni bir talep oluşturmak için lütfen panele dönün.
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AtasunMessagingPage; 