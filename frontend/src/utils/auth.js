// Token ve kullanıcı bilgilerini localStorage'da saklama
const TOKEN_KEY = 'auth_token';
const USER_INFO = 'user_info';

// Token işlemleri
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Kullanıcı bilgileri işlemleri
export const setUserInfo = (userInfo) => {
  localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem(USER_INFO);
  return userInfo ? JSON.parse(userInfo) : null;
};

export const removeUserInfo = () => {
  localStorage.removeItem(USER_INFO);
};

// Kimlik doğrulama durumu kontrolü
export const isAuthenticated = () => {
  return !!getToken();
};

// Kullanıcı rolünü al
export const getUserRole = () => {
  const userInfo = getUserInfo();
  return userInfo ? userInfo.role : null;
};

// Giriş işlemi
export const login = (token, userInfo) => {
  setToken(token);
  setUserInfo(userInfo);
};

// Çıkış işlemi
export const logout = () => {
  removeToken();
  removeUserInfo();
};

// Mock kimlik doğrulama (gerçek API olmadığında kullanılır)
export const mockAuthenticate = (email, password) => {
  // Demo kullanıcılar
  const users = [
    { 
      email: 'admin@example.com', 
      password: 'admin123', 
      fullName: 'Admin User', 
      role: 'ADMIN' 
    },
    { 
      email: 'rep@example.com', 
      password: 'rep123', 
      fullName: 'Ayşe Yılmaz', 
      role: 'REPRESENTATIVE' 
    },
    { 
      email: 'customer@example.com', 
      password: 'customer123', 
      fullName: 'Mehmet Demir', 
      role: 'CUSTOMER' 
    }
  ];
  
  // Kullanıcıyı bul
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Gerçek bir token yerine basit bir string
    const mockToken = `mock_token_${Date.now()}_${user.role}`;
    
    // Şifreyi hariç tut
    const { password, ...userInfo } = user;
    
    return { token: mockToken, userInfo };
  }
  
  return null;
};

// Auth header'ı oluştur
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Kullanıcının rolünü kontrol et
export const hasRole = (role) => {
  const userInfo = getUserInfo();
  return userInfo && userInfo.role === role;
};