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
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { chatbotService } from '../../services/api';
import FeedbackForm from '../../components/feedback/FeedbackForm';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Merhaba! Size nasıl yardımcı olabilirim?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [supportRequestId, setSupportRequestId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const messagesEndRef = useRef(null);

  // Mesajlar güncellendiğinde otomatik olarak en alta kaydır
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Backend'e mesajı gönder
      const response = await chatbotService.sendMessage(input, supportRequestId);
      
      // Eğer supportRequestId yoksa ve backend bir tane döndüyse, kaydet
      if (!supportRequestId && response.data.supportRequestId) {
        setSupportRequestId(response.data.supportRequestId);
      }

      // Chatbot yanıtını ekle
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          text: response.data.message, 
          sender: 'bot' 
        }
      ]);

      // Önerilen eylemleri güncelle - gerçek uygulamada backend'den gelebilir
      const defaultActions = ['Ürün İadesi', 'Sipariş Durumu', 'Fatura Bilgisi', 'Müşteri Temsilcisine Bağlan'];
      setSuggestedActions(defaultActions);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.', 
          sender: 'bot' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedAction = (action) => {
    if (action === 'Müşteri Temsilcisine Bağlan') {
      setOpenDialog(true);
    } else {
      setInput(`${action} hakkında bilgi almak istiyorum`);
    }
  };

  const handleRequestRepresentative = async () => {
    setOpenDialog(false);
    setLoading(true);
    
    try {
      // Backend'e temsilci talebi gönder
      await chatbotService.requestRepresentative(supportRequestId);
      
      // Müşteri temsilcisi talebi mesajı ekle
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          text: 'Müşteri temsilcisi talebiniz alındı. En kısa sürede bir temsilcimiz sizinle iletişime geçecek.', 
          sender: 'bot',
          isNotification: true
        }
      ]);
      
      // Kullanıcıyı destek talebi sayfasına yönlendir
      setTimeout(() => {
        navigate(`/customer/requests/${supportRequestId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error requesting representative:', error);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          text: 'Üzgünüm, temsilci talebi gönderilirken bir hata oluştu. Lütfen tekrar deneyin.', 
          sender: 'bot' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleBackToLogin} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Destek Hattı
        </Typography>
        {supportRequestId && (
          <Button 
            variant="outlined" 
            startIcon={<SupportAgentIcon />}
            onClick={() => setOpenDialog(true)}
            size="small"
          >
            Temsilci Talep Et
          </Button>
        )}
      </Paper>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          flexGrow: 1, 
          mb: 2, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          <List>
            {messages.map((message) => (
              <ListItem 
                key={message.id} 
                sx={{ 
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.main' : 
                             message.isNotification ? 'info.light' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary'
                  }}
                >
                  <ListItemText primary={message.text} />
                </Paper>
              </ListItem>
            ))}
            {loading && (
              <ListItem sx={{ justifyContent: 'flex-start', mb: 1 }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2">Yanıt yazılıyor...</Typography>
                  </Box>
                </Paper>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {suggestedActions.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestedActions.map((action, index) => (
              <Chip 
                key={index} 
                label={action} 
                onClick={() => handleSuggestedAction(action)} 
                color="primary" 
                variant="outlined" 
                clickable 
              />
            ))}
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            placeholder="Mesajınızı yazın..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            variant="outlined"
            disabled={loading}
            sx={{ mr: 1 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            endIcon={<SendIcon />}
            disabled={!input.trim() || loading}
          >
            Gönder
          </Button>
        </Box>
      </Paper>

      {supportRequestId && <FeedbackForm supportRequestId={supportRequestId} />}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Müşteri Temsilcisi Talebi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bir müşteri temsilcisiyle görüşmek istediğinizi onaylıyor musunuz? Talebiniz alındıktan sonra en kısa sürede bir temsilcimiz sizinle iletişime geçecektir.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button onClick={handleRequestRepresentative} variant="contained">
            Temsilci Talep Et
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChatbotPage; 