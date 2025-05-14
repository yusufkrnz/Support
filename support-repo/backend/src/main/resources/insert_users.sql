-- Manual user insertion script
-- Run this directly against your MySQL database if needed

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS destek_support CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE destek_support;

-- Reset tables if they exist
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS companies;

-- Create tables
CREATE TABLE companies (
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

CREATE TABLE users (
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

CREATE TABLE tickets (
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

CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ticket_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Insert companies
INSERT INTO companies (name, email, phone, address, website)
VALUES
('Atasun Optik', 'info@atasun.com', '08502229999', 'İstanbul, Türkiye', 'www.atasun.com'),
('BİM Marketler', 'info@bim.com.tr', '08509999999', 'İstanbul, Türkiye', 'www.bim.com.tr'),
('Demo Şirket', 'info@demosirket.com', '05551234567', 'Ankara, Türkiye', 'www.demosirket.com');

-- Insert users with password 'password123' (BCrypt hashed)
INSERT INTO users (username, email, password, full_name, phone, role_id, company_id, active, address, city, country, department, permissions)
VALUES
-- Admin users
('admin1', 'admin@atasun.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Atasun Admin', '05551112233', 1, 1, 1, 'Beyoğlu', 'İstanbul', 'Türkiye', 'Yönetim', '{"can_manage_users":true,"can_view_reports":true}'),
('admin2', 'admin@bim.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'BİM Admin', '05552223344', 1, 2, 1, 'Şişli', 'İstanbul', 'Türkiye', 'Yönetim', '{"can_manage_users":true,"can_view_reports":true}'),
('superadmin', 'superadmin@support.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Sistem Yöneticisi', '05553334455', 4, NULL, 1, 'Merkez', 'İstanbul', 'Türkiye', 'IT', '{"can_manage_users":true,"can_manage_system":true,"can_view_reports":true}'),

-- Customer users
('customer1', 'customer1@example.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Ahmet Yılmaz', '05554443322', 2, 1, 1, 'Kadıköy', 'İstanbul', 'Türkiye', NULL, NULL),
('customer2', 'customer2@example.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Ayşe Demir', '05555554433', 2, 1, 1, 'Ataşehir', 'İstanbul', 'Türkiye', NULL, NULL),
('customer3', 'customer3@example.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Mehmet Öz', '05556665544', 2, 2, 1, 'Beşiktaş', 'İstanbul', 'Türkiye', NULL, NULL),
('customer4', 'customer4@example.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Zeynep Kaya', '05557776655', 2, 2, 1, 'Maltepe', 'İstanbul', 'Türkiye', NULL, NULL),

-- Manager users
('manager1', 'manager1@atasun.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Murat Şahin', '05558887766', 3, 1, 1, 'Üsküdar', 'İstanbul', 'Türkiye', 'Müşteri Hizmetleri', '{"can_resolve_complaints":true}'),
('manager2', 'manager2@bim.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Seda Yıldız', '05559998877', 3, 2, 1, 'Kağıthane', 'İstanbul', 'Türkiye', 'Müşteri Hizmetleri', '{"can_resolve_complaints":true}'),

-- System users
('admin', 'admin@support.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Admin Kullanıcı', '5551112233', 1, 1),
('customer', 'customer@support.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Demo Müşteri', '5554443322', 2, 1),
('manager', 'manager@support.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Demo Yönetici', '5552223344', 3, 1);

-- Insert tickets
INSERT INTO tickets (subject, description, status, priority, customer_id, assigned_to, company_id)
VALUES
('Sipariş teslimatı gecikti', 'Verdiğim sipariş 5 gündür gelmedi, ne zaman gelecek?', 'OPEN', 'MEDIUM', 4, 8, 1),
('Ürün arızalı geldi', 'Aldığım gözlükte çizikler var, değişim istiyorum.', 'IN_PROGRESS', 'HIGH', 5, 8, 1),
('Fatura sorunu', 'Faturamda yanlış bilgiler var, düzeltilmesini istiyorum.', 'WAITING', 'LOW', 6, 9, 2),
('İade talebi', 'Ürünü iade etmek istiyorum, paramı geri alabilir miyim?', 'OPEN', 'MEDIUM', 7, NULL, 2);

-- Insert messages
INSERT INTO messages (ticket_id, sender_id, content, is_read)
VALUES
(1, 4, 'Merhaba, siparişim 5 gündür gelmedi. Takip numarası: TR123456. Ne zaman gelecek acaba?', 1),
(1, 8, 'Merhaba, siparişinizi kontrol ediyorum. En kısa sürede dönüş yapacağım.', 1),
(2, 5, 'Aldığım gözlükte çizikler var. Faturamın fotoğrafını ve ürünün fotoğraflarını ekte gönderiyorum.', 1),
(2, 8, 'Merhaba, fotoğrafları inceledim. Değişim işlemi için en yakın mağazamıza gelebilirsiniz.', 0),
(3, 6, 'Faturamda adresim yanlış yazılmış. Doğru adresim: Beşiktaş/İstanbul', 1),
(4, 7, 'Aldığım ürünü iade etmek istiyorum. Henüz kullanmadım, kutusu da duruyor.', 0); 