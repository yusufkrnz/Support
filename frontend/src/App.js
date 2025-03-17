import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import RepresentativeDashboard from './pages/representative/RepresentativeDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ChatbotPage from './pages/customer/ChatbotPage';
import { isAuthenticated, getUserRole } from './utils/auth';
import './styles/index.css';

// Yetkilendirme kontrolü yapan özel Route bileşeni
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = isAuthenticated();
  const userRole = getUserRole();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Kullanıcı giriş yapmış ama bu sayfaya erişim yetkisi yok
    // Rolüne göre doğru panele yönlendir
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'REPRESENTATIVE') {
      return <Navigate to="/representative" replace />;
    } else {
      return <Navigate to="/customer" replace />;
    }
  }
  
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Sayfa yüklendiğinde veya rota değiştiğinde sayfanın en üstüne kaydır
    window.scrollTo(0, 0);
    
    // Uygulama başlangıcında yapılacak işlemler
    const initApp = async () => {
      try {
        // Burada gerekirse API'den başlangıç verilerini çekebilirsiniz
        // Örneğin: await api.init();
      } catch (error) {
        console.error('Application initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initApp();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        {/* Giriş sayfası */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Destek hattı - giriş yapmadan erişilebilir */}
        <Route path="/support" element={<ChatbotPage />} />
        
        {/* Ana sayfa - giriş sayfasına yönlendir */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Müşteri paneli */}
        <Route 
          path="/customer/*" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Müşteri temsilcisi paneli */}
        <Route 
          path="/representative/*" 
          element={
            <ProtectedRoute allowedRoles={['REPRESENTATIVE']}>
              <RepresentativeDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin paneli */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 sayfası */}
        <Route path="*" element={
          <div className="not-found">
            <h1>404</h1>
            <p>Sayfa bulunamadı</p>
            <button onClick={() => window.history.back()}>Geri Dön</button>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;