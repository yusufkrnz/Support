import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Alert,
  CircularProgress,
  IconButton,
  Stack
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { chatbotService } from '../../services/api';

const RETURN_REASONS = [
  { value: 'damaged', label: 'Ürün Hasarlı/Kırık' },
  { value: 'wrong_item', label: 'Yanlış Ürün Gönderildi' },
  { value: 'defective', label: 'Ürün Bozuk/Çalışmıyor' },
  { value: 'size_issue', label: 'Beden/Boyut Uyumsuz' },
  { value: 'not_as_described', label: 'Ürün Tanımlandığı Gibi Değil' },
  { value: 'changed_mind', label: 'Fikrim Değişti' },
  { value: 'other', label: 'Diğer' }
];

const ReturnPanel = ({ theme, companyName, onClose, userData, onSubmit }) => {
  const [returnReason, setReturnReason] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showDisagree, setShowDisagree] = useState(false);
  const [error, setError] = useState(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Base64 formatında fotoğraf
      const imageBase64 = photoPreview.split(',')[1];
      
      // Form verilerini hazırla
      const returnData = {
        userId: userData?.id,
        returnReason: returnReason,
        explanation: description,
        imageBase64: imageBase64
      };
      
      if (onSubmit) {
        // BaseChatbot aracılığıyla işleme
        await onSubmit(returnData);
        handleReset();
        onClose();
      } else {
        // Direk API çağrısı
        const response = await chatbotService.processReturn(returnData);
        
        // Yanıttan AI sonucunu al
        const aiResult = {
          valid: response.isValid,
          confidence: response.score,
          returnId: response.returnId,
          message: response.message || (response.isValid ? 
            'İade talebiniz onaylandı!' : 
            'İade talebiniz değerlendirildi.')
        };
        
        setAiResult(aiResult);
        setShowDisagree(!aiResult.valid); // Sadece red durumunda "karar bence yanlış" butonunu göster
      }
    } catch (error) {
      console.error('Error submitting return request:', error);
      setError('İade talebi gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisagree = async () => {
    setLoading(true);
    
    try {
      if (aiResult?.returnId) {
        // AI kararına itiraz et - API çağrısını burada yapabiliriz
        setAiResult({
          ...aiResult,
          message: 'Talebiniz manuel incelemeye alınmıştır. Teşekkür ederiz.',
          manualReview: true
        });
        setShowDisagree(false);
      }
    } catch (error) {
      console.error('Error overriding AI decision:', error);
      setError('Karar değişikliği yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReturnReason('');
    setDescription('');
    setPhoto(null);
    setPhotoPreview('');
    setAiResult(null);
    setShowDisagree(false);
    setError(null);
  };

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        p: 3, 
        borderRadius: 3, 
        maxWidth: 500,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: theme.primary }}>
          İade Talebi
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          size="small"
          onClick={onClose}
        >
          Kapat
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {aiResult ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Alert 
            severity={aiResult.valid ? "success" : "warning"} 
            sx={{ mb: 3, fontSize: '1rem' }}
          >
            {aiResult.message}
          </Alert>
          
          {aiResult.valid ? (
            <Typography variant="h6" sx={{ mb: 2 }}>
              İade talebiniz onaylandı!
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ mb: 2 }}>
              İade talebiniz reddedildi.
            </Typography>
          )}
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            AI Güven Puanı: {aiResult.confidence}/100
          </Typography>
          
          {showDisagree && (
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<ThumbDownIcon />}
              onClick={handleDisagree}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              Karar Bence Yanlış
            </Button>
          )}
          
          <Button 
            variant="contained"
            onClick={handleReset}
            sx={{ backgroundColor: theme.primary }}
          >
            Yeni Talep
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth required>
            <InputLabel id="return-reason-label">İade Nedeni</InputLabel>
            <Select
              labelId="return-reason-label"
              value={returnReason}
              label="İade Nedeni"
              onChange={(e) => setReturnReason(e.target.value)}
            >
              {RETURN_REASONS.map((reason) => (
                <MenuItem key={reason.value} value={reason.value}>
                  {reason.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Açıklama"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Lütfen iade nedeninizi detaylı olarak açıklayın..."
          />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Ürün Fotoğrafı
            </Typography>
            
            <input
              accept="image/*"
              type="file"
              id="photo-upload"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            
            {!photoPreview ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <label htmlFor="photo-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                    sx={{ backgroundColor: theme.primary }}
                  >
                    Fotoğraf Yükle
                  </Button>
                </label>
                <Typography variant="caption" color="text.secondary">
                  (İade talebinizi değerlendirmemiz için ürünün fotoğrafı gereklidir)
                </Typography>
              </Stack>
            ) : (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <img 
                  src={photoPreview} 
                  alt="Ürün Fotoğrafı" 
                  style={{ 
                    width: '100%', 
                    maxHeight: 200, 
                    objectFit: 'contain',
                    border: '1px solid #eee',
                    borderRadius: 8
                  }} 
                />
                <IconButton
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                  }}
                  onClick={() => setPhotoPreview('')}
                >
                  &times;
                </IconButton>
              </Box>
            )}
          </Box>
          
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !returnReason || !description || !photoPreview}
              sx={{ 
                py: 1.5,
                backgroundColor: theme.primary,
                '&:hover': {
                  backgroundColor: theme.secondary,
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'İade Talebini Gönder'
              )}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ReturnPanel; 