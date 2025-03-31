import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/auth/LoginPage';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import RepresentativeDashboard from './pages/representative/RepresentativeDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';

const theme = createTheme({
  palette: {
    primary: {
      light: '#4CAF50',
      main: '#2E7D32',
      dark: '#1B5E20',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff4081',
      main: '#f50057',
      dark: '#c51162',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* Representative Routes */}
          <Route path="/representative/*" element={<RepresentativeDashboard />} />
          
          {/* Customer Routes - includes chat route internally */}
          <Route path="/customer/*" element={<CustomerDashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App; 