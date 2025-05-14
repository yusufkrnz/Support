-- Sample Companies
INSERT INTO companies (name, description, address, city, country, postal_code, phone_number, email, website, created_at, active, subscription_tier, subscription_expiry_date)
VALUES 
    ('Atasun Optik', 'Leading Eyewear Retailer', 'Atasun Plaza, 123 Optik St', 'Istanbul', 'Turkey', '34000', '+90-212-555-1234', 'contact@atasun.com.tr', 'www.atasunoptik.com.tr', NOW(), true, 'ENTERPRISE', '2025-12-31 23:59:59'),
    ('BIM', 'Discount Grocery Chain', 'BIM Headquarters, 456 Market St', 'Istanbul', 'Turkey', '34100', '+90-212-555-5678', 'info@bim.com.tr', 'www.bim.com.tr', NOW(), true, 'PREMIUM', '2025-06-30 23:59:59'),
    ('Gratis', 'Personal Care and Cosmetics Retailer', 'Gratis Tower, 789 Beauty Ave', 'Istanbul', 'Turkey', '34200', '+90-212-555-9012', 'contact@gratis.com', 'www.gratis.com', NOW(), true, 'STANDARD', '2024-12-31 23:59:59'),
    ('Health First', 'Healthcare Services', '101 Wellness Rd', 'London', 'UK', 'SW1A 1AA', '+44-20-12345678', 'info@healthfirst.com', 'www.healthfirst.com', NOW(), true, 'PREMIUM', '2025-03-31 23:59:59'),
    ('Innovate Labs', 'Research and Development', '202 Science Park', 'Tokyo', 'Japan', '100-0001', '+81-3-12345678', 'hello@innovatelabs.com', 'www.innovatelabs.com', NOW(), true, 'ENTERPRISE', '2026-01-31 23:59:59'),
    ('Inactive Corp', 'Inactive Company', '404 Not Found St', 'Lost City', 'Nowhere', '00000', '555-NO-PHONE', 'nobody@inactive.com', 'www.inactive.com', NOW(), false, 'BASIC', '2023-12-31 23:59:59');

