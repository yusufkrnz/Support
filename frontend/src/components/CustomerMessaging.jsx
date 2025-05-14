import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Avatar, 
  IconButton, 
  Divider, 
  CircularProgress, 
  Badge
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CloseIcon from '@mui/icons-material/Close';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const CustomerMessaging = ({ ticketId, customerId, managerId, companyType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Renk teması belirle
  const getTheme = () => {
    switch (companyType) {
      case 'atasun':
        return {
          primary: '#007398',
          secondary: '#FF9D00',
          background: '#f5f9fa'
        };
      case 'gratis':
        return {
          primary: '#E6007E',
          secondary: '#10069F',
          background: '#F9F0F5'
        };
      case 'bim':
        return {
          primary: '#ED1C24',
          secondary: '#003368',
          background: '#F5F5F5'
        };
      default:
        return {
          primary: '#2196f3',
          secondary: '#ff9800',
          background: '#f5f5f5'
        };
    }
  };
  
  const theme = getTheme();
  
  // Mesajlaşma geçmişini yükle
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // API'den mesajlaşma geçmişini yükleme
        // const response = await api.getMessages(ticketId);
        // setMessages(response.data);
        
        // Demo için örnek mesajlar
        setTimeout(() => {
          const demoMessages = [
            {
              id: 1,
              content: 'Merhaba, size nasıl yardımcı olabilirim?',
              senderId: managerId,
              receiverId: customerId,
              ticketId: ticketId,
              sentAt: '2023-06-14T09:30:00',
              isRead: true
            },
            {
              id: 2,
              content: 'Siparişimin durumunu öğrenmek istiyorum. Sipariş numaram: #12345',
              senderId: customerId,
              receiverId: managerId,
              ticketId: ticketId,
              sentAt: '2023-06-14T09:35:00',
              isRead: true
            },
            {
              id: 3,
              content: 'Sipariş detaylarınızı kontrol ediyorum, lütfen biraz bekleyin.',
              senderId: managerId,
              receiverId: customerId,
              ticketId: ticketId,
              sentAt: '2023-06-14T09:40:00',
              isRead: true
            },
            {
              id: 4,
              content: 'Siparişiniz kargoya verilmiş ve yarın teslim edilecek şekilde planlanmış.',
              senderId: managerId,
              receiverId: customerId,
              ticketId: ticketId,
              sentAt: '2023-06-14T09:45:00',
              isRead: true
            }
          ];
          
          setMessages(demoMessages);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Mesajlar yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [ticketId, customerId, managerId]);

  // WebSocket bağlantısı
  useEffect(() => {
    // Gerçek uygulamada: const socket = new SockJS('http://localhost:8080/ws');
    // const client = new Client({
    //   webSocketFactory: () => socket,
    //   debug: (str) => {
    //     console.log(str);
    //   }
    // });
    
    // client.onConnect = () => {
    //   setConnected(true);
    //   
    //   // Ticket ile ilgili mesajlara abone ol
    //   client.subscribe(`/queue/ticket.${ticketId}`, (message) => {
    //     const receivedMessage = JSON.parse(message.body);
    //     setMessages(prevMessages => [...prevMessages, receivedMessage]);
    //   });
    //   
    //   // Kişisel bildirimler
    //   client.subscribe(`/user/${customerId}/queue/notifications`, (message) => {
    //     const receivedMessage = JSON.parse(message.body);
    //     setMessages(prevMessages => [...prevMessages, receivedMessage]);
    //   });
    // };
    // 
    // client.onDisconnect = () => {
    //   setConnected(false);
    // };
    // 
    // client.activate();
    // setStompClient(client);
    
    // Demo için bağlantı simülasyonu
    setTimeout(() => {
      setConnected(true);
    }, 1500);
    
    // Clean up function
    return () => {
      // if (stompClient) {
      //   stompClient.deactivate();
      // }
    };
  }, [ticketId, customerId]);

  // Mesajları otomatik kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Yeni mesaj gönder
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    setSending(true);
    
    try {
      const message = {
        content: newMessage,
        senderId: customerId,
        receiverId: managerId,
        ticketId: ticketId,
        sentAt: new Date().toISOString(),
        isRead: false
      };
      
      // Gerçek uygulamada:
      // stompClient.publish({
      //   destination: `/app/chat.sendPrivateMessage/${ticketId}`,
      //   body: JSON.stringify(message)
      // });
      
      // API'ye kaydet
      // await api.sendMessage(message);
      
      // Demo için ekleme
      setTimeout(() => {
        // ID ekleyerek
        const newMsg = { ...message, id: messages.length + 1 };
        setMessages([...messages, newMsg]);
        setNewMessage('');
        setSending(false);
        
        // Yanıt simülasyonu
        if (messages.length % 2 === 0) {
          setTimeout(() => {
            const response = {
              id: messages.length + 2,
              content: 'Teşekkür ederim, başka bir sorunuz var mı?',
              senderId: managerId,
              receiverId: customerId,
              ticketId: ticketId,
              sentAt: new Date().toISOString(),
              isRead: true
            };
            setMessages(prev => [...prev, response]);
          }, 3000);
        }
      }, 1000);
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      setSending(false);
    }
  };

  // Enter tuşu ile gönderme
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  
  // Kullanıcının mesajı mı?
  const isMyMessage = (message) => {
    return message.senderId === customerId;
  };
  
  // Mesaj zamanını formatla
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Dosya ekle (demo)
  const handleFileAttach = () => {
    alert('Dosya ekleme özelliği demo sürümde aktif değil.');
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress style={{ color: theme.primary }} />
      </Box>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '600px', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Başlık */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: theme.primary, 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="medium">
          Destek Mesajları
        </Typography>
        <IconButton size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Bağlantı durumu */}
      {!connected && (
        <Box 
          sx={{ 
            p: 0.5, 
            bgcolor: '#ffcc80', 
            textAlign: 'center',
            color: '#e65100'
          }}
        >
          <Typography variant="caption">
            Bağlanıyor... Mesajlarınız geçici olarak kaydedilecek.
          </Typography>
        </Box>
      )}
      
      {/* Mesajlar */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          overflowY: 'auto',
          bgcolor: theme.background,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.map((message) => (
          <Box 
            key={message.id}
            sx={{ 
              alignSelf: isMyMessage(message) ? 'flex-end' : 'flex-start',
              mb: 2,
              maxWidth: '70%'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: isMyMessage(message) ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: isMyMessage(message) ? theme.secondary : theme.primary
                }}
              >
                {isMyMessage(message) ? 'M' : 'D'}
              </Avatar>
              
              <Box>
                <Paper 
                  elevation={1}
                  sx={{ 
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: isMyMessage(message) ? '#e3f2fd' : 'white',
                    border: isMyMessage(message) ? 'none' : '1px solid #e0e0e0'
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Paper>
                
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    mt: 0.5,
                    display: 'block',
                    textAlign: isMyMessage(message) ? 'right' : 'left',
                    mx: 1
                  }}
                >
                  {formatTime(message.sentAt)}
                  {isMyMessage(message) && (
                    <Box component="span" sx={{ ml: 1 }}>
                      {message.isRead ? '✓✓' : '✓'}
                    </Box>
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      <Divider />
      
      {/* Mesaj giriş alanı */}
      <Box sx={{ p: 2, bgcolor: 'white' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'flex-end',
            gap: 1
          }}
        >
          <TextField
            fullWidth
            multiline
            placeholder="Mesajınızı yazın..."
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: theme.primary,
                },
              }
            }}
          />
          
          <IconButton color="default" onClick={handleFileAttach}>
            <AttachFileIcon />
          </IconButton>
          
          <IconButton color="default" onClick={handleFileAttach}>
            <InsertPhotoIcon />
          </IconButton>
          
          <Button
            variant="contained"
            endIcon={sending ? <CircularProgress size={16} style={{ color: 'white' }} /> : <SendIcon />}
            onClick={handleSendMessage}
            disabled={sending || newMessage.trim() === ''}
            sx={{ 
              minWidth: '100px',
              bgcolor: theme.primary,
              '&:hover': {
                bgcolor: theme.secondary
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            Gönder
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CustomerMessaging; 