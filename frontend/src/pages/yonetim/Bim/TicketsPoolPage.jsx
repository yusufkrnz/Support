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
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../../../hooks/useAuth';

// BİM'e özel renk teması
const bimTheme = {
  primary: '#ED1C24', // BİM kırmızı rengi
  secondary: '#003368', // BİM lacivert rengi
  background: '#F5F5F5'
};

const BimTicketsPoolPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // Gerçek uygulamada API'den veri çekilecek
        // const response = await api.getTicketsPool('bim');
        // setTickets(response.data);
        
        // Simüle edilmiş veri
        setTimeout(() => {
          const mockTickets = [
            { 
              id: 'BIM-1001', 
              customer: 'Hasan Yılmaz', 
              subject: 'Markette belirtilen fiyat ile kasada ödediğim fiyat farklı',
              category: 'Fiyatlandırma',
              priority: 'Yüksek',
              status: 'Açık',
              createdAt: '2023-06-15T08:23:11',
              lastUpdated: '2023-06-15T08:23:11'
            },
            { 
              id: 'BIM-1002', 
              customer: 'Fatma Şahin', 
              subject: 'Satın aldığım ürün son kullanma tarihi geçmiş',
              category: 'Ürün Kalitesi',
              priority: 'Acil',
              status: 'Açık',
              createdAt: '2023-06-15T09:45:22',
              lastUpdated: '2023-06-15T09:45:22'
            },
            { 
              id: 'BIM-1003', 
              customer: 'Ahmet Kaya', 
              subject: 'İnternette gördüğüm ürün markette bulunamıyor',
              category: 'Stok Bilgisi',
              priority: 'Normal',
              status: 'Açık',
              createdAt: '2023-06-14T14:12:05',
              lastUpdated: '2023-06-14T16:33:41'
            },
            { 
              id: 'BIM-1004', 
              customer: 'Zeynep Demir', 
              subject: 'Ürün iadesinde sorun yaşıyorum',
              category: 'İade',
              priority: 'Yüksek',
              status: 'Açık',
              createdAt: '2023-06-14T11:08:37',
              lastUpdated: '2023-06-14T11:08:37'
            },
            { 
              id: 'BIM-1005', 
              customer: 'Mustafa Aydın', 
              subject: 'Kasiyerden kötü hizmet aldım',
              category: 'Mağaza Hizmeti',
              priority: 'Normal',
              status: 'Açık',
              createdAt: '2023-06-13T16:42:19',
              lastUpdated: '2023-06-13T16:42:19'
            },
            { 
              id: 'BIM-1006', 
              customer: 'Ayşe Çelik', 
              subject: 'İnternet sitesindeki adresler hatalı',
              category: 'Web Sitesi',
              priority: 'Düşük',
              status: 'Açık',
              createdAt: '2023-06-13T09:15:54',
              lastUpdated: '2023-06-13T13:27:30'
            },
            { 
              id: 'BIM-1007', 
              customer: 'Mehmet Yıldız', 
              subject: 'Markette belirtilen kampanya uygulanmadı',
              category: 'Kampanya',
              priority: 'Yüksek',
              status: 'Açık',
              createdAt: '2023-06-12T15:33:22',
              lastUpdated: '2023-06-12T15:33:22'
            },
            { 
              id: 'BIM-1008', 
              customer: 'Selin Özdemir', 
              subject: 'Aldığım ürünün içindekiler bilgisi yok',
              category: 'Ürün Bilgisi',
              priority: 'Normal',
              status: 'Açık',
              createdAt: '2023-06-12T10:18:45',
              lastUpdated: '2023-06-12T10:18:45'
            },
          ];
          
          setTickets(mockTickets);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Hata:', error);
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, []);
  
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
  };
  
  // Talebi üstlen
  const handleTakeTicket = async (ticket) => {
    try {
      setLoading(true);
      
      // Gerçek uygulamada API çağrısı yapılacak
      // await api.takeTicket(ticket.id, user.id);
      
      // Simüle edilmiş başarılı cevap
      setTimeout(() => {
        // Mevcut ticket'ı listeden kaldır
        setTickets(tickets.filter(t => t.id !== ticket.id));
        
        // Dialog'u kapat
        if (selectedTicket && selectedTicket.id === ticket.id) {
          setOpenDialog(false);
        }
        
        setLoading(false);
        alert(`${ticket.id} numaralı talep başarıyla üstlenildi!`);
      }, 800);
    } catch (error) {
      console.error('Hata:', error);
      setLoading(false);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };
  
  // Dialog'u kapat
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Arama sorgusu değiştiğinde filtreleme yap
  const filteredTickets = tickets.filter(ticket => 
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Önceliğe göre renk belirleme
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Acil':
        return '#f44336'; // Kırmızı
      case 'Yüksek':
        return '#ff9800'; // Turuncu
      case 'Normal':
        return '#2196f3'; // Mavi
      case 'Düşük':
        return '#4caf50'; // Yeşil
      default:
        return '#757575'; // Gri
    }
  };
  
  // Tarihi formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading && tickets.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress style={{ color: bimTheme.primary }} />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, bgcolor: bimTheme.background, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: bimTheme.primary, fontWeight: 'bold' }}>
        BİM İstek Havuzu
      </Typography>
      
      <Typography variant="body1" paragraph>
        Bu sayfada henüz bir temsilciye atanmamış açık destek taleplerini görebilir ve üstlenebilirsiniz.
      </Typography>
      
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: '8px' }}>
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
                  borderColor: 'rgba(237, 28, 36, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: bimTheme.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: bimTheme.primary,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: bimTheme.primary }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            sx={{ 
              color: bimTheme.primary, 
              borderColor: bimTheme.primary,
              '&:hover': {
                borderColor: bimTheme.primary,
                bgcolor: 'rgba(237, 28, 36, 0.08)'
              }
            }}
          >
            Filtrele
          </Button>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tickets table">
            <TableHead>
              <TableRow sx={{ bgcolor: bimTheme.secondary, color: 'white' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Talep No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Müşteri</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Konu</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Kategori</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Öncelik</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Oluşturulma</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ticket) => (
                  <TableRow 
                    key={ticket.id} 
                    hover
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'rgba(237, 28, 36, 0.04)'
                      }
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {ticket.id}
                    </TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ticket.subject}
                    </TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.priority}
                        size="small"
                        sx={{ 
                          bgcolor: getPriorityColor(ticket.priority),
                          color: '#fff'
                        }} 
                      />
                    </TableCell>
                    <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Talebi Görüntüle">
                          <IconButton
                            size="small"
                            onClick={() => handleViewTicket(ticket)}
                            sx={{ color: bimTheme.secondary }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Talebi Üstlen">
                          <IconButton
                            size="small"
                            onClick={() => handleTakeTicket(ticket)}
                            sx={{ color: bimTheme.primary }}
                          >
                            <AssignmentTurnedInIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
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
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          <DialogTitle sx={{ bgcolor: bimTheme.secondary, color: 'white' }}>
            {selectedTicket.id} - Talep Detayı
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Müşteri:</strong> {selectedTicket.customer}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Konu:</strong> {selectedTicket.subject}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Kategori:</strong> {selectedTicket.category}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Öncelik:</strong> {' '}
              <Chip 
                label={selectedTicket.priority}
                size="small"
                sx={{ 
                  bgcolor: getPriorityColor(selectedTicket.priority),
                  color: '#fff'
                }} 
              />
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Oluşturulma:</strong> {formatDate(selectedTicket.createdAt)}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Son Güncelleme:</strong> {formatDate(selectedTicket.lastUpdated)}
            </Typography>
            
            <DialogContentText sx={{ mt: 2 }}>
              Bu özellik demo amaçlıdır. Gerçek uygulamada burada müşteri mesajları ve daha detaylı bilgiler yer alacaktır.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseDialog} 
              color="inherit"
            >
              Kapat
            </Button>
            <Button
              onClick={() => handleTakeTicket(selectedTicket)}
              variant="contained"
              startIcon={<AssignmentTurnedInIcon />}
              sx={{ 
                bgcolor: bimTheme.primary, 
                '&:hover': { 
                  bgcolor: '#c91118' 
                } 
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Talebi Üstlen'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default BimTicketsPoolPage; 