-- Sample Super Admins
INSERT INTO base_user (email, password, full_name, phone_number, active, created_at, user_type, company_id)
VALUES 
    ('superadmin@system.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'System Administrator', '555-ADMIN', true, NOW(), 'SUPER_ADMIN', NULL);

INSERT INTO super_admin (id, security_clearance, can_configure_ai, can_manage_admins, can_access_audit, requires_mfa, mfa_secret)
VALUES 
    (LAST_INSERT_ID(), 'TOP_LEVEL', true, true, true, true, 'mfa_secret_key_123');

-- Sample Admins (one for each active company)
INSERT INTO base_user (email, password, full_name, phone_number, active, created_at, user_type, company_id)
VALUES 
    ('admin@atasun.com.tr', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Ahmet Admin', '+90-533-111-1111', true, NOW(), 'ADMIN', 1),
    ('admin@bim.com.tr', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Mehmet Admin', '+90-533-222-2222', true, NOW(), 'ADMIN', 2),
    ('admin@gratis.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Ayşe Admin', '+90-533-333-3333', true, NOW(), 'ADMIN', 3),
    ('admin@healthfirst.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Emma Admin', '555-456-7890', true, NOW(), 'ADMIN', 4),
    ('admin@innovatelabs.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Takeshi Admin', '555-567-8901', true, NOW(), 'ADMIN', 5);

INSERT INTO admin (id, admin_level, can_manage_users, can_manage_system, can_view_reports, access_ip_range)
VALUES 
    (LAST_INSERT_ID() - 4, 'SENIOR', true, true, true, '*'),
    (LAST_INSERT_ID() - 3, 'SENIOR', true, true, true, '*'),
    (LAST_INSERT_ID() - 2, 'SENIOR', true, true, true, '*'),
    (LAST_INSERT_ID() - 1, 'SENIOR', true, true, true, '*'),
    (LAST_INSERT_ID(), 'SENIOR', true, true, true, '*');

-- Sample Managers (multiple for each active company)
INSERT INTO base_user (email, password, full_name, phone_number, active, created_at, user_type, company_id)
VALUES 
    ('manager1@atasun.com.tr', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Ali Manager', '+90-533-444-4444', true, NOW(), 'MANAGER', 1),
    ('manager2@atasun.com.tr', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Zeynep Manager', '+90-533-444-5555', true, NOW(), 'MANAGER', 1),
    ('manager1@bim.com.tr', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Mustafa Manager', '+90-533-555-5555', true, NOW(), 'MANAGER', 2),
    ('manager2@bim.com.tr', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Fatma Manager', '+90-533-555-6666', true, NOW(), 'MANAGER', 2),
    ('manager1@gratis.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Emre Manager', '+90-533-666-6666', true, NOW(), 'MANAGER', 3),
    ('manager1@healthfirst.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'William Manager', '555-456-1111', true, NOW(), 'MANAGER', 4),
    ('manager2@healthfirst.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Sophie Manager', '555-456-2222', true, NOW(), 'MANAGER', 4),
    ('manager1@innovatelabs.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Kenji Manager', '555-567-1111', true, NOW(), 'MANAGER', 5);

INSERT INTO manager (id, department, title, can_approve_returns, can_resolve_complaints, max_approval_amount)
VALUES 
    (LAST_INSERT_ID() - 7, 'Support', 'Optical Support Manager', true, true, 5000),
    (LAST_INSERT_ID() - 6, 'Sales', 'Sales Manager', true, true, 3000),
    (LAST_INSERT_ID() - 5, 'Customer Service', 'CS Manager', true, true, 2000),
    (LAST_INSERT_ID() - 4, 'Returns', 'Returns Manager', true, true, 1500),
    (LAST_INSERT_ID() - 3, 'Support', 'Beauty Support Manager', true, true, 1000),
    (LAST_INSERT_ID() - 2, 'Medical', 'Medical Support Manager', true, true, 5000),
    (LAST_INSERT_ID() - 1, 'Claims', 'Claims Manager', true, true, 2500),
    (LAST_INSERT_ID(), 'R&D Support', 'R&D Support Manager', true, true, 10000);

-- Sample Customers (multiple for each active company)
INSERT INTO base_user (email, password, full_name, phone_number, active, created_at, user_type, company_id)
VALUES 
    ('customer1@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Hakan Customer', '+90-533-777-7777', true, NOW(), 'CUSTOMER', 1),
    ('customer2@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Sevgi Customer', '+90-533-777-8888', true, NOW(), 'CUSTOMER', 1),
    ('customer3@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Tolga Customer', '+90-533-777-9999', true, NOW(), 'CUSTOMER', 1),
    ('customer4@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Selin BIM', '+90-533-888-8888', true, NOW(), 'CUSTOMER', 2),
    ('customer5@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Murat BIM', '+90-533-888-9999', true, NOW(), 'CUSTOMER', 2),
    ('customer6@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Deniz Gratis', '+90-533-999-9999', true, NOW(), 'CUSTOMER', 3),
    ('customer7@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Mark Health', '555-444-4001', true, NOW(), 'CUSTOMER', 4),
    ('customer8@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Christine Health', '555-444-4002', true, NOW(), 'CUSTOMER', 4),
    ('customer9@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Paul Health', '555-444-4003', true, NOW(), 'CUSTOMER', 4),
    ('customer10@example.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Yuki Labs', '555-555-5001', true, NOW(), 'CUSTOMER', 5);

INSERT INTO customer (id, address, city, country, postal_code, loyalty_points)
VALUES 
    (LAST_INSERT_ID() - 9, 'Kadıköy, Istanbul', 'Istanbul', 'Turkey', '34700', 150),
    (LAST_INSERT_ID() - 8, 'Beşiktaş, Istanbul', 'Istanbul', 'Turkey', '34353', 250),
    (LAST_INSERT_ID() - 7, 'Şişli, Istanbul', 'Istanbul', 'Turkey', '34360', 50),
    (LAST_INSERT_ID() - 6, 'Ümraniye, Istanbul', 'Istanbul', 'Turkey', '34760', 350),
    (LAST_INSERT_ID() - 5, 'Maltepe, Istanbul', 'Istanbul', 'Turkey', '34840', 200),
    (LAST_INSERT_ID() - 4, 'Bakırköy, Istanbul', 'Istanbul', 'Turkey', '34140', 100),
    (LAST_INSERT_ID() - 3, '222 Health User Rd', 'London', 'UK', 'SW1A 1AA', 450),
    (LAST_INSERT_ID() - 2, '333 Health User Ave', 'Manchester', 'UK', 'M1 1AA', 300),
    (LAST_INSERT_ID() - 1, '444 Health User St', 'Birmingham', 'UK', 'B1 1AA', 150),
    (LAST_INSERT_ID(), '555 Labs User Park', 'Tokyo', 'Japan', '100-0001', 500);

-- Sample Return Requests
INSERT INTO return_request (product_name, order_number, return_reason, status, created_at, updated_at, company_name, customer_id, manual_override)
VALUES
    ('Güneş Gözlüğü X1', 'ORD-123456', 'Defective product', 'PENDING', NOW(), NOW(), 'Atasun Optik', LAST_INSERT_ID() - 9, false),
    ('Contact Lens Pro', 'ORD-123457', 'Wrong prescription received', 'APPROVED', NOW(), NOW(), 'Atasun Optik', LAST_INSERT_ID() - 8, false),
    ('Optik Çerçeve', 'ORD-123458', 'Not as described', 'REJECTED', NOW(), NOW(), 'Atasun Optik', LAST_INSERT_ID() - 7, true),
    ('Süt Paketi', 'ORD-234567', 'Expired product', 'PENDING', NOW(), NOW(), 'BIM', LAST_INSERT_ID() - 6, false),
    ('Bisküvi Paket', 'ORD-234568', 'Damaged packaging', 'APPROVED', NOW(), NOW(), 'BIM', LAST_INSERT_ID() - 5, false),
    ('Ruj', 'ORD-345678', 'Wrong color', 'PENDING', NOW(), NOW(), 'Gratis', LAST_INSERT_ID() - 4, false),
    ('Health Monitor', 'ORD-456789', 'Not functioning properly', 'APPROVED', NOW(), NOW(), 'Health First', LAST_INSERT_ID() - 3, false),
    ('First Aid Kit', 'ORD-456790', 'Expired products', 'REJECTED', NOW(), NOW(), 'Health First', LAST_INSERT_ID() - 2, true),
    ('Prescription Glasses', 'ORD-456791', 'Wrong prescription', 'PENDING', NOW(), NOW(), 'Health First', LAST_INSERT_ID() - 1, false),
    ('Research Equipment', 'ORD-567890', 'Damaged in transit', 'APPROVED', NOW(), NOW(), 'Innovate Labs', LAST_INSERT_ID(), false);

-- Sample Complaints
INSERT INTO complaint (subject, description, priority, status, created_at, updated_at, customer_id, assigned_to_id, resolution_notes)
VALUES
    ('Kötü müşteri hizmeti', 'Bir saatten fazla bekletildim', 'HIGH', 'OPEN', NOW(), NOW(), LAST_INSERT_ID() - 9, LAST_INSERT_ID() - 15, NULL),
    ('Fatura hatası', 'Alışverişim için iki kez ücret alındı', 'HIGH', 'IN_PROGRESS', NOW(), NOW(), LAST_INSERT_ID() - 8, LAST_INSERT_ID() - 15, 'Çift ödeme inceleniyor'),
    ('Web sitesi sorunları', 'Ödeme işlemini tamamlayamıyorum', 'MEDIUM', 'RESOLVED', NOW(), NOW(), LAST_INSERT_ID() - 7, LAST_INSERT_ID() - 14, 'Ödeme hatası düzeltildi'),
    ('Yanlış ürün gönderimi', 'Süt yerine yoğurt gönderilmiş', 'MEDIUM', 'OPEN', NOW(), NOW(), LAST_INSERT_ID() - 6, LAST_INSERT_ID() - 13, NULL),
    ('Teslimat gecikmesi', 'Siparişim bir haftadır gecikiyor', 'LOW', 'IN_PROGRESS', NOW(), NOW(), LAST_INSERT_ID() - 5, LAST_INSERT_ID() - 13, 'Kargo firmasıyla koordinasyon sağlanıyor'),
    ('Ürün kalitesi', 'Aldığım parfüm çok çabuk bitiyor', 'HIGH', 'OPEN', NOW(), NOW(), LAST_INSERT_ID() - 4, LAST_INSERT_ID() - 12, NULL),
    ('Insurance claim denied', 'My medical claim was unfairly rejected', 'HIGH', 'IN_PROGRESS', NOW(), NOW(), LAST_INSERT_ID() - 3, LAST_INSERT_ID() - 10, 'Reviewing claim details with medical team'),
    ('Appointment scheduling', 'Cannot book appointment through the app', 'MEDIUM', 'RESOLVED', NOW(), NOW(), LAST_INSERT_ID() - 2, LAST_INSERT_ID() - 10, 'Fixed app scheduling feature'),
    ('Incorrect prescription', 'My glasses have the wrong prescription', 'HIGH', 'OPEN', NOW(), NOW(), LAST_INSERT_ID() - 1, LAST_INSERT_ID() - 9, NULL),
    ('Equipment malfunction', 'Research equipment failed during critical experiment', 'HIGH', 'IN_PROGRESS', NOW(), NOW(), LAST_INSERT_ID(), LAST_INSERT_ID() - 8, 'Engineering team analyzing the equipment');

-- Sample Support Tickets for Gratis
INSERT INTO support_tickets (ticket_number, subject, description, status, priority, category, customer_id, assigned_to, company_id, created_at, last_updated, resolved_at, wait_reason)
VALUES
    ('GRT-0001', 'Şampuan sipariş ettim, kargo takip edilemiyor', 'İki gün önce siparişim onaylandı ancak kargo takip numarası çalışmıyor ve siparişim nerede göremiyorum.', 'OPEN', 'HIGH', 'Teslimat', LAST_INSERT_ID() - 4, NULL, 3, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY, NULL, NULL),
    ('GRT-0002', 'İndirim kuponu çalışmıyor', 'Mailimde gelen indirim kuponunu kullanmaya çalışıyorum ama sistem her seferinde geçersiz kupon diyor. Oysa son kullanma tarihi bugün.', 'OPEN', 'MEDIUM', 'Ödeme', LAST_INSERT_ID() - 4, NULL, 3, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, NULL, NULL),
    ('GRT-0003', 'Yanlış ürün gönderildi', 'Siparişimde Mat Ruj sipariş ettim ama gönderilen ürün Parlak Ruj. Sipariş numarası: GRT-78945', 'OPEN', 'URGENT', 'Teslimat', LAST_INSERT_ID() - 4, NULL, 3, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, NULL, NULL),
    ('GRT-0004', 'Ürün açıklaması gerçeği yansıtmıyor', 'Aldığım cilt bakım kremi hassas ciltler için uygun yazıyor ama alerji yaptı. Açıklamada belirtilen içerik bilgisiyle ürün üzerindeki içerik uyuşmuyor.', 'OPEN', 'HIGH', 'Ürün', LAST_INSERT_ID() - 4, NULL, 3, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY, NULL, NULL),
    ('GRT-0005', 'Siparişim 3 gündür kargoya verilmedi', 'Geçen hafta verdiğim sipariş hala hazırlanıyor gözüküyor. Acilen bu ürünlere ihtiyacım var, ne zaman gönderilecek?', 'OPEN', 'HIGH', 'Teslimat', LAST_INSERT_ID() - 4, NULL, 3, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY, NULL, NULL),
    ('GRT-0006', 'Ürün kullanımı ile ilgili bilgi almak istiyorum', 'Satın aldığım saç boyasının kullanım talimatlarında bir belirsizlik var. Saçı ne kadar süre boyalı tutmam gerektiği yazmıyor.', 'OPEN', 'MEDIUM', 'Ürün Bilgisi', LAST_INSERT_ID() - 4, NULL, 3, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY, NULL, NULL),
    ('GRT-0007', 'Kampanya hakkında bilgi almak istiyorum', '2 al 1 öde kampanyası ne zaman sona erecek? Ayrıca bu kampanyaya dahil olan başka ürünler var mı?', 'OPEN', 'LOW', 'Kampanya', LAST_INSERT_ID() - 4, NULL, 3, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY, NULL, NULL),
    ('GRT-0008', 'Kozmetik ürünü alerjik reaksiyon yaptı', 'Dün aldığım yüz maskesi cildimde ciddi bir kızarıklık ve yanmaya neden oldu. Acil bir şekilde ürün içeriğini öğrenmem gerekiyor çünkü doktora gitmem gerekebilir.', 'OPEN', 'URGENT', 'Ürün Kalitesi', LAST_INSERT_ID() - 4, NULL, 3, NOW(), NOW(), NULL, NULL);

-- Sample Support Tickets for other companies
INSERT INTO support_tickets (ticket_number, subject, description, status, priority, category, customer_id, assigned_to, company_id, created_at, last_updated, resolved_at, wait_reason)
VALUES
    ('ATS-0001', 'Gözlük çerçevesi kırık geldi', 'Online sipariş ettiğim gözlük çerçevesi kutusu hasarlı ve çerçevede çatlak var.', 'OPEN', 'HIGH', 'Ürün Hasarı', LAST_INSERT_ID() - 9, NULL, 1, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, NULL, NULL),
    ('ATS-0002', 'Gözlük numarası yanlış', 'Reçetemde yazandan farklı numarada camlar takılmış, göremiyorum.', 'IN_PROGRESS', 'URGENT', 'Ürün Hatası', LAST_INSERT_ID() - 8, LAST_INSERT_ID() - 15, 1, NOW() - INTERVAL 3 DAY, NOW(), NULL, NULL),
    
    ('BIM-0001', 'Ürün son kullanma tarihi geçmiş', 'Dün aldığım süt bozuk çıktı, son kullanma tarihi geçmiş.', 'OPEN', 'HIGH', 'Ürün Kalitesi', LAST_INSERT_ID() - 6, NULL, 2, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, NULL, NULL),
    ('BIM-0002', 'Eksik ürün teslimatı', 'Online siparişimde 10 ürün sipariş ettim ama 8 ürün geldi.', 'IN_PROGRESS', 'MEDIUM', 'Teslimat', LAST_INSERT_ID() - 5, LAST_INSERT_ID() - 13, 2, NOW() - INTERVAL 2 DAY, NOW(), NULL, NULL),
    
    ('HLT-0001', 'Appointment cancelled without notice', 'My appointment was cancelled without any notification and I travelled 2 hours to get there.', 'OPEN', 'HIGH', 'Service', LAST_INSERT_ID() - 3, NULL, 4, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY, NULL, NULL),
    ('HLT-0002', 'Wrong medication prescribed', 'I was given medication I'm allergic to despite this being noted in my records.', 'IN_PROGRESS', 'URGENT', 'Medical Error', LAST_INSERT_ID() - 2, LAST_INSERT_ID() - 9, 4, NOW() - INTERVAL 1 DAY, NOW(), NULL, NULL),
    
    ('INV-0001', 'Faulty testing equipment', 'The latest batch of testing kits are giving inconsistent results.', 'OPEN', 'HIGH', 'Equipment', LAST_INSERT_ID(), NULL, 5, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY, NULL, NULL);

-- Sample Messages for Support Tickets
INSERT INTO message (content, sender_id, receiver_id, sent_at, read_at, ticket_id)
VALUES
    ('Merhaba, kargo takip numaram çalışmıyor. Yardımcı olabilir misiniz?', LAST_INSERT_ID() - 14, NULL, NOW() - INTERVAL 2 DAY, NULL, 1),
    ('Kupon kodunu doğru girdiğinizden emin misiniz? Tekrar deneyebilir misiniz?', LAST_INSERT_ID() - 12, LAST_INSERT_ID() - 14, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, 2),
    ('Evet, kodu doğru girdim ama hala çalışmıyor.', LAST_INSERT_ID() - 14, LAST_INSERT_ID() - 12, NOW() - INTERVAL 1 DAY, NULL, 2),
    ('Yanlış ürün gönderilmiş. Hemen iade sürecini başlatmak istiyorum.', LAST_INSERT_ID() - 14, NULL, NOW() - INTERVAL 3 DAY, NULL, 3),
    ('Sipariş detaylarınızı inceliyoruz. En kısa sürede dönüş yapacağız.', LAST_INSERT_ID() - 12, LAST_INSERT_ID() - 14, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY, 3);

-- Kullanıcılar için örnek veriler
INSERT INTO base_user (id, email, password, full_name, user_type, created_at, updated_at, is_active)
VALUES 
    (1, 'admin@support.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Admin Kullanıcı', 'ADMIN', NOW(), NOW(), true),
    (2, 'manager@support.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Yönetici Kullanıcı', 'MANAGER', NOW(), NOW(), true),
    (3, 'customer@support.com', '$2a$10$XQnJiHpacerMkPMT1kQ1IerI.bhcU.8VrSFwtoVPjwK7sQqKG0L0q', 'Müşteri Kullanıcı', 'CUSTOMER', NOW(), NOW(), true);

-- Admin tablosuna veri ekle
INSERT INTO admin (id, company_name, department)
VALUES (1, 'BIM', 'Müşteri Hizmetleri');

-- Manager tablosuna veri ekle
INSERT INTO manager (id, company_name, department, specialization)
VALUES (2, 'BIM', 'Destek', 'İade İşlemleri');

-- Customer tablosuna veri ekle
INSERT INTO customer (id, company_name, phone_number, address, preferred_contact_method)
VALUES (3, 'BIM', '5551234567', 'İstanbul, Türkiye', 'EMAIL'); 