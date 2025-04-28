import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Chip,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Chatbot = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useImperativeHandle(ref, () => ({
    setOpen: (value) => setOpen(value)
  }));

  const handleOptionSelect = async (option) => {
    const userMessage = { 
      id: messages.length + 1, 
      text: option, 
      sender: 'user', 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let botResponse = {
        id: messages.length + 2,
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        options: []
      };
      
      // Ana Menü
      if (option === 'Ana Menüye Dön') {
        botResponse.text = `👋 Merhaba! Size nasıl yardımcı olabilirim?`;
        botResponse.options = ['Siparişim Nerede?', 'İade Yapmak İstiyorum', 'Ödeme Yapamıyorum', 'Hesabımı Yönetmek İstiyorum'];
      }
      // Siparişim Nerede?
      else if (option === 'Siparişim Nerede?') {
        botResponse.text = `📦 Siparişinizi takip etmek için sipariş numaranızı kullanabilirsiniz.`;
        botResponse.options = ['Sipariş Numaramı Biliyorum', 'Sipariş Numaramı Bilmiyorum', 'Destek Talebi Oluştur', 'Ana Menüye Dön'];
      }
      // İade Yapmak İstiyorum
      else if (option === 'İade Yapmak İstiyorum') {
        botResponse.text = `🔄 İade işlemi için sipariş numaranızı kullanabilirsiniz.`;
        botResponse.options = ['Sipariş Numaramı Biliyorum', 'Sipariş Numaramı Bilmiyorum', 'İade Koşullarını Öğrenmek İstiyorum', 'Destek Talebi Oluştur', 'Ana Menüye Dön'];
      }
      // Ödeme Yapamıyorum
      else if (option === 'Ödeme Yapamıyorum') {
        botResponse.text = `💳 Ödeme sorununuz için size yardımcı olabilirim.`;
        botResponse.options = ['Kart Bilgilerim Doğru', 'Kart Bilgilerim Yanlış', 'Farklı Ödeme Yöntemi Kullanmak İstiyorum', 'Destek Talebi Oluştur', 'Ana Menüye Dön'];
      }
      // Hesabımı Yönetmek İstiyorum
      else if (option === 'Hesabımı Yönetmek İstiyorum') {
        botResponse.text = `👤 Hesap işlemleriniz için size yardımcı olabilirim.`;
        botResponse.options = ['Şifremi Değiştirmek İstiyorum', 'Adresimi Güncellemek İstiyorum', 'Profil Bilgilerimi Düzenlemek İstiyorum', 'Destek Talebi Oluştur', 'Ana Menüye Dön'];
      }
      // Destek Talebi Oluştur
      else if (option === 'Destek Talebi Oluştur') {
        botResponse.text = `📝 Destek talebi oluşturmak için aşağıdaki bilgileri doldurmanız gerekiyor.`;
        botResponse.options = ['Ana Menüye Dön'];
        setShowNewTicketForm(true);
      }
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // İlk mesajı göster
  React.useEffect(() => {
    if (open && messages.length === 0) {
      const initialMessage = {
        id: 1,
        text: `👋 Merhaba! Size nasıl yardımcı olabilirim?`,
        sender: 'bot',
        timestamp: new Date(),
        options: ['Siparişim Nerede?', 'İade Yapmak İstiyorum', 'Ödeme Yapamıyorum', 'Hesabımı Yönetmek İstiyorum']
      };
      setMessages([initialMessage]);
    }
  }, [open]);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 400,
            maxWidth: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: '#4CAF50',
                    border: '2px solid white',
                  }}
                />
              }
            >
              <Avatar sx={{ bgcolor: '#2196F3' }}>
                <SmartToyIcon />
              </Avatar>
            </Badge>
            <Typography variant="h6">Destek Asistanı</Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          background: 'rgba(255, 255, 255, 0.7)',
        }}>
          <List>
            {messages && messages.map((message, index) => (
              <ListItem key={index} sx={{ 
                justifyContent: message?.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  gap: 1,
                  flexDirection: message?.sender === 'user' ? 'row-reverse' : 'row',
                }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: message?.sender === 'user' ? '#2196F3' : '#4CAF50',
                    }}
                  >
                    {message?.sender === 'user' ? <SupportAgentIcon /> : <SmartToyIcon />}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message?.sender === 'user' ? 'primary.main' : 'white',
                      color: message?.sender === 'user' ? 'white' : 'text.primary',
                      borderRadius: message?.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                    }}
                  >
                    <ListItemText primary={message?.text || ''} />
                    {message?.options && message.options.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {message.options.map((option, optionIndex) => (
                          <Chip
                            key={optionIndex}
                            label={option}
                            onClick={() => handleOptionSelect(option)}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Paper>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Dialog
        open={showNewTicketForm}
        onClose={() => setShowNewTicketForm(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupportAgentIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Destek Talebi Oluştur
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Size daha iyi yardımcı olabilmemiz için bir destek talebi oluşturalım.
          </DialogContentText>
          <TextField
            fullWidth
            label="Konu"
            value={ticketSubject}
            onChange={(e) => setTicketSubject(e.target.value)}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Açıklama"
            value={ticketDescription}
            onChange={(e) => setTicketDescription(e.target.value)}
            multiline
            rows={4}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowNewTicketForm(false)}
            variant="outlined"
            color="inherit"
          >
            İptal
          </Button>
          <Button
            onClick={() => {
              setShowNewTicketForm(false);
              navigate('/customer/requests');
            }}
            variant="contained"
            color="primary"
            disabled={submittingTicket}
            startIcon={submittingTicket ? <CircularProgress size={20} /> : null}
          >
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Chatbot; 