import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Slider, 
  Snackbar,
  Alert
} from '@mui/material';
import { feedbackService } from '../../services/api';

const FeedbackForm = ({ supportRequestId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Gerçek uygulamada backend'e istek gönderilecek
      // await feedbackService.submitFeedback(supportRequestId, rating, comment);
      
      // Mock başarılı yanıt
      setSuccess(true);
      setComment('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Geri bildirim gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Deneyiminizi Değerlendirin
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Memnuniyet Dereceniz
          </Typography>
          <Slider
            value={rating}
            onChange={handleRatingChange}
            step={1}
            marks
            min={1}
            max={5}
            valueLabelDisplay="on"
          />
        </Box>
        
        <TextField
          fullWidth
          label="Yorumunuz (İsteğe Bağlı)"
          multiline
          rows={4}
          value={comment}
          onChange={handleCommentChange}
          sx={{ mb: 3 }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          fullWidth
        >
          {loading ? 'Gönderiliyor...' : 'Gönder'}
        </Button>
      </Box>
      
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Geri bildiriminiz için teşekkür ederiz!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default FeedbackForm;