# Atasun Chatbot Endpointleri

Bu doküman sistemdeki tüm servis URL'lerini ve endpointleri açıklar.

## Frontend (http://localhost:3000)
- React uygulaması
- API isteklerini `http://localhost:8081/api` adresine yapar
- AI servisi isteklerini `http://localhost:8000` adresine yapar

## Backend (http://localhost:8081)
- Spring Boot uygulaması
- AI servisi isteklerini `http://localhost:8000` adresine yapar
- Redis'e `redis:6379` (Docker içinde) veya `localhost:6379` (host makinede) üzerinden bağlanır

### Backend Endpointleri
- `/api/health` - Sağlık kontrolü
- `/api/chat/process` - Chatbot mesajı işleme (ChatBotController)
- `/api/chat/resume` - Yarıda kalan konuşmayı devam ettirme
- `/api/chatbot/{companyCode}` - Şirket koduna göre chatbot erişimi (ChatbotController)

## AI Servisi (http://localhost:8000)
- Flask uygulaması
- Ollama'ya `http://localhost:11434/api/generate` (Docker dışında) veya `http://ollama:11434/api/generate` (Docker içinde) üzerinden bağlanır

### AI Servisi Endpointleri
- `/api/health` - Sağlık kontrolü
- `/api/gemini` - Gemini API entegrasyonu
- `/api/llama` - Llama modelini kullanma
- `/api/classify` - Kullanıcı mesajını sınıflandırma

## Ollama (http://localhost:11434)
- Llama modellerini barındıran servis
- Endpoint: `/api/generate`

## Redis (localhost:6379)
- Oturum ve önbellek için kullanılır

## MySQL (localhost:3307)
- Ana veritabanı
- PhpMyAdmin: http://localhost:8081

## Port Listesi
- Frontend: 3000
- Backend: 8081
- AI Servisi: 8000
- Ollama: 11434
- Redis: 6379
- MySQL: 3307
- PhpMyAdmin: 8081

## Docker Compose Servisleri
Tüm servisleri yönetmek için `manage.sh` (Linux/Mac) veya `manage.bat` (Windows) betiklerini kullanın.

Örnek komutlar:
```bash
# Sistemin tamamını başlatır
./manage.sh start  # veya Windows'ta: manage.bat start

# Backend loglarını görüntüler
./manage.sh logs backend  # veya Windows'ta: manage.bat logs backend
``` 