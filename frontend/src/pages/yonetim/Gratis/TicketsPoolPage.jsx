import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useAuth } from '../../../hooks/useAuth';
import { supportTicketService } from '../../../services/api';

// Gratis'e özel renk teması
const gratisTheme = {
  primary: '#E6007E', // Gratis pembe rengi
  secondary: '#10069F', // Koyu mavi vurgu rengi
  background: '#F9F0F5'
};

const GratisTicketsPoolPage = () => {
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);
  
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await supportTicketService.getTicketsPool('Gratis');
      setTickets(response);
      setLoading(false);
    } catch (error) {
      console.error('Talep havuzu yüklenirken hata oluştu:', error);
      setAlert({
        open: true,
        message: 'Talep havuzu yüklenirken bir sorun oluştu',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const fetchTicketMessages = async (ticketId) => {
    setLoadingMessages(true);
    try {
      const response = await supportTicketService.getTicketMessages(ticketId);
      setMessages(response);
      setLoadingMessages(false);
    } catch (error) {
      console.error('Talep mesajları yüklenirken hata oluştu:', error);
      setAlert({
        open: true,
        message: 'Talep mesajları yüklenirken bir sorun oluştu',
        severity: 'error'
      });
      setLoadingMessages(false);
    }
  };
  
  // Sayfayı değiştir
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Sayfa başına gösterilen satır sayısını değiştir
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Talebi görüntüle
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
    fetchTicketMessages(ticket.id);
  };
  
  // Talebi üstlen
  const handleTakeTicket = async (ticket) => {
    try {
      setLoading(true);
      
      await supportTicketService.assignTicket(ticket.id, user.id);
      
      setAlert({
        open: true,
        message: `${ticket.ticketNumber} numaralı talep başarıyla üstlenildi!`,
        severity: 'success'
      });
      
      // Dialog'u kapat
      if (selectedTicket && selectedTicket.id === ticket.id) {
        setOpenDialog(false);
      }
      
      // Talep listesini güncelle
      fetchTickets();
      
    } catch (error) {
      console.error('Talep üstlenirken hata:', error);
      setAlert({
        open: true,
        message: 'Talep üstlenirken bir sorun oluştu. Lütfen tekrar deneyin.',
        severity: 'error'
      });
      setLoading(false);
    }
  };
  
  // Dialog'u kapat
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
    setMessages([]);
  };
  
  // Alert'i kapat
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  
  // Arama sorgusu değiştiğinde filtreleme yap
  const filteredTickets = tickets.filter(ticket => 
    ticket.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.customer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Önceliğe göre renk belirleme
  const getPriorityColor = (priority) => {
    if (!priority) return 'default';
    
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Enum değerlerini Türkçe'ye çevir
  const translatePriority = (priority) => {
    if (!priority) return '';
    
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return 'ACİL';
      case 'HIGH':
        return 'YÜKSEK';
      case 'MEDIUM':
        return 'NORMAL';
      case 'LOW':
        return 'DÜŞÜK';
      default:
        return priority;
    }
  };
  
  // Enum değerlerini Türkçe'ye çevir
  const translateStatus = (status) => {
    if (!status) return '';
    
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'AÇIK';
      case 'IN_PROGRESS':
        return 'İŞLEMDE';
      case 'WAITING':
        return 'BEKLİYOR';
      case 'RESOLVED':
        return 'ÇÖZÜLDÜ';
      case 'CLOSED':
        return 'KAPANDI';
      default:
        return status;
    }
  };
  
  // Tarihi formatla
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Talep Detay Dialogu içeriğini göster
  const renderTicketDetails = () => {
    if (!selectedTicket) return null;
    
    return (
      <>
        <DialogTitle sx={{ 
          backgroundColor: gratisTheme.primary, 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6">
            Talep Detayı: {selectedTicket.ticketNumber}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, minWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            {selectedTicket.subject}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip 
              label={`Öncelik: ${translatePriority(selectedTicket.priority)}`} 
              color={getPriorityColor(selectedTicket.priority)} 
              icon={<PriorityHighIcon />}
              variant="outlined" 
            />
            <Chip 
              label={`Kategori: ${selectedTicket.category}`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={`Durum: ${translateStatus(selectedTicket.status)}`} 
              color="default" 
              variant="outlined" 
            />
          </Box>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Açıklama:</strong> {selectedTicket.description}
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            <strong>Müşteri:</strong> {selectedTicket.customer?.fullName}
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            <strong>Oluşturulma:</strong> {formatDate(selectedTicket.createdAt)}
          </Typography>
          
          <Typography variant="body2" gutterBottom sx={{ mb: 3 }}>
            <strong>Son Güncelleme:</strong> {formatDate(selectedTicket.lastUpdated)}
          </Typography>
          
          {/* Mesajlar Bölümü */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
            Mesajlar
          </Typography>
          
          {loadingMessages ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : messages.length > 0 ? (
            <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
              {messages.map((message, index) => (
                <Paper 
                  key={index} 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    backgroundColor: message.sender?.id === user.id ? '#E3F2FD' : '#FFFFFF'
                  }}
                >
                  <Typography variant="subtitle2">
                    {message.sender?.fullName || 'Anonim'} - {formatDate(message.sentAt)}
                  </Typography>
                  <Typography variant="body2">
                    {message.content}
                  </Typography>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Bu talep için henüz mesaj bulunmuyor.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Kapat</Button>
          <Button 
            variant="contained" 
            startIcon={<AssignmentTurnedInIcon />}
            onClick={() => handleTakeTicket(selectedTicket)}
            sx={{ bgcolor: gratisTheme.primary }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Talebi Üstlen'}
          </Button>
        </DialogActions>
      </>
    );
  };

  // Tabloda sütunları göster
  const renderTableContent = () => {
    return (
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 250px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Talep No</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell>Konu</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Öncelik</TableCell>
              <TableCell>Oluşturulma</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredTickets
            ).map((ticket) => (
              <TableRow key={ticket.id} hover>
                <TableCell>{ticket.ticketNumber}</TableCell>
                <TableCell>{ticket.customer?.fullName}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.category} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={translatePriority(ticket.priority)} 
                    size="small" 
                    color={getPriorityColor(ticket.priority)} 
                    icon={<PriorityHighIcon />}
                  />
                </TableCell>
                <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                <TableCell>
                  <Tooltip title="Görüntüle">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Üstlen">
                    <IconButton 
                      size="small" 
                      onClick={() => handleTakeTicket(ticket)}
                      sx={{ color: gratisTheme.primary }}
                    >
                      <AssignmentTurnedInIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filteredTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {searchQuery ? 'Arama kriterlerine uygun talep bulunamadı.' : 'Havuzda bekleyen talep bulunmuyor.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  if (loading && tickets.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress style={{ color: gratisTheme.primary }} />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, bgcolor: gratisTheme.background, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: gratisTheme.primary, fontWeight: 'bold' }}>
        Gratis İstek Havuzu
      </Typography>
      
      <Typography variant="body1" paragraph>
        Bu sayfada henüz bir temsilciye atanmamış açık destek taleplerini görebilir ve üstlenebilirsiniz.
      </Typography>
      
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Ara..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              width: '300px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(230, 0, 126, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: gratisTheme.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: gratisTheme.primary,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: gratisTheme.primary }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button 
            variant="outlined" 
            onClick={fetchTickets}
            sx={{ 
              color: gratisTheme.primary, 
              borderColor: gratisTheme.primary,
              '&:hover': {
                borderColor: gratisTheme.primary,
                bgcolor: 'rgba(230, 0, 126, 0.08)'
              }
            }}
          >
            Yenile
          </Button>
        </Box>
        
        {renderTableContent()}
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Paper>
      
      {/* Talep Detay Dialog */}
      {selectedTicket && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          {renderTicketDetails()}
        </Dialog>
      )}
      
      {/* Bildirim Alert'i */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={5000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GratisTicketsPoolPage; 