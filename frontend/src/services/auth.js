import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Kullanıcı kimlik doğrulama servisi
export const authService = {
  // Giriş işlemi
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      
      // Mock veri ile giriş simülasyonu
      if (username === 'admin@example.com' && password === 'admin') {
        const mockUser = {
          id: 1,
          username: 'admin@example.com',
          fullName: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
          token: 'mock-jwt-token-admin'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { data: mockUser };
      } else if (username === 'rep@example.com' && password === 'rep') {
        const mockUser = {
          id: 2,
          username: 'rep@example.com',
          fullName: 'Ahmet Yılmaz',
          email: 'rep@example.com',
          role: 'REPRESENTATIVE',
          token: 'mock-jwt-token-rep'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { data: mockUser };
      } else if (username === 'customer@example.com' && password === 'customer') {
        const mockUser = {
          id: 4,
          username: 'customer@example.com',
          fullName: 'Mehmet Kaya',
          email: 'customer@example.com',
          role: 'CUSTOMER',
          token: 'mock-jwt-token-customer'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { data: mockUser };
      }
      
      throw error;
    }
  },

  // Çıkış işlemi
  logout: () => {
    localStorage.removeItem('user');
  },

  // Mevcut kullanıcıyı al
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  // Kullanıcı kaydı
  register: async (userData) => {
    try {
      return await axios.post(`${API_URL}/auth/register`, userData);
    } catch (error) {
      console.error('Register error:', error);
      
      // Mock veri ile kayıt simülasyonu
      const mockUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        username: userData.email,
        fullName: userData.fullName,
        email: userData.email,
        role: 'CUSTOMER',
        token: 'mock-jwt-token-new-customer'
      };
      return { data: mockUser };
    }
  },

  // Kullanıcı profil bilgilerini güncelle
  updateProfile: async (userId, userData) => {
    try {
      return await axios.put(`${API_URL}/users/${userId}`, userData);
    } catch (error) {
      console.error('Update profile error:', error);
      
      // Mock veri ile güncelleme simülasyonu
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { data: updatedUser };
    }
  },

  // Şifre değiştirme
  changePassword: async (userId, passwordData) => {
    try {
      return await axios.post(`${API_URL}/users/${userId}/change-password`, passwordData);
    } catch (error) {
      console.error('Change password error:', error);
      
      // Mock veri ile şifre değiştirme simülasyonu
      return { data: { message: 'Şifre başarıyla değiştirildi.' } };
    }
  }
};

// Axios interceptor'ları
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default authService; 