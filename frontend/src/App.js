import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RepresentativeDashboard from './pages/representative/RepresentativeDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#66BB6A',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/representative/*" element={<RepresentativeDashboard />} />
          <Route path="/customer/*" element={<CustomerDashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App; 