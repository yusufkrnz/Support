import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Müşteri temsilcisi servisi
export const representativeService = {
  // Açık destek taleplerini getir
  getOpenRequests: async () => {
    try {
      return await axios.get(`${API_URL}/representative/requests/open`, { headers: getAuthHeader() });
    } catch (error) {
      console.error('Error fetching open requests:', error);
      throw error;
    }
  },

  // Temsilciye atanmış destek taleplerini getir
  getAssignedRequests: async (representativeId) => {
    try {
      return await axios.get(`${API_URL}/representative/${representativeId}/requests/assigned`, { headers: getAuthHeader() });
    } catch (error) {
      console.error('Error fetching assigned requests:', error);
      throw error;
    }
  },

  // Temsilcinin kapattığı destek taleplerini getir
  getClosedRequests: async (representativeId) => {
    try {
      return await axios.get(`${API_URL}/representative/${representativeId}/requests/closed`, { headers: getAuthHeader() });
    } catch (error) {
      console.error('Error fetching closed requests:', error);
      throw error;
    }
  },

  // Destek talebi detayını getir
  getRequestById: async (requestId) => {
    try {
      return await axios.get(`${API_URL}/representative/requests/${requestId}`, { headers: getAuthHeader() });
    } catch (error) {
      console.error('Error fetching request details:', error);
      throw error;
    }
  },

  // Destek talebi mesajlarını getir
  getRequestMessages: async (requestId) => {
    try {
      return await axios.get(`${API_URL}/representative/requests/${requestId}/messages`, { headers: getAuthHeader() });
    } catch (error) {
      console.error('Error fetching request messages:', error);
      throw error;
    }
  },

  // Yeni mesaj gönder
  sendMessage: async (requestId, content) => {
    try {
      return await axios.post(`${API_URL}/representative/requests/${requestId}/messages`, { content }, { headers: getAuthHeader() });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Destek talebini kapat
  closeRequest: async (requestId) => {
    try {
      return await axios.put(`${API_URL}/representative/requests/${requestId}/close`, {}, { headers: getAuthHeader() });
    } catch (error) {
      console.error('Error closing request:', error);
      throw error;
    }
  },

  // Destek talebini üstlen
  assignRequest: async (requestId, representativeId) => {
    try {
      return await axios.put(`${API_URL}/representative/requests/${requestId}/assign/${representativeId}`, {}, { headers: getAuthHeader() });
    } catch (error) {
      console.error('Error assigning request:', error);
      throw error;
    }
  },

  // Temsilci performans istatistiklerini getir
  getPerformanceStats: async (representativeId) => {
    try {
      return await axios.get(`${API_URL}/representatives/${representativeId}/performance`);
    } catch (error) {
      console.error('Error fetching performance stats:', error);
      throw error;
    }
  },

  // Temsilci profilini getir
  getProfile: async (representativeId) => {
    try {
      return await axios.get(`${API_URL}/representatives/${representativeId}`);
    } catch (error) {
      console.error('Error fetching representative profile:', error);
      throw error;
    }
  },

  // Temsilci profilini güncelle
  updateProfile: async (representativeId, profileData) => {
    try {
      return await axios.put(`${API_URL}/representatives/${representativeId}`, profileData);
    } catch (error) {
      console.error('Error updating representative profile:', error);
      throw error;
    }
  },

  // Destek aktivite verilerini getir (Ayşe için özel veri)
  getSupportActivity: async () => {
    try {
      // Gerçek API çağrısı
      // return await axios.get(`${API_URL}/representative/activity`, { headers: getAuthHeader() });
      
      // Mock veri - Ayşe için özel destek aktivite verileri
      const mockData = [];
      const today = new Date();
      
      // Son 365 gün için veri oluştur
      for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Tarih bilgisi
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const dayOfWeek = date.getDay(); // 0: Pazar, 1: Pazartesi, ...
        
        // Ayşe'nin çalışma düzeni:
        // - Hafta içi (1-5) daha yoğun çalışıyor
        // - Hafta sonları (0, 6) daha az çalışıyor veya hiç çalışmıyor
        // - Belirli günlerde (ayın 1'i, 15'i gibi) çok yoğun çalışıyor
        // - Belirli dönemlerde (yaz ayları, tatil dönemleri) daha az çalışıyor
        
        let count = 0;
        
        // Hafta sonu kontrolü
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Özel günler (ayın 1'i, 15'i gibi)
        const isSpecialDay = day === 1 || day === 15;
        
        // Yaz ayları (Haziran-Ağustos)
        const isSummerMonth = month >= 5 && month <= 7;
        
        // Kış ayları (Aralık-Şubat)
        const isWinterMonth = month === 11 || month === 0 || month === 1;
        
        // Tatil dönemleri (Ocak 1, Nisan 23, Mayıs 19, Ağustos 30, Ekim 29, vb.)
        const isHoliday = (month === 0 && day === 1) || // Yılbaşı
                          (month === 3 && day === 23) || // 23 Nisan
                          (month === 4 && day === 19) || // 19 Mayıs
                          (month === 7 && day === 30) || // 30 Ağustos
                          (month === 9 && day === 29);   // 29 Ekim
        
        // Destek sayısını belirle
        if (isHoliday) {
          // Tatil günlerinde çalışmıyor
          count = 0;
        } else if (isWeekend) {
          // Hafta sonları az çalışıyor
          if (Math.random() < 0.7) { // %70 ihtimalle çalışmıyor
            count = 0;
          } else {
            count = Math.floor(Math.random() * 3); // 0-2 arası destek
          }
        } else if (isSpecialDay) {
          // Özel günlerde çok yoğun çalışıyor
          count = 8 + Math.floor(Math.random() * 5); // 8-12 arası destek
        } else if (isSummerMonth) {
          // Yaz aylarında daha az çalışıyor
          count = Math.floor(Math.random() * 5); // 0-4 arası destek
        } else if (isWinterMonth) {
          // Kış aylarında daha yoğun çalışıyor
          count = 3 + Math.floor(Math.random() * 6); // 3-8 arası destek
        } else {
          // Normal günlerde ortalama çalışıyor
          count = 2 + Math.floor(Math.random() * 6); // 2-7 arası destek
        }
        
        // Ayşe'nin performans artışı (son 3 ay)
        if (i < 90) {
          // Son 3 ayda performans artışı
          count = Math.min(12, Math.floor(count * 1.5)); // %50 artış, maksimum 12
        }
        
        // Belirli günlerde özel durumlar
        
        // Ayşe'nin doğum günü (15 Mart)
        if (month === 2 && day === 15) {
          count = 0; // İzin günü
        }
        
        // Ayşe'nin yıllık izni (Temmuz'un ilk haftası)
        if (month === 6 && day >= 1 && day <= 7) {
          count = 0; // Yıllık izin
        }
        
        // Ayşe'nin hastalık izni (Şubat'ın son haftası)
        if (month === 1 && day >= 22 && day <= 28) {
          count = 0; // Hastalık izni
        }
        
        // Ayşe'nin eğitim günleri (her ayın son Cuma günü)
        if (day >= 25 && day <= 31 && dayOfWeek === 5) {
          count = 1; // Eğitim günü (sadece acil durumlar)
        }
        
        // Özel kampanya dönemleri (Black Friday - Kasım son haftası)
        if (month === 10 && day >= 25) {
          count = 10 + Math.floor(Math.random() * 3); // 10-12 arası destek
        }
        
        // Yılbaşı öncesi yoğunluk (Aralık 15-31)
        if (month === 11 && day >= 15) {
          count = 8 + Math.floor(Math.random() * 5); // 8-12 arası destek
        }
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          count: count
        });
      }
      
      return { data: mockData };
    } catch (error) {
      console.error('Error fetching support activity:', error);
      throw error;
    }
  }
};

export default representativeService; 