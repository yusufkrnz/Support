import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Chip,
  Avatar,
  Zoom,
  Fade,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from 'framer-motion';
import { chatbotService } from '../../services/api';

// Styled Components
const ChatContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 100px)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: '#f8f9fa',
  position: 'relative',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px'
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#666'
    }
  }
}));

const MessageBubble = styled(motion.div)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
  backgroundColor: isUser ? theme.palette.primary.main : 'white',
  color: isUser ? 'white' : theme.palette.text.primary,
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    transition: 'transform 0.2s ease-in-out'
  }
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'white',
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(2),
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    backgroundColor: '#f8f9fa',
    '&.Mui-focused': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px'
      }
    }
  }
}));

const SendButton = styled(Button)(({ theme }) => ({
  borderRadius: '50%',
  minWidth: '50px',
  width: '50px',
  height: '50px',
  padding: 0,
  background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #43A047 0%, #1B5E20 100%)'
  },
  '& .MuiButton-startIcon': {
    margin: 0
  }
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '3px',
  padding: theme.spacing(1),
  '& .dot': {
    width: '8px',
    height: '8px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out both',
    '&:nth-of-type(1)': {
      animationDelay: '-0.32s'
    },
    '&:nth-of-type(2)': {
      animationDelay: '-0.16s'
    }
  },
  '@keyframes bounce': {
    '0%, 80%, 100%': {
      transform: 'scale(0)'
    },
    '40%': {
      transform: 'scale(1)'
    }
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    padding: theme.spacing(2)
  }
}));

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: '👋 Merhaba! Ben destek asistanınız. Size nasıl yardımcı olabilirim?\n\nÖrnek konular:\n• 📦 İade işlemleri\n• 🚚 Kargo takibi\n• 💳 Ödeme sorunları\n• ❓ Genel sorular', 
      sender: 'bot', 
      timestamp: new Date() 
    }
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
  const theme = useTheme();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { 
      id: messages.length + 1, 
      text: input, 
      sender: 'user', 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const response = await chatbotService.sendMessage(input);
        const botResponse = { 
          id: messages.length + 2, 
          text: response.data.message, 
          sender: 'bot', 
          timestamp: new Date(),
          createTicket: response.data.createTicket || false
        };
        setMessages(prev => [...prev, botResponse]);
        
        if (response.data.createTicket) {
          setShowNewTicketForm(true);
          setTicketSubject(response.data.suggestedSubject || '');
          setTicketDescription(input);
        }
      } catch (apiError) {
        console.error('API error, using mock data:', apiError);
        const lowerInput = input.toLowerCase();
        let botResponse;
        
        if (lowerInput.includes('iade') || lowerInput.includes('geri')) {
          botResponse = { 
            id: messages.length + 2, 
            text: `📦 İade işlemleri için yardımcı olabilirim!

1️⃣ Ürünü satın aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz
2️⃣ Ürün kutusu ve faturası ile birlikte mağazamıza getirebilirsiniz
3️⃣ İade işleminiz onaylandıktan sonra ödemeniz 3 iş günü içinde iade edilir

✨ Size daha detaylı yardımcı olabilmem için bir destek talebi oluşturmak ister misiniz?`, 
            sender: 'bot', 
            timestamp: new Date(),
            createTicket: true
          };
        } else if (lowerInput.includes('kargo') || lowerInput.includes('teslimat')) {
          botResponse = { 
            id: messages.length + 2, 
            text: `🚚 Kargo takibi için yardımcı olabilirim!

📝 Sipariş numaranızı paylaşabilir misiniz?
🕒 Alternatif olarak, size özel takip için bir müşteri temsilcimize bağlanabiliriz

✨ Detaylı bilgi için bir destek talebi oluşturalım mı?`, 
            sender: 'bot', 
            timestamp: new Date(),
            createTicket: true
          };
        } else {
          botResponse = { 
            id: messages.length + 2, 
            text: `🤝 Size nasıl yardımcı olabilirim?

💡 Aşağıdaki konularda destek verebilirim:
• 📦 İade işlemleri
• 🚚 Kargo takibi
• 💳 Ödeme işlemleri
• ❓ Diğer sorularınız

✨ Detaylı bilgi için bir müşteri temsilcimize bağlanmak ister misiniz?`, 
            sender: 'bot', 
            timestamp: new Date(),
            createTicket: true
          };
        }
        
        setMessages(prev => [...prev, botResponse]);
        setShowNewTicketForm(true);
        setTicketSubject('Genel Destek Talebi');
        setTicketDescription(input);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2, height: '100vh' }}>
      <ChatContainer elevation={3}>
        <Header>
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/customer')}
            sx={{ 
              padding: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <SmartToyIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Destek Asistanı
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              🟢 7/24 hizmetinizdeyiz
            </Typography>
          </Box>
        </Header>

        <MessageContainer>
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                isUser={message.sender === 'user'}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  whiteSpace: 'pre-line'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: message.sender === 'user' ? 'secondary.main' : 'primary.main',
                      animation: message.sender === 'bot' ? 'pulse 2s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': {
                          boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)'
                        },
                        '70%': {
                          boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)'
                        },
                        '100%': {
                          boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
                        }
                      }
                    }}
                  >
                    {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                  </Avatar>
                  <Typography variant="caption" color="inherit" sx={{ fontWeight: 500 }}>
                    {message.sender === 'user' ? 'Siz' : 'Bot'}
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.6,
                    '& em': { 
                      fontStyle: 'normal',
                      color: theme.palette.primary.main,
                      fontWeight: 500
                    }
                  }}
                >
                  {message.text}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    textAlign: message.sender === 'user' ? 'right' : 'left',
                    mt: 0.5,
                    opacity: 0.8
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </MessageBubble>
            ))}
          </AnimatePresence>
          
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  bgcolor: 'primary.main',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)'
                    },
                    '70%': {
                      boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)'
                    },
                    '100%': {
                      boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
                    }
                  }
                }}
              >
                <SmartToyIcon />
              </Avatar>
              <TypingIndicator>
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </TypingIndicator>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </MessageContainer>

        <InputContainer component="form" onSubmit={handleSendMessage}>
          <StyledTextField
            fullWidth
            placeholder="Mesajınızı yazın..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            variant="outlined"
            size="small"
            InputProps={{
              sx: {
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }
            }}
          />
          <SendButton
            variant="contained"
            disabled={!input.trim() || loading}
            type="submit"
          >
            <SendIcon />
          </SendButton>
        </InputContainer>
      </ChatContainer>

      <StyledDialog 
        open={showNewTicketForm} 
        onClose={() => setShowNewTicketForm(false)}
        TransitionComponent={Zoom}
        maxWidth="sm"
        fullWidth
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
      </StyledDialog>
    </Container>
  );
};

export default ChatbotPage;