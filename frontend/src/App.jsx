import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Mevcut müşteri sayfaları
import AtasunDashboard from './pages/Atasun/Dashboard';
import GratisDashboard from './pages/Gratis/Dashboard';
import BimDashboard from './pages/Bim/Dashboard';
import AtasunChatbot from './pages/Atasun/chatbot/Chatbot';
import GratisChatbot from './pages/Gratis/chatbot/Chatbot';
import BimChatbot from './pages/Bim/chatbot/Chatbot';

// Yeni eklenen Atasun E-ticaret dashboard'u
import AtasunECommerceDashboard from './pages/Atasun/ECommerceDashboard';

// Müşteri login ve mesajlaşma sayfaları
import AtasunLoginPage from './pages/Atasun/LoginPage';
import AtasunResetPasswordPage from './pages/Atasun/ResetPasswordPage';
import AtasunMessagingPage from './pages/Atasun/MessagingPage';
import BimLoginPage from './pages/Bim/LoginPage';
import GratisLoginPage from './pages/Gratis/LoginPage';

// Auth Module Pages
import LoginPage from './modules/auth/pages/LoginPage';

// Yönetim Modülü Sayfaları - Firma Login
import AtasunYonetimLoginPage from './pages/yonetim/Atasun/login/LoginPage';
import GratisYonetimLoginPage from './pages/yonetim/Gratis/login/LoginPage';
import BimYonetimLoginPage from './pages/yonetim/Bim/login/LoginPage';

// Yönetim Modülü Sayfaları - Atasun
import AtasunYonetimDashboard from './pages/yonetim/Atasun/Dashboard';
import AtasunTicketsPoolPage from './pages/yonetim/Atasun/TicketsPoolPage';
import AtasunMyTicketsPage from './pages/yonetim/Atasun/MyTicketsPage';

// Yönetim Modülü Sayfaları - Gratis
import GratisYonetimDashboard from './pages/yonetim/Gratis/Dashboard';
import GratisTicketsPoolPage from './pages/yonetim/Gratis/TicketsPoolPage';
import GratisMyTicketsPage from './pages/yonetim/Gratis/MyTicketsPage';

// Yönetim Modülü Sayfaları - BİM
import BimYonetimDashboard from './pages/yonetim/Bim/Dashboard';
import BimTicketsPoolPage from './pages/yonetim/Bim/TicketsPoolPage';
import BimMyTicketsPage from './pages/yonetim/Bim/MyTicketsPage';

// Dashboard Module (lazy loaded)
import Dashboard from './modules/dashboard/pages/Dashboard';

// Tickets Module (lazy loaded)
const TicketsPage = React.lazy(() => import('./modules/tickets/pages/TicketsPage'));
const TicketDetailPage = React.lazy(() => import('./modules/tickets/pages/TicketDetailPage'));

// Users Module (lazy loaded)
const UsersPage = React.lazy(() => import('./modules/users/pages/UsersPage'));

// Settings Module (lazy loaded)
const SettingsPage = React.lazy(() => import('./modules/settings/pages/SettingsPage'));

// Analytics Module (lazy loaded)
const AnalyticsPage = React.lazy(() => import('./modules/analytics/pages/AnalyticsPage'));

