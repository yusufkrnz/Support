import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Yapay zeka servisi
export const aiService = {
  // Chatbot yanıtı al
  getChatbotResponse: async (message) => {
    try {
      return await axios.post(`${API_URL}/ai/chatbot`, { message });
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      throw error;
    }
  },

  // Duygu analizi yap
  analyzeSentiment: async (text) => {
    try {
      return await axios.post(`${API_URL}/ai/sentiment`, { text });
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  },

  // Destek talebi için kategori önerisi al
  suggestCategory: async (text) => {
    try {
      return await axios.post(`${API_URL}/ai/suggest-category`, { text });
    } catch (error) {
      console.error('Error suggesting category:', error);
      throw error;
    }
  },

  // Destek talebi için özet oluştur
  generateSummary: async (requestId) => {
    try {
      return await axios.get(`${API_URL}/ai/summarize/${requestId}`);
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  },

  // Destek talebi için yanıt önerisi al
  suggestResponse: async (requestId, message) => {
    try {
      return await axios.post(`${API_URL}/ai/suggest-response`, { requestId, message });
    } catch (error) {
      console.error('Error suggesting response:', error);
      throw error;
    }
  }
};

export default aiService; 