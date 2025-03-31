import React, { useState } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      // Burada chatbot yanıtı simüle ediliyor
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: 'Teşekkürler! En kısa sürede size dönüş yapacağız.',
          sender: 'bot'
        }]);
      }, 1000);
      setNewMessage('');
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={handleOpen}
      >
        <ChatIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Destek Hattı</DialogTitle>
        <DialogContent>
          <Box sx={{ height: '300px', overflowY: 'auto', mb: 2 }}>
            {messages.map((message, index) => (
              <Paper
                key={index}
                sx={{
                  p: 1,
                  mb: 1,
                  backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                  ml: message.sender === 'user' ? 'auto' : 0,
                  mr: message.sender === 'bot' ? 'auto' : 0,
                  maxWidth: '80%',
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            ))}
          </Box>
          <TextField
            fullWidth
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Kapat</Button>
          <Button onClick={handleSend} variant="contained">
            Gönder
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Chatbot; 