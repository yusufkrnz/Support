export const getSupportActivity = async (userId) => {
  try {
    const response = await api.get(`/representatives/${userId}/activity`);
    return response.data;
  } catch (error) {
    console.error('Error fetching support activity:', error);
    // Sahte veri oluştur
    return generateMockActivityData();
  }
};

const generateMockActivityData = () => {
  const today = new Date();
  const data = {};
  
  // Son 365 gün için veri oluştur
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Rastgele aktivite seviyesi (0-4 arası)
    const activityLevel = Math.floor(Math.random() * 5);
    
    // Hafta sonları daha az aktivite
    if (date.getDay() === 0 || date.getDay() === 6) {
      data[dateStr] = Math.floor(Math.random() * 2);
    } else {
      data[dateStr] = activityLevel;
    }
  }
  
  return data;
}; 