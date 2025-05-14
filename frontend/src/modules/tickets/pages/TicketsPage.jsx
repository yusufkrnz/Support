import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

// Helper fonksiyonları
const getStatusColor = (status) => {
  switch (status) {
    case 'open':
      return 'error';
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'resolved':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'open':
      return 'Açık';
    case 'pending':
      return 'Beklemede';
    case 'in_progress':
      return 'İşleniyor';
    case 'resolved':
      return 'Çözüldü';
    default:
      return status;
  }
};

const getPlatformColor = (platform) => {
  switch (platform) {
    case 'trendyol':
      return '#F27A1A';
    case 'hepsiburada':
      return '#FF6000';
    case 'gratis':
      return '#7B1FA2';
    default:
      return '#1976D2';
  }
};

const TicketsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [viewType, setViewType] = useState('list'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  
  // Destek taleplerini çek
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // Gerçek uygulamada API çağrısı yapılır
        // const response = await api.getTickets({
        //   page,
        //   limit: rowsPerPage,
        //   sort: sortBy,
        //   direction: sortDirection,
        //   search: searchText,
        //   status: statusFilter !== 'all' ? statusFilter : undefined,
        //   platform: platformFilter !== 'all' ? platformFilter : undefined
        // });
        // setTickets(response.data);
        
        // Mock veri
        setTimeout(() => {
          const mockTickets = Array(25).fill(null).map((_, i) => ({
            id: `TKT-${1000 + i}`,
            subject: `${i % 3 === 0 ? 'Ürün iade işlemi' : i % 3 === 1 ? 'Sipariş teslimatı' : 'Ödeme sorunu'} #${1000 + i}`,
            customer: {
              name: `${i % 2 === 0 ? 'Ahmet' : 'Ayşe'} ${i % 3 === 0 ? 'Yılmaz' : i % 3 === 1 ? 'Kaya' : 'Demir'}`,
              email: `customer${i}@example.com`,
              avatar: null
            },
            status: i % 4 === 0 ? 'open' : i % 4 === 1 ? 'pending' : i % 4 === 2 ? 'in_progress' : 'resolved',
            platform: i % 3 === 0 ? 'trendyol' : i % 3 === 1 ? 'hepsiburada' : 'gratis',
            createdAt: new Date(Date.now() - (i * 1000 * 60 * 60 * 3)), // Her bilet 3 saat arayla
            updatedAt: new Date(Date.now() - (i * 1000 * 60 * 30)), // Son güncelleme 30 dakika arayla 
            priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
            assignee: i % 5 === 0 ? null : {
              name: `${i % 2 === 0 ? 'Mehmet' : 'Zeynep'} ${i % 3 === 0 ? 'Yıldız' : i % 3 === 1 ? 'Şahin' : 'Çelik'}`,
              avatar: null
            }
          }));
          
          setTickets(mockTickets);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Destek talepleri yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [page, rowsPerPage, sortBy, sortDirection, searchText, statusFilter, platformFilter]);
  
  // Sayfa değişikliği
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Sayfa başına satır sayısı değişikliği
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filtreleme menüsü açma/kapama
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  // Görünüm tipi değiştirme (liste/grid)
  const handleViewTypeChange = (type) => {
    setViewType(type);
  };
  
  // Sıralama değiştirme
  const handleSortChange = (column) => {
    if (sortBy === column) {
      // Aynı sütunu tekrar tıklama - yön değiştir
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Farklı sütun - yeni sütun ve varsayılan yön
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Arama metni değişikliği
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setPage(0); // Aramada ilk sayfaya dön
  };
  
  // Detay sayfasına gitme
  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };
  
  // Yeni talep oluşturma
  const handleCreateTicket = () => {
    // navigate('/tickets/new');
    alert('Yeni destek talebi oluşturma fonksiyonu');
  };
  
  // Durum filtresi değiştirme
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(0);
    handleFilterClose();
  };
  
  // Platform filtresi değiştirme
  const handlePlatformFilterChange = (platform) => {
    setPlatformFilter(platform);
    setPage(0);
    handleFilterClose();
  };
  
  // Filtreleri sıfırlama
  const handleResetFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setPlatformFilter('all');
    setSortBy('date');
    setSortDirection('desc');
    setPage(0);
    handleFilterClose();
  };
  
  // Sıralama ikonlarını göster
  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    
    return sortDirection === 'asc' ? (
      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
    ) : (
      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
    );
  };
  
  // Platform bazında ikon/etiket oluştur
  const renderPlatformChip = (platform) => {
    return (
      <Chip
        label={platform.charAt(0).toUpperCase() + platform.slice(1)}
        size="small"
        sx={{ 
          bgcolor: getPlatformColor(platform) + '20', 
          color: getPlatformColor(platform),
          fontWeight: 'medium',
          borderRadius: 1
        }}
      />
    );
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Başlık ve kontroller */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mb: { xs: 2, md: 0 } }}>
          Destek Talepleri
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Ara..."
            size="small"
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 220 } }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Filtrele
          </Button>
          
          <IconButton 
            sx={{ display: { xs: 'flex', sm: 'none' } }}
            onClick={handleFilterClick}
          >
            <FilterIcon />
          </IconButton>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTicket}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Yeni Talep
          </Button>
          
          <IconButton 
            color="primary"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
            onClick={handleCreateTicket}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Aktif filtreler */}
      {(statusFilter !== 'all' || platformFilter !== 'all' || searchText) && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {statusFilter !== 'all' && (
            <Chip 
              label={`Durum: ${getStatusText(statusFilter)}`}
              onDelete={() => setStatusFilter('all')}
              color={getStatusColor(statusFilter)}
              size="small"
            />
          )}
          
          {platformFilter !== 'all' && (
            <Chip 
              label={`Platform: ${platformFilter.charAt(0).toUpperCase() + platformFilter.slice(1)}`}
              onDelete={() => setPlatformFilter('all')}
              sx={{ 
                bgcolor: getPlatformColor(platformFilter) + '20', 
                color: getPlatformColor(platformFilter) 
              }}
              size="small"
            />
          )}
          
          {searchText && (
            <Chip 
              label={`Arama: ${searchText}`}
              onDelete={() => setSearchText('')}
              size="small"
            />
          )}
          
          <Chip 
            label="Filtreleri Sıfırla"
            onClick={handleResetFilters}
            size="small"
            variant="outlined"
          />
        </Box>
      )}
      
      {/* Görünüm tipi değiştirme */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton 
          color={viewType === 'list' ? 'primary' : 'default'} 
          onClick={() => handleViewTypeChange('list')}
        >
          <ViewListIcon />
        </IconButton>
        <IconButton 
          color={viewType === 'grid' ? 'primary' : 'default'} 
          onClick={() => handleViewTypeChange('grid')}
        >
          <ViewModuleIcon />
        </IconButton>
      </Box>
      
      {/* Destek talepleri tablo görünümü */}
      {viewType === 'list' && (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => handleSortChange('id')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Talep ID {renderSortIcon('id')}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => handleSortChange('subject')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Konu {renderSortIcon('subject')}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Platform</TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => handleSortChange('status')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Durum {renderSortIcon('status')}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => handleSortChange('customer')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Müşteri {renderSortIcon('customer')}
                  </Box>
                </TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => handleSortChange('date')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Tarih {renderSortIcon('date')}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket) => (
                <TableRow 
                  key={ticket.id}
                  hover
                  onClick={() => handleTicketClick(ticket.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{renderPlatformChip(ticket.platform)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusText(ticket.status)} 
                      color={getStatusColor(ticket.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          mr: 1, 
                          bgcolor: getPlatformColor(ticket.platform) 
                        }}
                      >
                        {ticket.customer.name.charAt(0)}
                      </Avatar>
                      {ticket.customer.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={new Date(ticket.createdAt).toLocaleString()}>
                      <Typography variant="body2">
                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: tr })}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`İşlemler: ${ticket.id}`);
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={tickets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Sayfa başına satır:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
          />
        </TableContainer>
      )}
      
      {/* Destek talepleri grid görünümü */}
      {viewType === 'grid' && (
        <>
          <Grid container spacing={2}>
            {tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket) => (
              <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                <Card 
                  elevation={1} 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)'
                    },
                    borderLeft: `4px solid ${getPlatformColor(ticket.platform)}`
                  }}
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.id}
                      </Typography>
                      <Chip 
                        label={getStatusText(ticket.status)} 
                        color={getStatusColor(ticket.status)} 
                        size="small" 
                      />
                    </Box>
                    
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                      {ticket.subject}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            mr: 1, 
                            bgcolor: getPlatformColor(ticket.platform) 
                          }}
                        >
                          {ticket.customer.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {ticket.customer.name}
                        </Typography>
                      </Box>
                      {renderPlatformChip(ticket.platform)}
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Tooltip title={new Date(ticket.createdAt).toLocaleString()}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: tr })}
                        </Typography>
                      </Tooltip>
                      
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`İşlemler: ${ticket.id}`);
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <TablePagination
              rowsPerPageOptions={[6, 12, 24, 48]}
              component="div"
              count={tickets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Sayfa başına:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
            />
          </Box>
        </>
      )}
      
      {/* Filtre menüsü */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        sx={{ mt: 1 }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Durum Filtresi</Typography>
        </MenuItem>
        <MenuItem 
          selected={statusFilter === 'all'}
          onClick={() => handleStatusFilterChange('all')}
        >
          Tümü
        </MenuItem>
        <MenuItem 
          selected={statusFilter === 'open'}
          onClick={() => handleStatusFilterChange('open')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: theme.palette.error.main,
                mr: 1
              }} 
            />
            Açık
          </Box>
        </MenuItem>
        <MenuItem 
          selected={statusFilter === 'pending'}
          onClick={() => handleStatusFilterChange('pending')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: theme.palette.warning.main,
                mr: 1
              }} 
            />
            Beklemede
          </Box>
        </MenuItem>
        <MenuItem 
          selected={statusFilter === 'in_progress'}
          onClick={() => handleStatusFilterChange('in_progress')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: theme.palette.info.main,
                mr: 1
              }} 
            />
            İşleniyor
          </Box>
        </MenuItem>
        <MenuItem 
          selected={statusFilter === 'resolved'}
          onClick={() => handleStatusFilterChange('resolved')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: theme.palette.success.main,
                mr: 1
              }} 
            />
            Çözüldü
          </Box>
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem disabled>
          <Typography variant="subtitle2">Platform Filtresi</Typography>
        </MenuItem>
        <MenuItem 
          selected={platformFilter === 'all'}
          onClick={() => handlePlatformFilterChange('all')}
        >
          Tümü
        </MenuItem>
        <MenuItem 
          selected={platformFilter === 'trendyol'}
          onClick={() => handlePlatformFilterChange('trendyol')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#F27A1A',
                mr: 1
              }} 
            />
            Trendyol
          </Box>
        </MenuItem>
        <MenuItem 
          selected={platformFilter === 'hepsiburada'}
          onClick={() => handlePlatformFilterChange('hepsiburada')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#FF6000',
                mr: 1
              }} 
            />
            Hepsiburada
          </Box>
        </MenuItem>
        <MenuItem 
          selected={platformFilter === 'gratis'}
          onClick={() => handlePlatformFilterChange('gratis')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#7B1FA2',
                mr: 1
              }} 
            />
            Gratis
          </Box>
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem onClick={handleResetFilters}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Filtreleri Sıfırla</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TicketsPage; 