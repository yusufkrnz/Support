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
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { chatbotService } from '../../services/api';

const COMPLAINT_UNITS = [
  { value: 'cashier', label: 'Kasiyer' },
  { value: 'service', label: 'Müşteri Hizmetleri' },
  { value: 'product', label: 'Ürün Kalitesi' },
  { value: 'delivery', label: 'Teslimat' },
  { value: 'app', label: 'Mobil Uygulama/Web Sitesi' },
  { value: 'store', label: 'Mağaza Ortamı' },
  { value: 'other', label: 'Diğer' }
];

const ComplaintPanel = ({ theme, companyName, onClose, userData, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiTags, setAiTags] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Form verilerini hazırla
      const complaintData = {
        userId: userData?.id,
        title,
        unit,
        description,
        companyName
      };
      
      if (onSubmit) {
        // BaseChatbot aracılığıyla işleme
        await onSubmit(complaintData);
        handleReset();
        onClose();
      } else {
        // Direk API çağrısı
        const response = await chatbotService.processComplaint(complaintData);
        
        // Formatlanmış tag'leri oluştur
        const formattedTags = [];
        
        if (response.aiTags) {
          response.aiTags.forEach(tag => {
            let color = 'default';
            
            if (tag.includes('Acil')) {
              color = 'error';
            } else if (tag.includes('Detaylı')) {
              color = 'success';
            } else if (tag.includes('Memnuniyet')) {
              color = 'warning';
            }
            
            formattedTags.push({ label: tag, color });
          });
        }
        
        // Önceliğe göre etiket ekle
        if (response.aiPriority) {
          const priorityLabel = response.aiPriority === 3 ? 
            'Yüksek Öncelik' : 
            response.aiPriority === 2 ? 
              'Orta Öncelik' : 
              'Düşük Öncelik';
              
          const priorityColor = response.aiPriority === 3 ? 
            'error' : 
            response.aiPriority === 2 ? 
              'info' : 
              'success';
              
          formattedTags.push({ label: priorityLabel, color: priorityColor });
        }
        
        // AI sonucunu ayarla
        setAiResult({
          accepted: true,
          trackingId: response.trackingId,
          estimatedResponseTime: response.estimatedResponseHours,
          message: response.message || 'Şikayet talebiniz başarıyla alındı.'
        });
        
        setAiTags(formattedTags);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setError('Şikayet gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setUnit('');
    setDescription('');
    setAiResult(null);
    setAiTags([]);
    setError(null);
  };
  
  const handleTrackComplaint = async (trackingId) => {
    try {
      // Burada takip ekranına yönlendirilebilir
      window.open(`/complaints/track/${trackingId}`, '_blank');
    } catch (error) {
      console.error('Error redirecting to complaint tracking:', error);
      setError('Şikayet takibi yapılırken bir hata oluştu.');
    }
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
          Şikayet Bildirimi
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
            severity={aiResult.accepted ? "success" : "error"} 
            sx={{ mb: 3, fontSize: '1rem' }}
            icon={aiResult.accepted ? <CheckCircleIcon fontSize="inherit" /> : undefined}
          >
            {aiResult.message}
          </Alert>
          
          {aiResult.accepted && (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Takip Numaranız: <strong>{aiResult.trackingId}</strong>
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4 }}>
                Tahmini yanıt süresi: <strong>{aiResult.estimatedResponseTime} saat</strong>
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  AI Analiz Sonucu:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  {aiTags.map((tag, index) => (
                    <Chip 
                      key={index}
                      label={tag.label}
                      color={tag.color}
                      variant="outlined"
                      size="medium"
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => handleTrackComplaint(aiResult.trackingId)}
                  sx={{ mr: 2 }}
                >
                  Takip Et
                </Button>
                
                <Button 
                  variant="contained"
                  onClick={handleReset}
                  sx={{ backgroundColor: theme.primary }}
                >
                  Yeni Şikayet
                </Button>
              </Box>
            </>
          )}
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
          <TextField
            label="Şikayet Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            placeholder="Şikayetinizi kısaca özetleyen bir başlık..."
          />
          
          <FormControl fullWidth required>
            <InputLabel id="complaint-unit-label">İlgili Birim</InputLabel>
            <Select
              labelId="complaint-unit-label"
              value={unit}
              label="İlgili Birim"
              onChange={(e) => setUnit(e.target.value)}
            >
              {COMPLAINT_UNITS.map((unitItem) => (
                <MenuItem key={unitItem.value} value={unitItem.value}>
                  {unitItem.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Şikayet Detayı"
            multiline
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            placeholder="Lütfen yaşadığınız sorunu detaylı bir şekilde anlatın..."
            sx={{ flexGrow: 1 }}
          />
          
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !title || !unit || !description}
              sx={{ 
                py: 1.5,
                backgroundColor: theme.primary,
                '&:hover': {
                  backgroundColor: theme.secondary,
                }
              }}
              startIcon={loading ? null : <FeedbackIcon />}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Şikayeti Gönder'
              )}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ComplaintPanel; 