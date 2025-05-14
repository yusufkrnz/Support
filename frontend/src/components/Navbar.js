import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'SSS', path: '/sss' },
    { text: 'Hakkımızda', path: '/hakkimizda' },
    { text: 'Poliçemiz', path: '/policemiz' },
  ];

  return (
    <AppBar position="static" sx={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      boxShadow: 'none',
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#2c3e50',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            SUPPORTHUB
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{ color: '#2c3e50' }}
            >
              Ana Sayfa
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              sx={{ color: '#2c3e50' }}
            >
              Giriş Yap
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/register"
              sx={{ color: '#2c3e50' }}
            >
              Kayıt Ol
            </Button>
          </Box>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ color: '#2c3e50' }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ 
                width: 250,
                backgroundColor: '#f5f7fa',
                height: '100%',
              }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                {menuItems.map((item, index) => (
                  <React.Fragment key={item.text}>
                    <ListItem 
                      button 
                      component={Link} 
                      to={item.path}
                      sx={{ 
                        color: '#2c3e50',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                        padding: '12px 16px',
                      }}
                    >
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{
                          fontSize: '1.1rem',
                          fontWeight: 'medium',
                        }}
                      />
                    </ListItem>
                    {index < menuItems.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 