import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Admin servisi
export const adminService = {
  // Tüm kullanıcıları getir
  getAllUsers: async () => {
    try {
      return await axios.get(`${API_URL}/admin/users`);
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  // Kullanıcı detayını getir
  getUserById: async (userId) => {
    try {
      return await axios.get(`${API_URL}/admin/users/${userId}`);
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },

  // Yeni kullanıcı oluştur
  createUser: async (userData) => {
    try {
      return await axios.post(`${API_URL}/admin/users`, userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Kullanıcı bilgilerini güncelle
  updateUser: async (userId, userData) => {
    try {
      return await axios.put(`${API_URL}/admin/users/${userId}`, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Kullanıcıyı sil
  deleteUser: async (userId) => {
    try {
      return await axios.delete(`${API_URL}/admin/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Tüm destek taleplerini getir
  getAllRequests: async () => {
    try {
      return await axios.get(`${API_URL}/admin/support-requests`);
    } catch (error) {
      console.error('Error fetching all requests:', error);
      throw error;
    }
  },

  // Destek talebi istatistiklerini getir
  getRequestStats: async () => {
    try {
      return await axios.get(`${API_URL}/admin/stats/requests`);
    } catch (error) {
      console.error('Error fetching request stats:', error);
      throw error;
    }
  },

  // Geri bildirim istatistiklerini getir
  getFeedbackStats: async () => {
    try {
      return await axios.get(`${API_URL}/admin/stats/feedback`);
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      throw error;
    }
  },

  // Temsilci performans istatistiklerini getir
  getRepresentativeStats: async () => {
    try {
      return await axios.get(`${API_URL}/admin/stats/representatives`);
    } catch (error) {
      console.error('Error fetching representative stats:', error);
      throw error;
    }
  },

  // Sistem ayarlarını getir
  getSystemSettings: async () => {
    try {
      return await axios.get(`${API_URL}/admin/settings`);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  },

  // Sistem ayarlarını güncelle
  updateSystemSettings: async (settingsData) => {
    try {
      return await axios.put(`${API_URL}/admin/settings`, settingsData);
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }
};

export default adminService; 