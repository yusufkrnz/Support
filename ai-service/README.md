# AI Service

Bu servis, Support uygulaması için AI/ML işlemlerini gerçekleştirir. Spring Boot uygulaması ile Python FastAPI arasındaki köprü olarak çalışır.

## Özellikler

- İade talebi değerlendirme (görsel analizi dahil)
- Şikayet analizi ve önceliklendirme
- Kullanıcı sorgularını sınıflandırma
- Genel sorulara Llama3 ile yanıt üretme
- Karmaşık sorguların analizi ve eylem önerileri

## Kurulum

### Gereksinimler

- Python 3.10+
- [Ollama](https://github.com/ollama/ollama) (Llama3 modeli için)
- Redis (opsiyonel, oturum yönetimi için)

### Adımlar

1. Gerekli Python paketlerini yükleyin:
   ```
   pip install -r requirements.txt
   ```

2. `.env` dosyasını oluşturun:
   ```
   cp env.example .env
   ```

3. `.env` dosyasını düzenleyerek gerekli API anahtarlarını ve yapılandırmaları ayarlayın.

4. Ollama'yı kurun ve Llama3 modelini indirin:
   ```
   ollama pull llama3
   ```

5. Servisi başlatın:
   ```
   python app.py
   ```

## API Endpoint'leri

### İade İşlemleri

- `POST /api/validate-return`: İade talebini doğrular
- `POST /api/returns/evaluate-full`: İade talebi tam değerlendirme

### Şikayet İşlemleri

- `POST /api/validate-complaint`: Şikayet talebini doğrular
- `POST /api/evaluate-complaint`: Şikayet analizi ve önceliklendirme

### Sorgu İşlemleri

- `POST /api/query/classify`: Kullanıcı sorgusunu sınıflandırır
- `POST /api/general-query`: Genel sorulara yanıt üretir
- `POST /api/analyze-complex`: Karmaşık sorguları analiz eder

## Çevre Değişkenleri

`.env` dosyasında ayarlanabilecek çevre değişkenleri:

| Değişken | Açıklama | Varsayılan Değer |
|----------|----------|------------------|
| PORT | Servisin çalışacağı port | 8000 |
| HOST | Servisin çalışacağı host | 0.0.0.0 |
| DEBUG | Hata ayıklama modu | True |
| OLLAMA_API_URL | Ollama API URL'i | http://localhost:11434/api/generate |
| LLAMA_MODEL | Kullanılacak Llama modeli | llama3 |
| GEMINI_API_KEY | Gemini API anahtarı | (Boş) |
| ALLOWED_ORIGINS | CORS için izin verilen origin'ler | http://localhost:8081 |

## Entegrasyon

Bu servis, Spring Boot uygulaması ile HTTP/JSON üzerinden iletişim kurar. Backend'den gelen API çağrıları aşağıdaki formatta yapılır:

### Örnek İstek:

```json
{
  "returnReason": "Ürün hasarlı geldi",
  "explanation": "Kutuyu açtığımda ürünün sağ köşesinin kırık olduğunu gördüm.",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

### Örnek Yanıt:

```json
{
  "isValid": true,
  "message": "İade talebiniz onaylandı.",
  "confidenceScore": 0.92
}
```

## Sorun Giderme

- Ollama çalışmıyorsa: `ollama serve` komutu ile Ollama sunucusunu başlatın.
- API anahtarı hatası: `.env` dosyasında doğru API anahtarının ayarlandığından emin olun.
- Port çakışması: `.env` dosyasında farklı bir PORT değeri ayarlayın. 