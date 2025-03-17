import axios from 'axios';
import { getToken } from '../utils/auth';

// API temel URL'leri
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const AI_API_URL = 'http://localhost:8000'; // FastAPI AI servisi

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek interceptor'ı - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı - hata durumunda işle
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized hatası durumunda kullanıcıyı login sayfasına yönlendir
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AI API için ayrı bir instance
const aiApi = axios.create({
  baseURL: AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth servisleri
export const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  register: (userData) => {
    return api.post('/auth/register', userData);
  }
};

// Chatbot servisleri
export const chatbotService = {
  sendMessage: (message, supportRequestId = null) => {
    return api.post('/chatbot/message', { 
      message, 
      supportRequestId,
      subject: supportRequestId ? undefined : 'New Support Request'
    });
  },
  requestRepresentative: (supportRequestId) => {
    return api.post('/chatbot/request-representative', { supportRequestId });
  },
  // AI servisi ile doğrudan iletişim
  getChatbotResponse: (text, context = []) => {
    return aiApi.post('/chat', { text, context });
  }
};

// Destek talebi servisleri
export const supportService = {
  // Tüm destek taleplerini getir
  getRequests: async () => {
    try {
      return await axios.get(`${API_URL}/support-requests`);
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  },

  // Destek talebi detayını getir
  getRequestById: async (requestId) => {
    try {
      return await axios.get(`${API_URL}/support-requests/${requestId}`);
    } catch (error) {
      console.error('Error fetching request details:', error);
      throw error;
    }
  },

  // Destek talebi mesajlarını getir
  getMessages: async (requestId) => {
    try {
      return await axios.get(`${API_URL}/support-requests/${requestId}/messages`);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Yeni mesaj ekle
  addMessage: async (requestId, content) => {
    try {
      return await axios.post(`${API_URL}/support-requests/${requestId}/messages`, { content });
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Destek talebini kapat
  closeRequest: async (requestId) => {
    try {
      return await axios.put(`${API_URL}/support-requests/${requestId}/close`);
    } catch (error) {
      console.error('Error closing request:', error);
      throw error;
    }
  },

  // Kullanıcı bilgilerini getir
  getUserInfo: async () => {
    try {
      return await axios.get(`${API_URL}/users/me`);
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  },

  // Kullanıcı bilgilerini güncelle
  updateUserInfo: async (userData) => {
    try {
      return await axios.put(`${API_URL}/users/me`, userData);
    } catch (error) {
      console.error('Error updating user info:', error);
      throw error;
    }
  }
};

// Geri bildirim servisleri
export const feedbackService = {
  submitFeedback: (supportRequestId, rating, comment) => {
    return api.post('/feedback/submit', { supportRequestId, rating, comment });
  },
  getFeedbackByRequest: (requestId) => {
    return api.get(`/feedback/request/${requestId}`);
  },
  // AI servisi ile duygu analizi
  analyzeFeedback: (text) => {
    return aiApi.post('/analyze', { text });
  }
};

// Admin servisleri
export const adminService = {
  getAllUsers: () => {
    return api.get('/admin/users');
  },
  getRepresentatives: () => {
    return api.get('/admin/users/representatives');
  },
  getRequestAnalytics: () => {
    return api.get('/admin/analytics/requests');
  },
  getFeedbackAnalytics: () => {
    return api.get('/admin/analytics/feedback');
  },
  getRepresentativeAnalytics: () => {
    return api.get('/admin/analytics/representatives');
  }
};

export default api; 