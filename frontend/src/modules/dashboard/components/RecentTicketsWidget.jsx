import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip, 
  IconButton, 
  Divider,
  CircularProgress,
  Button
} from '@mui/material';
import { 
  Message as MessageIcon, 
  AccessTime as AccessTimeIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

// Helper to get status color
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

// Helper to translate status
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

// Helper to get platform color
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

const RecentTicketsWidget = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from API
        // const response = await api.getRecentTickets();
        // setTickets(response.data);
        
        // Simulate API call with mock data
        setTimeout(() => {
          setTickets([
            {
              id: 'TKT-1001',
              subject: 'Ürün iade işlemi hakkında',
              customer: {
                name: 'Ahmet Yılmaz',
                avatar: null
              },
              status: 'open',
              platform: 'trendyol',
              timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
              priority: 'high'
            },
            {
              id: 'TKT-1002',
              subject: 'Sipariş teslimat sorunu',
              customer: {
                name: 'Ayşe Demir',
                avatar: null
              },
              status: 'in_progress',
              platform: 'hepsiburada',
              timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
              priority: 'medium'
            },
            {
              id: 'TKT-1003',
              subject: 'Mağaza puanı hakkında bilgi talebi',
              customer: {
                name: 'Mehmet Kaya',
                avatar: null
              },
              status: 'pending',
              platform: 'trendyol',
              timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
              priority: 'low'
            },
            {
              id: 'TKT-1004',
              subject: 'Kampanya hakkında soru',
              customer: {
                name: 'Zeynep Yıldız',
                avatar: null
              },
              status: 'resolved',
              platform: 'gratis',
              timestamp: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
              priority: 'medium'
            },
            {
              id: 'TKT-1005',
              subject: 'Ödeme yöntemi değişikliği',
              customer: {
                name: 'Can Türk',
                avatar: null
              },
              status: 'open',
              platform: 'hepsiburada',
              timestamp: new Date(Date.now() - 1000 * 60 * 500), // ~8 hours ago
              priority: 'high'
            }
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, []);
  
  const handleNavigateToTicket = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };
  
  const handleViewAllTickets = () => {
    navigate('/tickets');
  };
  
  if (loading) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          p: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <CircularProgress size={30} />
      </Paper>
    );
  }
  
  return (
    <Paper
      elevation={0}
      sx={{ 
        p: 0, 
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Son Destek Talepleri
        </Typography>
        <Button 
          variant="text"
          color="primary"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={handleViewAllTickets}
        >
          Tümünü Gör
        </Button>
      </Box>
      
      <Divider />
      
      <List sx={{ p: 0, flex: 1, overflow: 'auto' }}>
        {tickets.map((ticket, index) => (
          <React.Fragment key={ticket.id}>
            <ListItem
              alignItems="flex-start"
              sx={{ 
                py: 2,
                px: 2,
                cursor: 'pointer', 
                '&:hover': { 
                  bgcolor: 'action.hover' 
                },
                borderLeft: `3px solid ${getPlatformColor(ticket.platform)}`
              }}
              onClick={() => handleNavigateToTicket(ticket.id)}
              secondaryAction={
                <IconButton edge="end" aria-label="more options" onClick={(e) => e.stopPropagation()}>
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar 
                  alt={ticket.customer.name} 
                  src={ticket.customer.avatar}
                  sx={{ bgcolor: getPlatformColor(ticket.platform) }}
                >
                  {ticket.customer.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ 
                        maxWidth: '80%',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {ticket.subject}
                    </Typography>
                    <Chip 
                      label={getStatusText(ticket.status)} 
                      color={getStatusColor(ticket.status)} 
                      size="small" 
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography 
                      variant="body2" 
                      component="span"
                      sx={{ display: 'block', color: 'text.primary' }}
                    >
                      {ticket.customer.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {formatDistanceToNow(ticket.timestamp, { addSuffix: true, locale: tr })}
                      </Typography>
                      <Chip 
                        label={ticket.id} 
                        size="small" 
                        variant="outlined"
                        sx={{ ml: 1, height: 18, fontSize: '0.65rem' }}
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < tickets.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
      
      {tickets.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <MessageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            Henüz destek talebi bulunmuyor
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RecentTicketsWidget; 