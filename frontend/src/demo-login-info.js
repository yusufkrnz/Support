// Demo giriş bilgileri
const demoLoginInfo = {
  users: [
    {
      role: 'Admin',
      email: 'admin@support.com',
      password: 'password123',
      company: 'BIM'
    },
    {
      role: 'Yönetici',
      email: 'manager@support.com',
      password: 'password123',
      company: 'BIM'
    },
    {
      role: 'Müşteri',
      email: 'customer@support.com',
      password: 'password123',
      company: 'BIM'
    }
  ],
  loginInstructions: `
    # Giriş Bilgileri
    
    Aşağıdaki kullanıcı bilgileriyle sisteme giriş yapabilirsiniz:
    
    ## Admin Kullanıcısı
    - E-posta: admin@support.com
    - Şifre: password123
    
    ## Yönetici Kullanıcısı
    - E-posta: manager@support.com
    - Şifre: password123
    
    ## Müşteri Kullanıcısı
    - E-posta: customer@support.com
    - Şifre: password123
    
    *Not:* Tüm kullanıcılar için şifre 'password123' olarak belirlenmiştir.
  `
};

export default demoLoginInfo; 