// Loading component for lazy-loaded routes
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    Yükleniyor...
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Atasun müşteri sayfaları */}
      <Route path="/atasun" element={<AtasunECommerceDashboard />} />
      <Route path="/atasun/support" element={<AtasunDashboard />} />
      <Route path="/atasun/login" element={<AtasunLoginPage />} />
      <Route path="/atasun/reset-password" element={<AtasunResetPasswordPage />} />
      <Route path="/atasun/dashboard" element={<AtasunDashboard />} />
      <Route path="/atasun/chatbot" element={<AtasunChatbot />} />
      <Route path="/atasun/messaging/:ticketId" element={<AtasunMessagingPage />} />
      <Route path="/atasun/messaging" element={<AtasunMessagingPage />} />
      
      {/* Gratis müşteri sayfaları */}
      <Route path="/gratis" element={<GratisDashboard />} />
      <Route path="/gratis/login" element={<GratisLoginPage />} />
      <Route path="/gratis/chatbot" element={<GratisChatbot />} />
      
      {/* BİM müşteri sayfaları */}
      <Route path="/bim" element={<BimDashboard />} />
      <Route path="/bim/login" element={<BimLoginPage />} />
      <Route path="/bim/chatbot" element={<BimChatbot />} />
      
      {/* Yönetim Paneli Giriş Sayfaları - Firma bazlı */}
      <Route path="/yonetim/atasun/login" element={<AtasunYonetimLoginPage />} />
      <Route path="/yonetim/gratis/login" element={<GratisYonetimLoginPage />} />
      <Route path="/yonetim/bim/login" element={<BimYonetimLoginPage />} />
      
      {/* Ana sayfa yönlendirmesi */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/yonetim" element={<Navigate to="/yonetim/atasun/login" replace />} />
      <Route path="/yonetim/atasun" element={<Navigate to="/yonetim/atasun/login" replace />} />
      <Route path="/yonetim/gratis" element={<Navigate to="/yonetim/gratis/login" replace />} />
      <Route path="/yonetim/bim" element={<Navigate to="/yonetim/bim/login" replace />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Tickets */}
        <Route path="/tickets" element={
          <React.Suspense fallback={<Loading />}>
            <TicketsPage />
          </React.Suspense>
        } />
        <Route path="/tickets/:id" element={
          <React.Suspense fallback={<Loading />}>
            <TicketDetailPage />
          </React.Suspense>
        } />
        
        {/* Users - only for admin and manager roles */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
          <Route path="/users" element={
            <React.Suspense fallback={<Loading />}>
              <UsersPage />
            </React.Suspense>
          } />
        </Route>
        
        {/* Settings */}
        <Route path="/settings" element={
          <React.Suspense fallback={<Loading />}>
            <SettingsPage />
          </React.Suspense>
        } />
        
        {/* Analytics - only for admin roles */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/analytics" element={
            <React.Suspense fallback={<Loading />}>
              <AnalyticsPage />
            </React.Suspense>
          } />
        </Route>
        
        {/* Atasun Yönetim Sayfaları */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
          <Route path="/yonetim/atasun/dashboard" element={<AtasunYonetimDashboard />} />
          <Route path="/yonetim/atasun/tickets-pool" element={<AtasunTicketsPoolPage />} />
          <Route path="/yonetim/atasun/my-tickets" element={<AtasunMyTicketsPage />} />
        </Route>
        
        {/* Gratis Yönetim Sayfaları */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
          <Route path="/yonetim/gratis/dashboard" element={<GratisYonetimDashboard />} />
          <Route path="/yonetim/gratis/tickets-pool" element={<GratisTicketsPoolPage />} />
          <Route path="/yonetim/gratis/my-tickets" element={<GratisMyTicketsPage />} />
        </Route>
        
        {/* BİM Yönetim Sayfaları */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
          <Route path="/yonetim/bim/dashboard" element={<BimYonetimDashboard />} />
          <Route path="/yonetim/bim/tickets-pool" element={<BimTicketsPoolPage />} />
          <Route path="/yonetim/bim/my-tickets" element={<BimMyTicketsPage />} />
        </Route>
      </Route>
      
      {/* 404 page */}
      <Route path="*" element={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <h1>404</h1>
          <p>Sayfa bulunamadı</p>
          <button onClick={() => window.history.back()}>Geri Dön</button>
        </div>
      } />
    </Routes>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize app
    const initApp = async () => {
      try {
        // App initialization logic here
        // For example: load configuration, prefetch critical data, etc.
      } catch (error) {
        console.error('App initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initApp();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;