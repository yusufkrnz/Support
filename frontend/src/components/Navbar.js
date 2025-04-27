import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
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
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            SUPPORTHUB
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">
              Ana Sayfa
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Giriş Yap
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Kayıt Ol
            </Button>
            <Button color="inherit" component={Link} to="/dashboard">
              Panel
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 