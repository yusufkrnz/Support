import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from typing import List

# NLTK kaynaklarını indir
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Türkçe stopwords listesi
try:
    turkish_stopwords = set(stopwords.words('turkish'))
except:
    # Eğer Türkçe stopwords yoksa, boş liste kullan
    turkish_stopwords = set()

def clean_text(text: str) -> str:
    """
    Metni temizler ve ön işleme yapar.
    """
    if not text:
        return ""
    
    # Küçük harfe çevir
    text = text.lower()
    
    # URL'leri kaldır
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # HTML etiketlerini kaldır
    text = re.sub(r'<.*?>', '', text)
    
    # Özel karakterleri kaldır
    text = re.sub(r'[^\w\s]', '', text)
    
    # Fazla boşlukları kaldır
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def remove_stopwords(text: str) -> str:
    """
    Metinden stopwords'leri kaldırır.
    """
    if not text:
        return ""
    
    tokens = word_tokenize(text)
    filtered_tokens = [word for word in tokens if word.lower() not in turkish_stopwords]
    
    return ' '.join(filtered_tokens)

def preprocess_text(text: str, remove_stops: bool = True) -> str:
    """
    Metni tam olarak ön işler.
    """
    text = clean_text(text)
    
    if remove_stops:
        text = remove_stopwords(text)
    
    return text 