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
  Grid,
  Card,
  CardContent,
  Badge,
  Avatar,
  Stack,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../../../hooks/useAuth';

// Atasun'a özel renk teması - modern bir görünüm için güncellendi
const atasunTheme = {
  primary: '#007398', // Atasun mavi rengi
  primaryLight: '#338eac', // Daha açık mavi
  primaryDark: '#00526D', // Daha koyu mavi
  secondary: '#FF9D00', // Turuncu vurgu rengi
  secondaryLight: '#ffb133', // Daha açık turuncu
  background: '#f5f9fa',  // Daha zarif arka plan rengi
  backgroundDark: '#e6f0f3',
  cardBackground: '#ffffff',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: 'rgba(0, 115, 152, 0.15)',
  highlight: 'rgba(0, 115, 152, 0.08)'
};

const TicketsPoolPage = () => {
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
        // const response = await api.getTicketsPool('atasun');
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
              status: 'Açık',
              createdAt: '2023-06-15T09:23:11',
              lastUpdated: '2023-06-15T09:23:11'
            },
            { 
              id: 'ATN-1002', 
              customer: 'Ayşe Demir', 
              subject: 'Ürün açıklaması gerçeği yansıtmıyor',
              category: 'Ürün',
              priority: 'Normal',
              status: 'Açık',
              createdAt: '2023-06-15T10:45:22',
              lastUpdated: '2023-06-15T10:45:22'
            },
            { 
              id: 'ATN-1003', 
              customer: 'Can Yücel', 
              subject: 'İade işlemi onaylanmadı',
              category: 'İade',
              priority: 'Yüksek',
              status: 'Açık',
              createdAt: '2023-06-14T14:12:05',
              lastUpdated: '2023-06-14T16:33:41'
            },
            { 
              id: 'ATN-1004', 
              customer: 'Zeynep Kaya', 
              subject: 'Yanlış ürün gönderilmiş',
              category: 'Teslimat',
              priority: 'Acil',
              status: 'Açık',
              createdAt: '2023-06-14T11:08:37',
              lastUpdated: '2023-06-14T11:08:37'
            },
            { 
              id: 'ATN-1005', 
              customer: 'Emre Şahin', 
              subject: 'İndirim kuponu çalışmıyor',
              category: 'Ödeme',
              priority: 'Normal',
              status: 'Açık',
              createdAt: '2023-06-13T16:42:19',
              lastUpdated: '2023-06-13T16:42:19'
            },
            { 
              id: 'ATN-1006', 
              customer: 'Selin Aksoy', 
              subject: 'Ürün çalışmıyor',
              category: 'Teknik',
              priority: 'Yüksek',
              status: 'Açık',
              createdAt: '2023-06-13T09:15:54',
              lastUpdated: '2023-06-13T13:27:30'
            },
            { 
              id: 'ATN-1007', 
              customer: 'Murat Özkan', 
              subject: 'Yeni sipariş vermek istiyorum',
              category: 'Sipariş',
              priority: 'Düşük',
              status: 'Açık',
              createdAt: '2023-06-12T15:33:22',
              lastUpdated: '2023-06-12T15:33:22'
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
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh',
          background: `linear-gradient(to bottom, ${atasunTheme.background}, ${atasunTheme.backgroundDark})`
        }}
      >
        <CircularProgress style={{ color: atasunTheme.primary }} size={50} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: atasunTheme.textSecondary }}>
          Veriler yükleniyor...
        </Typography>
      </Box>
    );
  }
  
  // Öncelik durumlarına göre sayım
  const priorityCounts = {
    'Acil': filteredTickets.filter(t => t.priority === 'Acil').length,
    'Yüksek': filteredTickets.filter(t => t.priority === 'Yüksek').length,
    'Normal': filteredTickets.filter(t => t.priority === 'Normal').length,
    'Düşük': filteredTickets.filter(t => t.priority === 'Düşük').length
  };
  
  // Kategori bazında sayım
  const categoryCounts = {};
  filteredTickets.forEach(ticket => {
    categoryCounts[ticket.category] = (categoryCounts[ticket.category] || 0) + 1;
  });
  
  return (
    <Box 
      sx={{ 
        background: `linear-gradient(to bottom, ${atasunTheme.background}, ${atasunTheme.backgroundDark})`,
        minHeight: '100vh',
        pb: 5
      }}
    >
      {/* Header Section */}
      <Box 
        sx={{ 
          py: 4, 
          px: 3,
          background: `linear-gradient(135deg, ${atasunTheme.primary} 0%, ${atasunTheme.primaryDark} 100%)`,
          color: 'white',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 4px 20px rgba(0, 115, 152, 0.2)',
          mb: 4
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <AssignmentTurnedInIcon sx={{ mr: 1, fontSize: 32 }} /> 
            Atasun İstek Havuzu
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 700 }}>
            Bu sayfada henüz bir temsilciye atanmamış açık destek taleplerini görüntüleyebilir ve üstlenebilirsiniz.
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: `1px solid ${atasunTheme.border}`,
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h5" fontWeight="bold" color={atasunTheme.primary}>
                    {filteredTickets.length}
                  </Typography>
                  <Avatar 
                    sx={{ 
                      bgcolor: `${atasunTheme.primaryLight}20`, 
                      color: atasunTheme.primary 
                    }}
                  >
                    <AssignmentTurnedInIcon />
                  </Avatar>
                </Box>
                <Typography variant="body1" color={atasunTheme.textSecondary} sx={{ mt: 1 }}>
                  Toplam Talep
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: `1px solid ${atasunTheme.border}`,
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h5" fontWeight="bold" color="#f44336">
                    {priorityCounts['Acil']}
                  </Typography>
                  <Avatar sx={{ bgcolor: '#ffebee', color: '#f44336' }}>
                    <PriorityHighIcon />
                  </Avatar>
                </Box>
                <Typography variant="body1" color={atasunTheme.textSecondary} sx={{ mt: 1 }}>
                  Acil Talepler
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: `1px solid ${atasunTheme.border}`,
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h5" fontWeight="bold" color="#ff9800">
                    {priorityCounts['Yüksek']}
                  </Typography>
                  <Avatar sx={{ bgcolor: '#fff8e1', color: '#ff9800' }}>
                    <PriorityHighIcon />
                  </Avatar>
                </Box>
                <Typography variant="body1" color={atasunTheme.textSecondary} sx={{ mt: 1 }}>
                  Yüksek Öncelikli
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                border: `1px solid ${atasunTheme.border}`,
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h5" fontWeight="bold" color={atasunTheme.secondary}>
                    {Object.keys(categoryCounts).length}
                  </Typography>
                  <Avatar sx={{ bgcolor: `${atasunTheme.secondaryLight}20`, color: atasunTheme.secondary }}>
                    <CategoryIcon />
                  </Avatar>
                </Box>
                <Typography variant="body1" color={atasunTheme.textSecondary} sx={{ mt: 1 }}>
                  Farklı Kategori
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter and Search */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${atasunTheme.border}`
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'stretch', sm: 'center' }, 
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                placeholder="Talep no, müşteri adı veya konu ara..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ 
                  minWidth: { sm: '300px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: atasunTheme.primary,
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: atasunTheme.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Tooltip title="Listeyi Yenile">
                <IconButton 
                  sx={{ 
                    color: atasunTheme.primary,
                    bgcolor: atasunTheme.highlight,
                    '&:hover': { bgcolor: `${atasunTheme.primaryLight}30` }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                sx={{ 
                  color: atasunTheme.primary, 
                  borderColor: atasunTheme.primary,
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    borderColor: atasunTheme.primaryDark,
                    bgcolor: atasunTheme.highlight
                  }
                }}
              >
                Filtre
              </Button>
              
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: atasunTheme.primary,
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  boxShadow: '0 4px 12px rgba(0, 115, 152, 0.2)',
                  '&:hover': {
                    bgcolor: atasunTheme.primaryDark,
                  }
                }}
              >
                Uygula
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, pt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, borderTop: `1px solid ${atasunTheme.border}` }}>
            <Typography variant="subtitle2" sx={{ mr: 1, color: atasunTheme.textSecondary, display: 'flex', alignItems: 'center' }}>
              Hızlı Filtreler:
            </Typography>
            
            <Chip 
              label="Acil Talepler" 
              size="small" 
              sx={{ 
                bgcolor: '#ffebee', 
                color: '#f44336',
                '&:hover': { bgcolor: '#ffcdd2' }
              }}
            />
            
            <Chip 
              label="Bugün Oluşturulan" 
              size="small" 
              sx={{ 
                bgcolor: '#e8f5e9', 
                color: '#43a047',
                '&:hover': { bgcolor: '#c8e6c9' }
              }}
            />
            
            <Chip 
              label="Teslimat Sorunları" 
              size="small" 
              sx={{ 
                bgcolor: '#e3f2fd', 
                color: '#1976d2',
                '&:hover': { bgcolor: '#bbdefb' }
              }}
            />
            
            <Chip 
              label="İade İşlemleri" 
              size="small" 
              sx={{ 
                bgcolor: '#fff8e1', 
                color: '#ff9800',
                '&:hover': { bgcolor: '#ffecb3' }
              }}
            />
          </Box>
        </Paper>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {filteredTickets.length === 0 ? 
              'Bekleyen talep bulunmuyor' : 
              `Toplam ${filteredTickets.length} talep listeleniyor`
            }
          </Typography>
          
          <Box>
            <Button 
              size="small" 
              sx={{ 
                color: atasunTheme.textSecondary,
                '&:hover': { bgcolor: atasunTheme.highlight }
              }}
            >
              Son Eklenenler
            </Button>
            <Button 
              size="small"
              sx={{ 
                color: atasunTheme.textSecondary,
                '&:hover': { bgcolor: atasunTheme.highlight }
              }}
            >
              Önceliğe Göre
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${atasunTheme.border}`,
            overflow: 'hidden',
            mb: 3
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="tickets table">
              <TableHead>
                <TableRow sx={{ bgcolor: atasunTheme.highlight }}>
                  <TableCell sx={{ fontWeight: 600, color: atasunTheme.primary }}>Talep No</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: atasunTheme.primary }}>Müşteri</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: atasunTheme.primary }}>Konu</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: atasunTheme.primary }}>Kategori</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: atasunTheme.primary }}>Öncelik</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: atasunTheme.primary }}>Oluşturulma</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: atasunTheme.primary }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTickets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((ticket, index) => (
                    <TableRow 
                      key={ticket.id} 
                      hover
                      sx={{ 
                        '&:hover': { bgcolor: `${atasunTheme.highlight}80` },
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                        bgcolor: index % 2 === 0 ? 'white' : `${atasunTheme.background}40`
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ fontWeight: 500, color: atasunTheme.primary }}
                      >
                        {ticket.id}
                      </TableCell>
                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: `${atasunTheme.secondary}25`, 
                            color: atasunTheme.secondary,
                            fontSize: '0.85rem'
                          }}
                        >
                          {ticket.customer.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {ticket.customer}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={ticket.subject} arrow>
                          <Typography 
                            variant="body2" 
                            sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {ticket.subject}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={ticket.category}
                          size="small"
                          sx={{ 
                            bgcolor: `${atasunTheme.primary}15`,
                            color: atasunTheme.primary,
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={ticket.priority}
                          size="small"
                          sx={{ 
                            bgcolor: getPriorityColor(ticket.priority),
                            color: '#fff',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: '0.9rem', color: atasunTheme.textSecondary }} />
                          <Typography variant="body2" color={atasunTheme.textSecondary}>
                            {formatDate(ticket.createdAt)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Talebi Görüntüle">
                            <IconButton
                              size="small"
                              onClick={() => handleViewTicket(ticket)}
                              sx={{ 
                                color: atasunTheme.primary,
                                bgcolor: `${atasunTheme.primary}10`,
                                '&:hover': { bgcolor: `${atasunTheme.primary}20` }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Talebi Üstlen">
                            <IconButton
                              size="small"
                              onClick={() => handleTakeTicket(ticket)}
                              sx={{ 
                                color: atasunTheme.secondary,
                                bgcolor: `${atasunTheme.secondary}10`,
                                '&:hover': { bgcolor: `${atasunTheme.secondary}20` }
                              }}
                            >
                              <AssignmentTurnedInIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                
                {filteredTickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                        <AssignmentTurnedInIcon sx={{ color: atasunTheme.textSecondary, fontSize: 48, mb: 2, opacity: 0.6 }} />
                        <Typography variant="h6" color={atasunTheme.textSecondary} gutterBottom>
                          {searchQuery ? 'Arama kriterlerine uygun talep bulunamadı.' : 'Havuzda bekleyen talep bulunmuyor.'}
                        </Typography>
                        <Typography variant="body2" color={atasunTheme.textSecondary} sx={{ maxWidth: 400, textAlign: 'center', mt: 1 }}>
                          {searchQuery ? 
                            'Lütfen farklı arama kriterleri deneyin veya filtreleri temizleyin.' : 
                            'Şu anda havuzda bekleyen herhangi bir destek talebi bulunmamaktadır. Daha sonra tekrar kontrol edin.'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
            <Typography variant="body2" color={atasunTheme.textSecondary}>
              {filteredTickets.length} talep listeleniyor
            </Typography>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredTickets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Sayfa başına:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
              sx={{
                '& .MuiTablePagination-toolbar': {
                  pl: 0
                },
                '& .MuiTablePagination-select': {
                  fontWeight: 500
                }
              }}
            />
          </Box>
        </Paper>
      </Box>
      
      {/* Talep Detay Dialog */}
      {selectedTicket && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              background: `linear-gradient(90deg, ${atasunTheme.primary} 0%, ${atasunTheme.primaryDark} 100%)`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 2
            }}
          >
            <VisibilityIcon sx={{ mr: 1 }} />
            {selectedTicket.id} - Talep Detayı
          </DialogTitle>
          
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      border: `1px solid ${atasunTheme.border}`,
                      height: '100%'
                    }}
                  >
                    <Typography variant="h6" gutterBottom color={atasunTheme.textPrimary} sx={{ fontWeight: 600 }}>
                      {selectedTicket.subject}
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        alignItems: 'center', 
                        mb: 3, 
                        pb: 2,
                        borderBottom: `1px solid ${atasunTheme.border}`
                      }}
                    >
                      <Chip 
                        label={selectedTicket.category}
                        size="small"
                        sx={{ 
                          bgcolor: `${atasunTheme.primary}15`,
                          color: atasunTheme.primary,
                          fontWeight: 500
                        }} 
                      />
                      
                      <Chip 
                        label={selectedTicket.priority}
                        size="small"
                        sx={{ 
                          bgcolor: getPriorityColor(selectedTicket.priority),
                          color: '#fff',
                          fontWeight: 500
                        }} 
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                        <AccessTimeIcon sx={{ fontSize: '0.9rem', color: atasunTheme.textSecondary }} />
                        <Typography variant="body2" color={atasunTheme.textSecondary}>
                          {formatDate(selectedTicket.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                      Talep İçeriği
                    </Typography>
                    
                    <Typography variant="body2" paragraph sx={{ color: atasunTheme.textSecondary, mb: 3 }}>
                      Bu özellik demo amaçlıdır. Gerçek uygulamada burada müşteri mesajları ve detaylı içerik 
                      yer alacaktır. Müşterinin sorununu açıklayan metin, ekran görüntüleri ve diğer 
                      kaynaklar burada gösterilecektir.
                    </Typography>
                    
                    <Typography variant="body2" paragraph sx={{ color: atasunTheme.textSecondary }}>
                      Bu destek talebini üzerinize aldığınızda, müşteriye bir bildirim gönderilecek ve sorunu
                      çözmek için gerekli adımları atabileceksiniz. Talep havuzundan alındıktan sonra 
                      "Atanmış Taleplerim" bölümünde görüntülenecektir.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      border: `1px solid ${atasunTheme.border}`,
                      mb: 2
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: atasunTheme.textPrimary }}>
                      Müşteri Bilgileri
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: `${atasunTheme.secondary}25`,
                          color: atasunTheme.secondary,
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}
                      >
                        {selectedTicket.customer.charAt(0)}
                      </Avatar>
                      
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {selectedTicket.customer}
                        </Typography>
                        <Typography variant="body2" color={atasunTheme.textSecondary}>
                          Müşteri ID: #12345
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color={atasunTheme.textSecondary}>
                          E-posta:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          musteri@ornek.com
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color={atasunTheme.textSecondary}>
                          Telefon:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          +90 (555) 123 4567
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color={atasunTheme.textSecondary}>
                          Üyelik:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          15.03.2022
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      border: `1px solid ${atasunTheme.border}` 
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: atasunTheme.textPrimary }}>
                      İlgili Siparişler
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: atasunTheme.background,
                        border: `1px solid ${atasunTheme.border}`,
                        mb: 2
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                        Sipariş #OR-78952
                      </Typography>
                      <Typography variant="body2" color={atasunTheme.textSecondary}>
                        12.06.2023 - 749 TL
                      </Typography>
                      <Chip 
                        label="Tamamlandı" 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          bgcolor: '#e8f5e9', 
                          color: '#43a047',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                    
                    <Typography variant="body2" color={atasunTheme.textSecondary} align="center">
                      Bu talep, müşterinin son siparişiyle ilgili olabilir.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ justifyContent: 'space-between', p: 2, bgcolor: atasunTheme.backgroundDark }}>
            <Button 
              variant="outlined"
              onClick={handleCloseDialog} 
              sx={{
                color: atasunTheme.textPrimary,
                borderColor: atasunTheme.border,
                '&:hover': {
                  borderColor: atasunTheme.primary,
                  bgcolor: 'rgba(0, 115, 152, 0.05)'
                },
                borderRadius: 2
              }}
            >
              Kapat
            </Button>
            
            <Button
              onClick={() => handleTakeTicket(selectedTicket)}
              variant="contained"
              startIcon={<AssignmentTurnedInIcon />}
              sx={{ 
                bgcolor: atasunTheme.secondary, 
                '&:hover': { bgcolor: atasunTheme.secondaryDark },
                borderRadius: 2,
                px: 3,
                boxShadow: '0 4px 12px rgba(255, 157, 0, 0.25)'
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Talebi Üstlen'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default TicketsPoolPage; 