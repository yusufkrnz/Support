import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    subject: '',
  });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const fetchSupportRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/api/support-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSupportRequests(response.data);
    } catch (error) {
      console.error('Error fetching support requests:', error);
    }
  };

  const handleCreateRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8082/api/support-requests',
        newRequest,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenDialog(false);
      setNewRequest({ title: '', description: '', subject: '' });
      fetchSupportRequests();
    } catch (error) {
      console.error('Error creating support request:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewRequest({
      ...newRequest,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Hoş geldiniz, {user.fullName}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
            >
              Yeni Destek Talebi
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Destek Talepleriniz
            </Typography>
            <List>
              {supportRequests.map((request) => (
                <ListItem
                  key={request.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={request.title}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          Konu: {request.subject}
                        </Typography>
                        <br />
                        {request.description}
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Durum: {request.status}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Yeni Destek Talebi Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Başlık"
            type="text"
            fullWidth
            value={newRequest.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="subject"
            label="Konu"
            type="text"
            fullWidth
            value={newRequest.subject}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Açıklama"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newRequest.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button onClick={handleCreateRequest} variant="contained">
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 