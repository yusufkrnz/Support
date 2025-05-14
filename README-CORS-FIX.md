# Dinamik Port ve CORS Çözümü

Bu doküman, Atasun Chatbot uygulamasında yaşanan CORS sorunlarını çözmek için yapılan kapsamlı değişiklikleri ve dinamik port sistemini açıklamaktadır.

## 1. Dinamik Port Yapılandırması

Backend servisinin otomatik olarak uygun portu bularak çalışmasını sağlayan bir sistem geliştirdik.

### `DynamicPortConfig.java`

- Başlangıç portunu 8080 olarak belirler
- Port dolu ise 8081, 8082, ... gibi diğer portları dener
- Bulduğu portu bir dosyaya yazarak diğer servislerle paylaşır
- Backend başlatıldığında kullanıcı hiçbir ayar değiştirmeden sistem çalışır

## 2. Gelişmiş CORS Yapılandırması

### `DynamicCorsConfig.java`

- Tüm olası origin kaynaklarını (farklı port kombinasyonlarını) otomatik olarak oluşturur
- CORS filtreleme için CorsFilter oluşturur
- Tüm endpoint'ler için tek bir yapılandırma sağlar
- HTTP metodları ve header'lar için izinleri düzenler

### `WebConfig.java`

- WebMvcConfigurer'ı kullanarak CORS ayarlarını günceller
- Dinamik port listesi kullanır
- allowCredentials=false ayarı CORS preflight sorunlarını önler

### `GlobalCorsFilter.java`

- Tüm HTTP isteklerini yakalayan bir servlet filtresi
- Response header'larına CORS izinlerini ekler
- OPTIONS isteklerini özel olarak işler
- Tüm Backend kontrollerinde tutarlı CORS davranışı sağlar

## 3. Controller Sınıflarında CORS Desteği

Tüm API Controller sınıflarını güncellendi:

- `ChatbotController.java`
- `HealthController.java`
- `RedisController.java`
- `API/ChatBotController.java`
- `OrientationChatBotController.java`

Her Controller:
- `@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")` notasyonu ekledik
- Response header'larına CORS izinlerini manuel ekledik
- OPTIONS metodunu işleyen özel endpoint'ler ekledik
- Hata durumlarını daha iyi yöneten try/catch blokları ekledik

## 4. Demo Modlu Servisler

Tüm controller'lara demo mod ekleyerek, backend servislerinin çalışmadığı durumda bile chatbot arayüzünün çalışmasını sağladık.

- `ChatbotController.java` ve `API/ChatBotController.java`'ya demo yanıt fonksiyonları eklendi
- Hata durumlarında demo yanıtlar döndürülerek kullanıcı deneyimini iyileştirdik
- Demoda kelime tabanlı basit bir NLP mekanizması uyguladık (anahtar kelime tespiti)

## 5. Frontend API Bağlantısı Geliştirmeleri

### `api.js`

- Dinamik API URL oluşturma fonksiyonu eklendi
- Dört farklı yöntemle doğru API adresi tespit ediliyor:
  1. URL parametresi kontrolü
  2. Local storage kontrolü
  3. Backend port discovery (aktif portu otomatik bulma)
  4. Varsayılan adres

### `cors-test-updated.html`

- Dinamik port tarayıcısı eklendi
- Tüm API test etme yetenekleri iyileştirildi
- Local storage kullanarak tercih edilen API URL'sini hatırlama özelliği
- Daha kullanıcı dostu arayüz

## 6. AI Service Entegrasyonu

AI servisi için de CORS yapılandırması eklendi:

- Flask CORS eklentisi entegrasyonu
- Manuel CORS başlıkları
- Demo yanıtlar ekleyerek backend bağlantısı olmadan da çalışabilme

## 7. Sistem Test Etme Adımları

1. Backend'i başlatın - artık otomatik olarak uygun portu bulacak
2. Frontend'i başlatın (port 3000 - npm start)
3. AI Service'i başlatın (port 8000 - python app.py)
4. `cors-test-updated.html` sayfasını açın
5. "Portları Tara" butonuna tıklayarak aktif backend'i otomatik bulun
6. Bulunan adresi kullanarak tüm API testlerini çalıştırın

## Sorun Giderme

- Tarayıcı konsolunda CORS hataları görürseniz:
  - Backend'in çalıştığından emin olun
  - Port tarayıcı ile doğru adresi bulmaya çalışın
  - Backend controller'lardaki @CrossOrigin notasyonlarını kontrol edin
  - Sunucu log'larını kontrol edin

- "Failed to fetch" hataları:
  - Backend çalışmıyor olabilir
  - Port numarası yanlış olabilir
  - API yolları yanlış olabilir (örn. /api prefixi)

Bu geliştirmeler sayesinde, kullanıcılar artık chatbot arayüzünde CORS hataları ile karşılaşmadan mesajlaşabilecekler. Sistem, farklı port yapılandırmalarında çalıştığında bile otomatik adaptasyon sağlar. 