-- Temel kullanıcı tablosu
CREATE TABLE IF NOT EXISTS base_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  user_type VARCHAR(20) NOT NULL,
  company_id BIGINT NULL
);

-- Şirketler tablosu
CREATE TABLE IF NOT EXISTS companies (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  address VARCHAR(255),
  website VARCHAR(100),
  logo_url VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foreign key bağlantısı
ALTER TABLE base_user 
ADD CONSTRAINT FK_USER_COMPANY 
FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- Müşteri tablosu
CREATE TABLE IF NOT EXISTS customer (
  id BIGINT PRIMARY KEY,
  address VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  loyalty_points INT DEFAULT 0,
  FOREIGN KEY (id) REFERENCES base_user(id)
);

-- Admin tablosu
CREATE TABLE IF NOT EXISTS admin (
  id BIGINT PRIMARY KEY,
  admin_level VARCHAR(50),
  can_manage_users BOOLEAN DEFAULT FALSE,
  can_manage_system BOOLEAN DEFAULT FALSE,
  can_view_reports BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (id) REFERENCES base_user(id)
);

-- Yönetici tablosu
CREATE TABLE IF NOT EXISTS manager (
  id BIGINT PRIMARY KEY,
  department VARCHAR(100),
  title VARCHAR(100),
  can_approve_returns BOOLEAN DEFAULT FALSE,
  can_resolve_complaints BOOLEAN DEFAULT FALSE,
  max_approval_amount DECIMAL(10,2),
  FOREIGN KEY (id) REFERENCES base_user(id)
);

-- Super Admin tablosu
CREATE TABLE IF NOT EXISTS super_admin (
  id BIGINT PRIMARY KEY,
  FOREIGN KEY (id) REFERENCES base_user(id)
);

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role_id INT NOT NULL,  -- 1=ADMIN, 2=CUSTOMER, 3=MANAGER, 4=SUPER_ADMIN
  company_id BIGINT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  profile_picture VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  department VARCHAR(100),
  permissions VARCHAR(1000),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

-- Destek Talepleri tablosu
CREATE TABLE IF NOT EXISTS tickets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL, -- OPEN, IN_PROGRESS, WAITING, RESOLVED, CLOSED
  priority VARCHAR(20), -- LOW, MEDIUM, HIGH, URGENT
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  closed_at TIMESTAMP NULL,
  customer_id BIGINT NOT NULL,
  assigned_to BIGINT,
  company_id BIGINT,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Mesajlar tablosu
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ticket_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id)
); 