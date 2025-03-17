import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# Veritabanı ayarları
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "support_ai")

# Veritabanı bağlantı URL'si
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Model ayarları
MODEL_NAME = os.getenv("MODEL_NAME", "dbmdz/bert-base-turkish-cased")
DEVICE = "cuda" if os.getenv("USE_CUDA", "False").lower() == "true" else "cpu"

# API ayarları
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
API_DEBUG = os.getenv("API_DEBUG", "True").lower() == "true"

# Derecelendirme eşleştirmeleri
RATING_MAPPING = {
    "NORMAL": "NORMAL",
    "FENA_DEGIL": "FENA_DEGIL",
    "IYI": "IYI",
    "COK_IYI": "COK_IYI",
    "HARIKA": "HARIKA"
}

# Sentiment analizi eşleştirmeleri
SENTIMENT_MAPPING = {
    "negative": "NORMAL",
    "neutral": "FENA_DEGIL",
    "positive": "HARIKA"
} 