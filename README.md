# SupportHub

Bu proje, müşteri destek taleplerini yönetmek için geliştirilmiş bir web uygulamasıdır. Sistem, müşterilerin destek talepleri oluşturmasına, müşteri temsilcilerinin bu talepleri yönetmesine ve yöneticilerin tüm süreci izlemesine olanak tanır.

## Özellikler

- **Müşteri Paneli**: Destek talebi oluşturma, mevcut talepleri görüntüleme ve mesajlaşma
- **Temsilci Paneli**: Destek taleplerini görüntüleme, talepleri üstlenme, müşterilerle mesajlaşma ve talepleri kapatma
- **Yönetici Paneli**: Tüm destek taleplerini izleme, kullanıcı yönetimi ve performans istatistikleri
- **Chatbot Entegrasyonu**: Müşterilere ilk yanıtları vermek için AI destekli chatbot
- **Aktivite Haritası**: GitHub benzeri, temsilcilerin destek aktivitelerini gösteren görsel harita

## Teknolojiler

### Frontend
- React.js
- Material UI
- React Router
- Axios

### Backend
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- MySQL

## Kurulum

### Ön Koşullar
- Node.js (v14+)
- Java 11+
- Maven
- MySQL

### Backend Kurulumu
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Kurulumu
```bash
cd frontend
npm install
npm start
```

## Kullanım

Uygulama başlatıldıktan sonra, tarayıcınızda `http://localhost:3000` adresine giderek uygulamaya erişebilirsiniz.

### Demo Kullanıcılar
- **Admin**: admin@example.com / admin123
- **Temsilci**: rep@example.com / rep123
- **Müşteri**: customer@example.com / customer123

## Ekran Görüntüleri

![Müşteri Paneli](screenshots/customer-dashboard.png)
![Temsilci Paneli](screenshots/representative-dashboard.png)
![Yönetici Paneli](screenshots/admin-dashboard.png)

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız. 