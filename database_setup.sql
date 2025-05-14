-- Database oluşturma
CREATE DATABASE IF NOT EXISTS support_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE support_db;

-- Companies tablosu
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users tablosu
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role_id INT NOT NULL,
    company_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    department VARCHAR(100),
    permissions TEXT,
    CONSTRAINT fk_user_company FOREIGN KEY (company_id) REFERENCES companies(id),
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat Session tablosu
CREATE TABLE IF NOT EXISTS chat_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, CLOSED, TRANSFERRED
    category VARCHAR(50), -- GENERAL, RETURN, COMPLAINT
    meta_data TEXT, -- JSON formatında ekstra bilgiler
    form_data TEXT, -- Toplanan form verileri JSON formatında
    ai_flow_state VARCHAR(50), -- AI flow durumu: INITIAL, COLLECTING_INFO, PROCESSING, FINALIZED
    CONSTRAINT fk_chat_session_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_session_id (session_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat Messages tablosu
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    sender_type ENUM('USER', 'BOT', 'MANAGER') NOT NULL,
    sender_id BIGINT, -- Kullanıcı/yönetici ID'si (bot mesajı ise NULL)
    message TEXT NOT NULL,
    message_hash VARCHAR(128), -- Mesaj içeriğinin hash değeri
    compressed_message MEDIUMBLOB, -- Sıkıştırılmış mesaj içeriği (boyutu küçültmek için)
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_type VARCHAR(20) DEFAULT 'TEXT', -- TEXT, FORM, IMAGE, FILE
    processed BOOLEAN DEFAULT FALSE, -- AI tarafından işlenip işlenmediği
    response_to BIGINT, -- Yanıt verilen mesajın ID'si
    meta_data TEXT, -- JSON formatında ekstra bilgiler
    ai_response_type VARCHAR(50), -- GENERAL, RETURN, COMPLAINT, PRODUCT_QUERY vb.
    ai_confidence_score DECIMAL(5,4), -- AI'nın cevabına olan güveni (0.0-1.0)
    CONSTRAINT fk_chat_message_session FOREIGN KEY (session_id) REFERENCES chat_sessions(id),
    CONSTRAINT fk_chat_message_user FOREIGN KEY (sender_id) REFERENCES users(id),
    INDEX idx_session_id (session_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_message_hash (message_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat Analytics tablosu - Müşteri ve Temsilci mesajlaşmalarının analizi için
CREATE TABLE IF NOT EXISTS chat_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    manager_id BIGINT NOT NULL,
    conversation_hash VARCHAR(128) NOT NULL, -- Tüm konuşmanın özeti/hash değeri
    compressed_conversation MEDIUMBLOB, -- Sıkıştırılmış tam konuşma
    session_start TIMESTAMP NOT NULL,
    session_end TIMESTAMP NOT NULL,
    message_count INT DEFAULT 0,
    resolution_status VARCHAR(50), -- RESOLVED, TRANSFERRED, ABANDONED
    sentiment_score DECIMAL(3,2), -- Duygu analizi skoru (-1.0 ile 1.0 arası)
    topic_tags TEXT, -- Konuşma konuları (JSON formatında)
    resolution_time_seconds INT, -- Çözüm süresi (saniye)
    satisfaction_rating INT, -- Müşteri memnuniyet puanı (1-5)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analytics_session FOREIGN KEY (session_id) REFERENCES chat_sessions(id),
    CONSTRAINT fk_analytics_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    CONSTRAINT fk_analytics_manager FOREIGN KEY (manager_id) REFERENCES users(id),
    INDEX idx_conversation_hash (conversation_hash),
    INDEX idx_customer_id (customer_id),
    INDEX idx_manager_id (manager_id),
    INDEX idx_session_start (session_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Support Tickets tablosu
CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, CLOSED, WAITING
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    category VARCHAR(50),
    customer_id BIGINT NOT NULL,
    assigned_to BIGINT,
    company_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    wait_reason VARCHAR(255),
    CONSTRAINT fk_ticket_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    CONSTRAINT fk_ticket_assigned FOREIGN KEY (assigned_to) REFERENCES users(id),
    CONSTRAINT fk_ticket_company FOREIGN KEY (company_id) REFERENCES companies(id),
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_customer_id (customer_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Complaints tablosu
CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tracking_id VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    unit VARCHAR(100) NOT NULL, -- Şikayet birimi (kasiyer, hizmet, ürün vb.)
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'RECEIVED', -- RECEIVED, PROCESSING, RESOLVED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_response_hours INT,
    ai_priority INT, -- 1-Düşük, 2-Orta, 3-Yüksek
    is_resolved BOOLEAN DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_complaint_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_tracking_id (tracking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Complaint Tags tablosu
CREATE TABLE IF NOT EXISTS complaint_tags (
    complaint_id BIGINT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (complaint_id, tag),
    CONSTRAINT fk_tag_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Orders tablosu
CREATE TABLE IF NOT EXISTS user_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_order_number (order_number),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items tablosu
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES user_orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Örnek veri ekleme
INSERT INTO companies (name, email, phone, address, website) 
VALUES 
('Atasun Optik', 'info@atasun.com', '08502229999', 'İstanbul, Türkiye', 'www.atasun.com'),
('BİM Marketler', 'info@bim.com.tr', '08509999999', 'İstanbul, Türkiye', 'www.bim.com.tr'),
('Demo Şirket', 'info@demosirket.com', '05551234567', 'Ankara, Türkiye', 'www.demosirket.com');

-- Kullanıcı verileri (şifre: password123 - BCrypt şifreli)
INSERT INTO users (username, email, password, full_name, phone, role_id, company_id, active, address, city, country, department, permissions) 
VALUES 
-- Admin kullanıcılar
('admin1', 'admin@atasun.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Atasun Admin', '05551112233', 1, 1, 1, 'Beyoğlu', 'İstanbul', 'Türkiye', 'Yönetim', '{"can_manage_users":true,"can_view_reports":true}'),
('admin2', 'admin@bim.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'BİM Admin', '05552223344', 1, 2, 1, 'Şişli', 'İstanbul', 'Türkiye', 'Yönetim', '{"can_manage_users":true,"can_view_reports":true}'),
('superadmin', 'superadmin@support.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Sistem Yöneticisi', '05553334455', 4, NULL, 1, 'Merkez', 'İstanbul', 'Türkiye', 'IT', '{"can_manage_users":true,"can_manage_system":true,"can_view_reports":true}'),

-- Müşteri kullanıcılar
('customer1', 'customer1@example.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Ahmet Yılmaz', '05554443322', 2, 1, 1, 'Kadıköy', 'İstanbul', 'Türkiye', NULL, NULL),
('customer2', 'customer2@example.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Ayşe Demir', '05555554433', 2, 1, 1, 'Ataşehir', 'İstanbul', 'Türkiye', NULL, NULL),
('customer3', 'customer3@example.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Mehmet Kaya', '05556665544', 2, 2, 1, 'Bağcılar', 'İstanbul', 'Türkiye', NULL, NULL),

-- Müşteri temsilcileri
('manager1', 'rep1@atasun.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Zeynep Şahin', '05557776655', 3, 1, 1, 'Levent', 'İstanbul', 'Türkiye', 'Müşteri Hizmetleri', '{"can_handle_tickets":true}'),
('manager2', 'rep2@bim.com', '$2a$10$6zRWMgxUEfIpNvjxQrX2sOQOUL8L4vCLMkX3sUerAB5jZ0WYM9tKa', 'Ali Yıldız', '05558887766', 3, 2, 1, 'Maltepe', 'İstanbul', 'Türkiye', 'Müşteri Hizmetleri', '{"can_handle_tickets":true}');

-- Örnek sipariş verileri
INSERT INTO user_orders (order_number, user_id, total_amount, order_date, status)
VALUES
('ORD-2023051001', 4, 750.90, '2023-05-10 14:30:00', 'DELIVERED'),
('ORD-2023060502', 5, 129.50, '2023-06-05 10:15:00', 'DELIVERED'),
('ORD-2023072203', 6, 459.99, '2023-07-22 16:45:00', 'SHIPPED'),
('ORD-2023081504', 4, 1250.75, '2023-08-15 12:00:00', 'PENDING');

-- Örnek sipariş kalemleri
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
VALUES
(1, 'Ray-Ban Güneş Gözlüğü', 1, 750.90),
(2, 'Ekmek', 5, 5.99),
(2, 'Süt', 2, 24.90),
(2, 'Peynir', 1, 59.90),
(3, 'Kahve Makinesi', 1, 459.99),
(4, 'Çerçeve Gözlük', 2, 625.50);

-- Örnek ticket verileri
INSERT INTO tickets (ticket_number, subject, description, status, priority, category, customer_id, assigned_to, company_id, created_at, last_updated)
VALUES
('TKT-20230601001', 'Gözlük çerçevesi sorunu', 'Aldığım gözlük çerçevesi çok gevşek, sürekli düşüyor.', 'CLOSED', 'MEDIUM', 'PRODUCT', 4, 7, 1, '2023-06-01 10:15:00', '2023-06-05 14:30:00'),
('TKT-20230715002', 'Yanlış ürün teslimi', 'Sipariş ettiğim ürünler yerine başka ürünler geldi.', 'CLOSED', 'HIGH', 'DELIVERY', 5, 8, 2, '2023-07-15 16:20:00', '2023-07-18 09:45:00'),
('TKT-20230820003', 'İndirim kuponu çalışmıyor', 'Gönderdiğiniz indirim kuponu online alışverişte çalışmıyor.', 'CLOSED', 'LOW', 'WEBSITE', 6, 7, 1, '2023-08-20 12:10:00', '2023-08-22 11:30:00'),
('TKT-20230925004', 'Ürün iade talebi', 'Aldığım gözlüğü iade etmek istiyorum, ödeme iadesi nasıl olacak?', 'IN_PROGRESS', 'MEDIUM', 'RETURN', 4, 8, 1, '2023-09-25 14:40:00', '2023-09-26 10:20:00'),
('TKT-20231010005', 'Fatura düzeltme talebi', 'Faturamda şirket bilgilerim eksik görünüyor, düzeltme yapılabilir mi?', 'OPEN', 'LOW', 'BILLING', 5, NULL, 2, '2023-10-10 09:30:00', '2023-10-10 09:30:00');

-- Örnek şikayet verileri
INSERT INTO complaints (tracking_id, company_name, title, unit, description, status, created_at, estimated_response_hours, ai_priority, is_resolved, user_id)
VALUES
('ATS-12345', 'Atasun Optik', 'Hasarlı ürün teslimi', 'Ürün', 'Satın aldığım gözlük kutusu hasarlı ve çizik geldi.', 'RESOLVED', '2023-07-05 11:25:00', 24, 2, TRUE, 4),
('BIM-67890', 'BİM Marketler', 'Kasiyerin kaba davranışı', 'Personel', 'Kasada görevli personel çok kaba davrandı ve yardımcı olmadı.', 'PROCESSING', '2023-08-20 16:40:00', 48, 3, FALSE, 5),
('ATS-23456', 'Atasun Optik', 'Yanlış numara teslimi', 'Ürün', 'Sipariş ettiğim gözlük camının numarası yanlış çıktı.', 'RECEIVED', '2023-09-15 10:10:00', 72, 2, FALSE, 6),
('BIM-78901', 'BİM Marketler', 'Son kullanma tarihi geçmiş ürün', 'Ürün', 'Aldığım süt ürünleri son kullanma tarihi geçmiş çıktı.', 'RESOLVED', '2023-10-25 14:35:00', 24, 3, TRUE, 4),
('ATS-34567', 'Atasun Optik', 'Web sitesi ödeme sorunu', 'Web Sitesi', 'Online alışveriş yaparken ödeme aşamasında sürekli hata alıyorum.', 'PROCESSING', '2023-11-10 09:20:00', 48, 1, FALSE, 5);

-- Örnek şikayet etiketleri
INSERT INTO complaint_tags (complaint_id, tag)
VALUES
(1, 'hasarlı'),
(1, 'ürün_kalitesi'),
(1, 'kargo'),
(2, 'personel'),
(2, 'müşteri_hizmetleri'),
(2, 'davranış'),
(3, 'yanlış_sipariş'),
(3, 'optik'),
(3, 'kalite_kontrol'),
(4, 'gıda_güvenliği'),
(4, 'son_kullanma'),
(4, 'süt_ürünleri'),
(5, 'web_sitesi'),
(5, 'ödeme_sistemi'),
(5, 'teknik_sorun');

-- Örnek chat session verileri (yeni eklenen alanlarla)
INSERT INTO chat_sessions (session_id, user_id, started_at, last_active, status, category, meta_data, form_data, ai_flow_state)
VALUES
('session-2023091001', 4, '2023-09-10 09:30:00', '2023-09-10 09:45:00', 'CLOSED', 'GENERAL', '{"browser":"Chrome","device":"Desktop"}', NULL, 'FINALIZED'),
('session-2023100502', 5, '2023-10-05 14:20:00', '2023-10-05 14:50:00', 'CLOSED', 'COMPLAINT', '{"browser":"Safari","device":"Mobile"}', '{"company":"Atasun","complaintType":"Ürün","details":"Aldığım gözlük çizik çıktı"}', 'FINALIZED'),
('session-2023110203', 6, '2023-11-02 11:10:00', '2023-11-02 11:25:00', 'CLOSED', 'RETURN', '{"browser":"Firefox","device":"Desktop"}', '{"orderNumber":"ORD-2023072203","reason":"Beklediğim gibi değildi","returnAddress":"Bağcılar, İstanbul"}', 'FINALIZED'),
('session-2023120104', 4, '2023-12-01 16:05:00', '2023-12-01 16:40:00', 'ACTIVE', 'GENERAL', '{"browser":"Edge","device":"Tablet"}', NULL, 'INITIAL'),
('session-2024010505', 5, '2024-01-05 10:15:00', NOW(), 'ACTIVE', 'RETURN', '{"browser":"Chrome","device":"Mobile"}', '{"orderNumber":"ORD-2023060502","reason":"Ürün hasarlı geldi"}', 'COLLECTING_INFO'),
('session-2023110506', 4, '2023-11-05 13:10:00', '2023-11-05 13:35:00', 'CLOSED', 'GENERAL', '{"browser":"Chrome","device":"Desktop"}', NULL, 'FINALIZED'),
('session-2023112207', 5, '2023-11-22 09:45:00', '2023-11-22 10:15:00', 'CLOSED', 'GENERAL', '{"browser":"Firefox","device":"Mobile"}', NULL, 'FINALIZED');

-- Örnek chat mesajları (yeni eklenen alanlarla)
INSERT INTO chat_messages (session_id, sender_type, sender_id, message, sent_at, message_type, processed, message_hash, ai_response_type, ai_confidence_score)
VALUES
-- Session 1 (GENERAL)
(1, 'USER', 4, 'Merhaba, bir sorum olacaktı.', '2023-09-10 09:30:00', 'TEXT', TRUE, SHA2('Merhaba, bir sorum olacaktı.', 256), NULL, NULL),
(1, 'BOT', NULL, 'Merhaba! Size nasıl yardımcı olabilirim?', '2023-09-10 09:30:05', 'TEXT', TRUE, SHA2('Merhaba! Size nasıl yardımcı olabilirim?', 256), 'GREETING', 0.9800),
(1, 'USER', 4, 'Gözlük camlarını nasıl temizleyebilirim?', '2023-09-10 09:31:00', 'TEXT', TRUE, SHA2('Gözlük camlarını nasıl temizleyebilirim?', 256), NULL, NULL),
(1, 'BOT', NULL, 'Gözlük camlarınızı temizlemek için mikrofiber bez ve özel gözlük spreyi kullanabilirsiniz. Kuru bezle silmek çizilmelere yol açabilir.', '2023-09-10 09:31:10', 'TEXT', TRUE, SHA2('Gözlük camlarınızı temizlemek için mikrofiber bez ve özel gözlük spreyi kullanabilirsiniz. Kuru bezle silmek çizilmelere yol açabilir.', 256), 'GENERAL', 0.8900),

-- Session 2 (COMPLAINT)
(2, 'USER', 5, 'Aldığım gözlük hasarlı geldi, şikayette bulunmak istiyorum.', '2023-10-05 14:20:00', 'TEXT', TRUE, SHA2('Aldığım gözlük hasarlı geldi, şikayette bulunmak istiyorum.', 256), NULL, NULL),
(2, 'BOT', NULL, 'Üzgünüm bunu duymak. Şikayet formunu doldurmanıza yardımcı olabilirim. Lütfen şirket ve şikayet türü bilgisini paylaşın.', '2023-10-05 14:20:10', 'TEXT', TRUE, SHA2('Üzgünüm bunu duymak. Şikayet formunu doldurmanıza yardımcı olabilirim. Lütfen şirket ve şikayet türü bilgisini paylaşın.', 256), 'COMPLAINT', 0.9500),
(2, 'USER', 5, 'Atasun\'dan aldım, ürün hasarlıydı.', '2023-10-05 14:21:00', 'TEXT', TRUE, SHA2('Atasun\'dan aldım, ürün hasarlıydı.', 256), NULL, NULL),
(2, 'BOT', NULL, 'Teşekkürler. Lütfen aşağıdaki şikayet formunu doldurun:', '2023-10-05 14:21:10', 'FORM', TRUE, SHA2('Teşekkürler. Lütfen aşağıdaki şikayet formunu doldurun:', 256), 'COMPLAINT_FORM', 0.9700),
(2, 'USER', 5, '{"company":"Atasun","complaintType":"Ürün","details":"Aldığım gözlük çizik çıktı"}', '2023-10-05 14:30:00', 'FORM', TRUE, SHA2('{"company":"Atasun","complaintType":"Ürün","details":"Aldığım gözlük çizik çıktı"}', 256), NULL, NULL),
(2, 'BOT', NULL, 'Şikayetiniz başarıyla alınmıştır. Takip numaranız: ATS-87654. En kısa sürede size dönüş yapılacaktır.', '2023-10-05 14:30:10', 'TEXT', TRUE, SHA2('Şikayetiniz başarıyla alınmıştır. Takip numaranız: ATS-87654. En kısa sürede size dönüş yapılacaktır.', 256), 'COMPLAINT_CONFIRMATION', 0.9800),

-- Session 3 (RETURN)
(3, 'USER', 6, 'Ürün iade etmek istiyorum', '2023-11-02 11:10:00', 'TEXT', TRUE, SHA2('Ürün iade etmek istiyorum', 256), NULL, NULL),
(3, 'BOT', NULL, 'İade işleminiz için yardımcı olabilirim. Lütfen sipariş numaranızı paylaşır mısınız?', '2023-11-02 11:10:10', 'TEXT', TRUE, SHA2('İade işleminiz için yardımcı olabilirim. Lütfen sipariş numaranızı paylaşır mısınız?', 256), 'RETURN', 0.9300),
(3, 'USER', 6, 'ORD-2023072203', '2023-11-02 11:11:00', 'TEXT', TRUE, SHA2('ORD-2023072203', 256), NULL, NULL),
(3, 'BOT', NULL, 'Teşekkürler. İade sebebinizi öğrenebilir miyim?', '2023-11-02 11:11:10', 'TEXT', TRUE, SHA2('Teşekkürler. İade sebebinizi öğrenebilir miyim?', 256), 'RETURN_REASON', 0.9600),
(3, 'USER', 6, 'Beklediğim gibi değildi, beğenmedim', '2023-11-02 11:12:00', 'TEXT', TRUE, SHA2('Beklediğim gibi değildi, beğenmedim', 256), NULL, NULL),
(3, 'BOT', NULL, 'Anladım. İade adresiniz sistemde kayıtlı adresiniz mi olacak?', '2023-11-02 11:12:10', 'TEXT', TRUE, SHA2('Anladım. İade adresiniz sistemde kayıtlı adresiniz mi olacak?', 256), 'RETURN_ADDRESS', 0.9400),
(3, 'USER', 6, 'Evet, sistemdeki adres olabilir', '2023-11-02 11:13:00', 'TEXT', TRUE, SHA2('Evet, sistemdeki adres olabilir', 256), NULL, NULL),
(3, 'BOT', NULL, 'İade talebiniz oluşturuldu. İade kodu: RTN-12345. Kargo görevlisi 2 iş günü içinde belirttiğiniz adresten ürünü teslim alacaktır.', '2023-11-02 11:13:10', 'TEXT', TRUE, SHA2('İade talebiniz oluşturuldu. İade kodu: RTN-12345. Kargo görevlisi 2 iş günü içinde belirttiğiniz adresten ürünü teslim alacaktır.', 256), 'RETURN_CONFIRMATION', 0.9800),

-- Session 6 (Müşteri-Temsilci konuşmaları)
(6, 'USER', 4, 'Merhaba, siparişimle ilgili bir sorun yaşıyorum, yardımcı olabilir misiniz?', '2023-11-05 13:10:00', 'TEXT', TRUE, SHA2('Merhaba, siparişimle ilgili bir sorun yaşıyorum, yardımcı olabilir misiniz?', 256), NULL, NULL),
(6, 'BOT', NULL, 'Merhaba! Size yardımcı olmaktan memnuniyet duyarım. Lütfen sipariş numaranızı paylaşır mısınız?', '2023-11-05 13:10:10', 'TEXT', TRUE, SHA2('Merhaba! Size yardımcı olmaktan memnuniyet duyarım. Lütfen sipariş numaranızı paylaşır mısınız?', 256), 'GREETING', 0.9700),
(6, 'USER', 4, 'ORD-2023081504 numaralı siparişim hala gelmedi', '2023-11-05 13:11:00', 'TEXT', TRUE, SHA2('ORD-2023081504 numaralı siparişim hala gelmedi', 256), NULL, NULL),
(6, 'BOT', NULL, 'Siparişinizi kontrol ediyorum. Bir temsilcimiz en kısa sürede size yardımcı olacak.', '2023-11-05 13:11:10', 'TEXT', TRUE, SHA2('Siparişinizi kontrol ediyorum. Bir temsilcimiz en kısa sürede size yardımcı olacak.', 256), 'TRANSFER_TO_AGENT', 0.9800),
(6, 'MANAGER', 7, 'Merhaba, ben Müşteri Temsilciniz Zeynep. Sipariş durumunuzu kontrol ediyorum.', '2023-11-05 13:15:00', 'TEXT', TRUE, SHA2('Merhaba, ben Müşteri Temsilciniz Zeynep. Sipariş durumunuzu kontrol ediyorum.', 256), NULL, NULL),
(6, 'MANAGER', 7, 'ORD-2023081504 numaralı siparişiniz şu anda hazırlanma aşamasında. Normalde bu işlem daha kısa sürmeli, gecikme için özür dileriz.', '2023-11-05 13:17:00', 'TEXT', TRUE, SHA2('ORD-2023081504 numaralı siparişiniz şu anda hazırlanma aşamasında. Normalde bu işlem daha kısa sürmeli, gecikme için özür dileriz.', 256), NULL, NULL),
(6, 'USER', 4, 'Ne zaman elime ulaşır?', '2023-11-05 13:18:00', 'TEXT', TRUE, SHA2('Ne zaman elime ulaşır?', 256), NULL, NULL),
(6, 'MANAGER', 7, '3 iş günü içerisinde kargoya verilecek. Size özel %10 indirim kuponu tanımladım, bir sonraki alışverişinizde kullanabilirsiniz.', '2023-11-05 13:20:00', 'TEXT', TRUE, SHA2('3 iş günü içerisinde kargoya verilecek. Size özel %10 indirim kuponu tanımladım, bir sonraki alışverişinizde kullanabilirsiniz.', 256), NULL, NULL),
(6, 'USER', 4, 'Teşekkür ederim, yardımcı olduğunuz için.', '2023-11-05 13:21:00', 'TEXT', TRUE, SHA2('Teşekkür ederim, yardımcı olduğunuz için.', 256), NULL, NULL),
(6, 'MANAGER', 7, 'Rica ederim. Başka bir sorunuz olursa bize ulaşmaktan çekinmeyin. İyi günler dilerim.', '2023-11-05 13:22:00', 'TEXT', TRUE, SHA2('Rica ederim. Başka bir sorunuz olursa bize ulaşmaktan çekinmeyin. İyi günler dilerim.', 256), NULL, NULL),

-- Session 7 (Diğer Müşteri-Temsilci konuşması)
(7, 'USER', 5, 'Merhaba, gözlük camı numaramı değiştirmek istiyorum', '2023-11-22 09:45:00', 'TEXT', TRUE, SHA2('Merhaba, gözlük camı numaramı değiştirmek istiyorum', 256), NULL, NULL),
(7, 'BOT', NULL, 'Merhaba! Gözlük camı değişimi için size yardımcı olabiliriz. Sipariş numaranızı öğrenebilir miyim?', '2023-11-22 09:45:10', 'TEXT', TRUE, SHA2('Merhaba! Gözlük camı değişimi için size yardımcı olabiliriz. Sipariş numaranızı öğrenebilir miyim?', 256), 'PRODUCT_CHANGE', 0.9500),
(7, 'USER', 5, 'ORD-2023060502', '2023-11-22 09:46:00', 'TEXT', TRUE, SHA2('ORD-2023060502', 256), NULL, NULL),
(7, 'BOT', NULL, 'Teşekkürler. Size daha iyi hizmet verebilmemiz için bir müşteri temsilcimizi görüşmeye dahil ediyorum.', '2023-11-22 09:46:10', 'TEXT', TRUE, SHA2('Teşekkürler. Size daha iyi hizmet verebilmemiz için bir müşteri temsilcimizi görüşmeye dahil ediyorum.', 256), 'TRANSFER_TO_AGENT', 0.9800),
(7, 'MANAGER', 7, 'Merhaba, ben Müşteri Temsilciniz Zeynep. Gözlük camı değişimi için yardımcı olabilirim.', '2023-11-22 09:50:00', 'TEXT', TRUE, SHA2('Merhaba, ben Müşteri Temsilciniz Zeynep. Gözlük camı değişimi için yardımcı olabilirim.', 256), NULL, NULL),
(7, 'USER', 5, 'Sol gözümün numarası değişti, yeni reçetem var', '2023-11-22 09:51:00', 'TEXT', TRUE, SHA2('Sol gözümün numarası değişti, yeni reçetem var', 256), NULL, NULL),
(7, 'MANAGER', 7, 'Anlıyorum. Yeni reçetenizi bize iletebilirseniz, değişim işlemini başlatabiliriz. Ek bir ücret ödemeniz gerekecek, bunu da hatırlatmak isterim.', '2023-11-22 09:53:00', 'TEXT', TRUE, SHA2('Anlıyorum. Yeni reçetenizi bize iletebilirseniz, değişim işlemini başlatabiliriz. Ek bir ücret ödemeniz gerekecek, bunu da hatırlatmak isterim.', 256), NULL, NULL),
(7, 'USER', 5, 'Tamam, reçetemi yüklüyorum', '2023-11-22 09:54:00', 'TEXT', TRUE, SHA2('Tamam, reçetemi yüklüyorum', 256), NULL, NULL),
(7, 'USER', 5, '[Reçete Görseli]', '2023-11-22 09:55:00', 'IMAGE', TRUE, SHA2('[Reçete Görseli]', 256), NULL, NULL),
(7, 'MANAGER', 7, 'Reçetenizi aldım. Değişim için 150 TL ücret alınacak. Onaylıyor musunuz?', '2023-11-22 09:57:00', 'TEXT', TRUE, SHA2('Reçetenizi aldım. Değişim için 150 TL ücret alınacak. Onaylıyor musunuz?', 256), NULL, NULL),
(7, 'USER', 5, 'Evet, onaylıyorum', '2023-11-22 09:58:00', 'TEXT', TRUE, SHA2('Evet, onaylıyorum', 256), NULL, NULL),
(7, 'MANAGER', 7, 'Teşekkürler. Değişim talebiniz oluşturuldu. Gözlüğünüzü en yakın mağazamıza bırakabilirsiniz veya kargo ile gönderebilirsiniz. İşlem tamamlandığında size bilgi vereceğiz.', '2023-11-22 10:00:00', 'TEXT', TRUE, SHA2('Teşekkürler. Değişim talebiniz oluşturuldu. Gözlüğünüzü en yakın mağazamıza bırakabilirsiniz veya kargo ile gönderebilirsiniz. İşlem tamamlandığında size bilgi vereceğiz.', 256), NULL, NULL),
(7, 'USER', 5, 'Anladım, teşekkürler', '2023-11-22 10:01:00', 'TEXT', TRUE, SHA2('Anladım, teşekkürler', 256), NULL, NULL);

-- Örnek chat analitik verileri
INSERT INTO chat_analytics (session_id, customer_id, manager_id, conversation_hash, session_start, session_end, message_count, resolution_status, sentiment_score, topic_tags, resolution_time_seconds, satisfaction_rating)
VALUES
(6, 4, 7, SHA2('session-2023110506-convo', 256), '2023-11-05 13:10:00', '2023-11-05 13:22:00', 10, 'RESOLVED', 0.75, '["sipariş","teslimat","gecikme"]', 720, 4),
(7, 5, 7, SHA2('session-2023112207-convo', 256), '2023-11-22 09:45:00', '2023-11-22 10:01:00', 12, 'RESOLVED', 0.85, '["gözlük","numaralı cam","değişim"]', 960, 5);

-- Hash ve sıkıştırma için örnek saklı prosedürler
DELIMITER //

-- Mesajı hashleyip saklayan prosedür
CREATE PROCEDURE HashAndStoreMessage(IN p_message_id BIGINT)
BEGIN
    DECLARE v_message TEXT;
    DECLARE v_hash VARCHAR(128);
    
    -- Mesaj içeriğini al
    SELECT message INTO v_message FROM chat_messages WHERE id = p_message_id;
    
    -- Hash oluştur
    SET v_hash = SHA2(v_message, 256);
    
    -- Hash değerini güncelle
    UPDATE chat_messages SET message_hash = v_hash WHERE id = p_message_id;
END //

-- Konuşmayı sıkıştırıp saklayan prosedür
CREATE PROCEDURE CompressAndStoreConversation(IN p_session_id BIGINT)
BEGIN
    DECLARE v_conversation MEDIUMTEXT;
    DECLARE v_compressed MEDIUMBLOB;
    DECLARE v_hash VARCHAR(128);
    
    -- Oturumdaki tüm mesajları birleştir
    SELECT GROUP_CONCAT(CONCAT(sender_type, ': ', message) SEPARATOR '\n') 
    INTO v_conversation
    FROM chat_messages 
    WHERE session_id = p_session_id
    ORDER BY sent_at;
    
    -- Hash oluştur
    SET v_hash = SHA2(v_conversation, 256);
    
    -- Sıkıştırılmış veri oluştur (MySQL'in COMPRESS fonksiyonu kullanılır)
    SET v_compressed = COMPRESS(v_conversation);
    
    -- Varsa analitiği güncelle, yoksa yeni kayıt oluştur
    IF EXISTS (SELECT 1 FROM chat_analytics WHERE session_id = p_session_id) THEN
        UPDATE chat_analytics 
        SET conversation_hash = v_hash, 
            compressed_conversation = v_compressed
        WHERE session_id = p_session_id;
    ELSE
        -- Session ve ilgili kullanıcı bilgilerini al
        INSERT INTO chat_analytics (
            session_id, customer_id, manager_id, conversation_hash, 
            compressed_conversation, session_start, session_end, message_count
        )
        SELECT 
            cs.id,
            cs.user_id,
            (SELECT DISTINCT sender_id FROM chat_messages 
             WHERE session_id = p_session_id AND sender_type = 'MANAGER' LIMIT 1),
            v_hash,
            v_compressed,
            cs.started_at,
            cs.last_active,
            (SELECT COUNT(*) FROM chat_messages WHERE session_id = p_session_id)
        FROM chat_sessions cs
        WHERE cs.id = p_session_id;
    END IF;
END //

DELIMITER ; 