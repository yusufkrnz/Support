import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs,
  Tab,
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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  Select,
  InputLabel,
  TextareaAutosize,
  CircularProgress,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { useAuth } from '../../../hooks/useAuth';

// Atasun'a özel renk teması
const atasunTheme = {
  primary: '#00539B', // Atasun mavi rengi
  secondary: '#FF671F', // Turuncu vurgu rengi
  background: '#F5F7FA'
};

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyTickets = async () => {
      setLoading(true);
      try {
        // Gerçek uygulamada API'den veri çekilecek
        // const response = await api.getMyTickets(user.id);
        // setTickets(response.data);
        
        // Simüle edilmiş veri
        setTimeout(() => {
          const mockTickets = [
            { 
              id: 'ATN-1001', 
              customer: 'Mehmet Yılmaz', 
              subject: 'Siparişim hala gelmedi',
              category: 'Teslimat',
              priority: 'Yüksek',
              status: 'İşlemde',
              createdAt: '2023-06-15T09:23:11',
              lastUpdated: '2023-06-15T11:45:22',
              assignedAt: '2023-06-15T11:45:22'
            },
            { 
              id: 'ATN-1004', 
              customer: 'Zeynep Kaya', 
              subject: 'Yanlış ürün gönderilmiş',
              category: 'Teslimat',
              priority: 'Acil',
              status: 'İşlemde',
              createdAt: '2023-06-14T11:08:37',
              lastUpdated: '2023-06-15T10:22:15',
              assignedAt: '2023-06-15T10:22:15'
            },
            { 
              id: 'ATN-986', 
              customer: 'Ali Yıldız', 
              subject: 'Gözlüğüm çizilmiş olarak geldi',
              category: 'Ürün Kalitesi',
              priority: 'Yüksek',
              status: 'Beklemede',
              createdAt: '2023-06-12T15:17:42',
              lastUpdated: '2023-06-14T09:33:56',
              assignedAt: '2023-06-13T08:55:19',
              waitReason: 'Müşteriden bilgi bekleniyor'
            },
            { 
              id: 'ATN-954', 
              customer: 'Fatma Demir', 
              subject: 'İade sürecinde sorun yaşıyorum',
              category: 'İade',
              priority: 'Normal',
              status: 'Çözüldü',
              createdAt: '2023-06-10T08:44:12',
              lastUpdated: '2023-06-12T14:22:37',
              assignedAt: '2023-06-10T14:15:33',
              resolvedAt: '2023-06-12T14:22:37'
            },
            { 
              id: 'ATN-923', 
              customer: 'Mustafa Aydın', 
              subject: 'Numaralı gözlüğüm yanlış yapılmış',
              category: 'Ürün',
              priority: 'Yüksek',
              status: 'Çözüldü',
              createdAt: '2023-06-08T12:33:29',
              lastUpdated: '2023-06-11T09:42:17',
              assignedAt: '2023-06-09T11:27:45',
              resolvedAt: '2023-06-11T09:42:17'
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
    
    fetchMyTickets();
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
  
  // Tab değiştir
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Talebi görüntüle
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };
  
  // Menü aç
  const handleMenuClick = (event, ticket) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicket(ticket);
  };
  
  // Menü kapat
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Durumu güncelle dialog
  const handleStatusUpdateClick = () => {
    setSelectedStatus(selectedTicket.status);
    setStatusNote('');
    setStatusUpdateDialogOpen(true);
    handleMenuClose();
  };
  
  // Durumu güncelle
  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      
      // Gerçek uygulamada API çağrısı yapılacak
      // await api.updateTicketStatus(selectedTicket.id, selectedStatus, statusNote);
      
      // Simüle edilmiş başarılı cevap
      setTimeout(() => {
        // Ticket'ı güncelle
        setTickets(tickets.map(ticket => {
          if (ticket.id === selectedTicket.id) {
            return {
              ...ticket,
              status: selectedStatus,
              lastUpdated: new Date().toISOString(),
              ...(selectedStatus === 'Çözüldü' ? { resolvedAt: new Date().toISOString() } : {})
            };
          }
          return ticket;
        }));
        
        setStatusUpdateDialogOpen(false);
        setLoading(false);
        alert(`${selectedTicket.id} numaralı talebin durumu güncellendi!`);
      }, 800);
    } catch (error) {
      console.error('Hata:', error);
      setLoading(false);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };
  
  // Dialog kapat
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Status dialog kapat
  const handleCloseStatusDialog = () => {
    setStatusUpdateDialogOpen(false);
  };
  
  // Statuse göre filtrele
  const getFilteredTickets = () => {
    let filtered = [...tickets];
    
    // Tab değerine göre filtrele
    if (tabValue === 0) { // Tümü
      filtered = tickets;
    } else if (tabValue === 1) { // İşlemdekiler
      filtered = tickets.filter(ticket => ticket.status === 'İşlemde');
    } else if (tabValue === 2) { // Beklemedekiler
      filtered = tickets.filter(ticket => ticket.status === 'Beklemede');
    } else if (tabValue === 3) { // Çözülenler
      filtered = tickets.filter(ticket => ticket.status === 'Çözüldü');
    }
    
    // Arama sorgusuna göre filtrele
    return filtered.filter(ticket => 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
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
  
  // Duruma göre renk belirleme
  const getStatusColor = (status) => {
    switch (status) {
      case 'İşlemde':
        return '#2196f3'; // Mavi
      case 'Beklemede':
        return '#ff9800'; // Turuncu
      case 'Çözüldü':
        return '#4caf50'; // Yeşil
      default:
        return '#757575'; // Gri
    }
  };
  
  // Duruma göre icon belirleme
  const getStatusIcon = (status) => {
    switch (status) {
      case 'İşlemde':
        return null;
      case 'Beklemede':
        return <PauseCircleIcon fontSize="small" />;
      case 'Çözüldü':
        return <CheckCircleIcon fontSize="small" />;
      default:
        return null;
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
        <CircularProgress style={{ color: atasunTheme.primary }} />
      </Box>
    );
  }
  
  const filteredTickets = getFilteredTickets();
  
  return (
    <Box sx={{ p: 3, bgcolor: atasunTheme.background, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: atasunTheme.primary, fontWeight: 'bold' }}>
        Taleplerim
      </Typography>
      
      <Typography variant="body1" paragraph>
        Bu sayfada üstlendiğiniz ve size atanmış tüm destek taleplerini görüntüleyebilir ve yönetebilirsiniz.
      </Typography>
      
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChangeTab}
          sx={{ 
            mb: 2,
            '& .MuiTabs-indicator': { bgcolor: atasunTheme.primary },
            '& .Mui-selected': { color: `${atasunTheme.primary} !important` }
          }}
        >
          <Tab label="Tümü" />
          <Tab label="İşlemde" />
          <Tab label="Beklemede" />
          <Tab label="Çözüldü" />
        </Tabs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Ara..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            sx={{ color: atasunTheme.primary, borderColor: atasunTheme.primary }}
          >
            Filtrele
          </Button>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="my tickets table">
            <TableHead>
              <TableRow sx={{ bgcolor: atasunTheme.background }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Talep No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Müşteri</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Konu</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Kategori</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Öncelik</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Son Güncelleme</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell component="th" scope="row">
                      {ticket.id}
                    </TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
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
                    <TableCell>
                      <Chip 
                        icon={getStatusIcon(ticket.status)}
                        label={ticket.status}
                        size="small"
                        sx={{ 
                          bgcolor: getStatusColor(ticket.status),
                          color: '#fff'
                        }} 
                      />
                    </TableCell>
                    <TableCell>{formatDate(ticket.lastUpdated)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Talebi Görüntüle">
                          <IconButton
                            size="small"
                            onClick={() => handleViewTicket(ticket)}
                            sx={{ color: atasunTheme.primary }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="İşlemler">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, ticket)}
                            sx={{ color: atasunTheme.secondary }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              
              {filteredTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {searchQuery ? 'Arama kriterlerine uygun talep bulunamadı.' : 'Bekleyen talepleriniz bulunmuyor.'}
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
      
      {/* İşlemler Menüsü */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleStatusUpdateClick}>Durumu Güncelle</MenuItem>
        <MenuItem onClick={handleMenuClose}>Yanıt Ekle</MenuItem>
        <MenuItem onClick={handleMenuClose}>Başkasına Ata</MenuItem>
      </Menu>
      
      {/* Talep Detay Dialog */}
      {selectedTicket && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: atasunTheme.primary, color: 'white' }}>
            {selectedTicket.id} - Talep Detayı
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
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
                <strong>Durum:</strong> {' '}
                <Chip 
                  icon={getStatusIcon(selectedTicket.status)}
                  label={selectedTicket.status}
                  size="small"
                  sx={{ 
                    bgcolor: getStatusColor(selectedTicket.status),
                    color: '#fff'
                  }} 
                />
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Oluşturulma:</strong> {formatDate(selectedTicket.createdAt)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Size Atanma:</strong> {formatDate(selectedTicket.assignedAt)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Son Güncelleme:</strong> {formatDate(selectedTicket.lastUpdated)}
              </Typography>
              {selectedTicket.resolvedAt && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Çözüldüğü Tarih:</strong> {formatDate(selectedTicket.resolvedAt)}
                </Typography>
              )}
              {selectedTicket.waitReason && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Bekleme Nedeni:</strong> {selectedTicket.waitReason}
                </Typography>
              )}
            </Box>
            
            <DialogContentText>
              Bu özellik demo amaçlıdır. Gerçek uygulamada burada müşteri mesajları, yanıtlar ve daha detaylı bilgiler yer alacaktır.
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
              onClick={(e) => {
                handleMenuClick(e, selectedTicket);
                e.stopPropagation();
              }}
              variant="contained"
              sx={{ bgcolor: atasunTheme.secondary, '&:hover': { bgcolor: '#e55a14' } }}
            >
              İşlemler
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Durum Güncelleme Dialog */}
      <Dialog
        open={statusUpdateDialogOpen}
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Talep Durumunu Güncelle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="status-select-label">Durum</InputLabel>
              <Select
                labelId="status-select-label"
                value={selectedStatus}
                label="Durum"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="İşlemde">İşlemde</MenuItem>
                <MenuItem value="Beklemede">Beklemede</MenuItem>
                <MenuItem value="Çözüldü">Çözüldü</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Not"
              placeholder="Durum değişikliği hakkında bir not ekleyin..."
              multiline
              rows={4}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} color="inherit">
            İptal
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            sx={{ bgcolor: atasunTheme.primary }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Güncelle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyTicketsPage; 