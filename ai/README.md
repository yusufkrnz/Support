# Destek Hizmeti AI Servisi

Bu servis, destek hizmeti uygulaması için duygu analizi ve chatbot işlevselliği sağlar.

## Özellikler

- Türkçe duygu analizi (sentiment analysis)
- Kural tabanlı chatbot
- MySQL veritabanı entegrasyonu
- RESTful API

## Kurulum

### Gereksinimler

- Python 3.8+
- MySQL veritabanı
- pip

### Adımlar

1. Gerekli paketleri yükleyin:

```bash
pip install -r requirements.txt
```

2. `.env` dosyasını düzenleyin:

```
# Veritabanı ayarları
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=support_ai

# Model ayarları
MODEL_NAME=dbmdz/bert-base-turkish-cased
USE_CUDA=False

# API ayarları
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=True
```

3. MySQL veritabanını oluşturun:

```sql
CREATE DATABASE support_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Çalıştırma

```bash
python app.py
```

veya

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## API Kullanımı

### Duygu Analizi

```
POST /analyze
```

İstek:

```json
{
  "text": "Bu ürün gerçekten harika, çok memnun kaldım!"
}
```

Yanıt:

```json
{
  "result": "HARIKA",
  "confidence": 0.92
}
```

### Chatbot

```
POST /chat
```

İstek:

```json
{
  "text": "Merhaba, ürün iadesi yapmak istiyorum",
  "context": []
}
```

Yanıt:

```json
{
  "response": "İade işlemleri için 14 gün süreniz bulunmaktadır. Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir.",
  "suggested_actions": ["İade Talebi Oluştur", "İade Koşullarını Gör", "Değişim Talebi"]
}
```

## Swagger Dokümantasyonu

API dokümantasyonuna erişmek için:

```
http://localhost:8000/docs
```

## Notlar

- Eğer Hugging Face transformers modeli yüklenirken sorun yaşanırsa, sistem otomatik olarak daha basit bir model (TF-IDF + Logistic Regression) kullanacaktır.
- Chatbot şu anda kural tabanlıdır ve basit anahtar kelime eşleştirmesi kullanmaktadır.
- Veritabanı, analiz sonuçlarını saklamak için kullanılır ve ileride model iyileştirmeleri için veri toplamaya yardımcı olur. 