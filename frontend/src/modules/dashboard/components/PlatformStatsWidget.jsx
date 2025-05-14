import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  CircularProgress, 
  Tabs, 
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Grid
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  RemoveCircleOutline as FlatIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../../../contexts/ThemeContext';

// Mock data with platform performance metrics
const MOCK_PLATFORM_DATA = {
  trendyol: {
    responseTime: { value: 28, change: -12, unit: 'min' },
    resolution: { value: 78, change: 5, unit: '%' },
    satisfaction: { value: 4.7, change: 0.3, unit: '/5' },
    tickets: { value: 423, change: 45, unit: '' },
    dailyAvg: { value: 31, change: -2, unit: '' }
  },
  hepsiburada: {
    responseTime: { value: 32, change: -8, unit: 'min' },
    resolution: { value: 81, change: 3, unit: '%' },
    satisfaction: { value: 4.5, change: 0.1, unit: '/5' },
    tickets: { value: 378, change: 12, unit: '' },
    dailyAvg: { value: 28, change: 3, unit: '' }
  },
  gratis: {
    responseTime: { value: 35, change: -5, unit: 'min' },
    resolution: { value: 73, change: 8, unit: '%' },
    satisfaction: { value: 4.2, change: 0.4, unit: '/5' },
    tickets: { value: 215, change: -10, unit: '' },
    dailyAvg: { value: 18, change: -5, unit: '' }
  },
  total: {
    responseTime: { value: 31, change: -9, unit: 'min' },
    resolution: { value: 77, change: 4, unit: '%' },
    satisfaction: { value: 4.5, change: 0.2, unit: '/5' },
    tickets: { value: 1016, change: 47, unit: '' },
    dailyAvg: { value: 77, change: -4, unit: '' }
  }
};

// Metric labels in Turkish
const METRIC_LABELS = {
  responseTime: 'Ortalama Yanıt Süresi',
  resolution: 'Çözüm Oranı',
  satisfaction: 'Müşteri Memnuniyeti',
  tickets: 'Toplam Destek Talebi',
  dailyAvg: 'Günlük Ortalama Talep'
};

const PlatformStatsWidget = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const theme = useTheme();
  const { currentPlatform } = useThemeContext();
  
  // Get platform data
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from API
        // const response = await api.getPlatformStats();
        // setStats(response.data);
        
        // Simulate API call with mock data
        setTimeout(() => {
          setStats(MOCK_PLATFORM_DATA);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching platform stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const getPlatformByTabIndex = (index) => {
    switch (index) {
      case 0:
        return 'total';
      case 1:
        return 'trendyol';
      case 2:
        return 'hepsiburada';
      case 3:
        return 'gratis';
      default:
        return 'total';
    }
  };
  
  const renderTrend = (change) => {
    if (change > 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
          <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" component="span">
            {`+${change}`}
          </Typography>
        </Box>
      );
    } else if (change < 0) {
      // For response time, negative change is actually good
      const isResponseTime = 
        Object.entries(METRIC_LABELS).find(([key, value]) => 
          value === 'Ortalama Yanıt Süresi'
        )?.[0] === Object.entries(stats[getPlatformByTabIndex(tabValue)])
          .find(([key, { value }]) => value === 28)?.[0];
      
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: isResponseTime ? 'success.main' : 'error.main' 
          }}
        >
          <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" component="span">
            {change}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <FlatIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" component="span">
            0
          </Typography>
        </Box>
      );
    }
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
  
  const currentStats = stats[getPlatformByTabIndex(tabValue)];
  
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
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">
          Platform İstatistikleri
        </Typography>
      </Box>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          px: 2,
          '& .MuiTab-root': {
            minWidth: 'auto',
            px: 2
          }
        }}
      >
        <Tab label="Genel" />
        <Tab label="Trendyol" />
        <Tab label="Hepsiburada" />
        <Tab label="Gratis" />
      </Tabs>
      
      <Divider />
      
      <Box sx={{ p: 2, flex: 1 }}>
        <Grid container spacing={2}>
          {Object.entries(currentStats).map(([key, data]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {METRIC_LABELS[key]}
                  </Typography>
                  {renderTrend(data.change)}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                  {data.value}{data.unit}
                </Typography>
                
                {key === 'resolution' && (
                  <LinearProgress 
                    variant="determinate" 
                    value={data.value} 
                    sx={{ 
                      mt: 1, 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: theme.palette.grey[200]
                    }}
                  />
                )}
                
                {key === 'satisfaction' && (
                  <Box sx={{ display: 'flex', mt: 0.5 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        style={{ 
                          color: star <= Math.floor(data.value) ? '#FFD700' : '#e0e0e0',
                          fontSize: '18px'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default PlatformStatsWidget; 