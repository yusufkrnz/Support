import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Müşteri servisi
export const customerService = {
  // Müşterinin kendi destek taleplerini getir
  getMyRequests: async (customerId) => {
    try {
      return await axios.get(`${API_URL}/customers/${customerId}/requests`);
    } catch (error) {
      console.error('Error fetching customer requests:', error);
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
  getRequestMessages: async (requestId) => {
    try {
      return await axios.get(`${API_URL}/support-requests/${requestId}/messages`);
    } catch (error) {
      console.error('Error fetching request messages:', error);
      throw error;
    }
  },

  // Yeni mesaj gönder
  sendMessage: async (requestId, content) => {
    try {
      return await axios.post(`${API_URL}/support-requests/${requestId}/messages`, { content });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Yeni destek talebi oluştur
  createRequest: async (requestData) => {
    try {
      return await axios.post(`${API_URL}/support-requests`, requestData);
    } catch (error) {
      console.error('Error creating support request:', error);
      throw error;
    }
  },

  // Destek talebine geri bildirim gönder
  submitFeedback: async (requestId, feedbackData) => {
    try {
      return await axios.post(`${API_URL}/support-requests/${requestId}/feedback`, feedbackData);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  // Müşteri profilini getir
  getProfile: async (customerId) => {
    try {
      return await axios.get(`${API_URL}/customers/${customerId}`);
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      throw error;
    }
  },

  // Müşteri profilini güncelle
  updateProfile: async (customerId, profileData) => {
    try {
      return await axios.put(`${API_URL}/customers/${customerId}`, profileData);
    } catch (error) {
      console.error('Error updating customer profile:', error);
      throw error;
    }
  }
};

export default customerService; 