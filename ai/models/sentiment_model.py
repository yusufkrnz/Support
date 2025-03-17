import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np
from typing import Dict, Tuple, List, Any
from config import MODEL_NAME, DEVICE, SENTIMENT_MAPPING
from utils.preprocessing import preprocess_text

# Model ve tokenizer'ı yükle
tokenizer = None
model = None

def load_model():
    """
    Transformers modelini yükler.
    """
    global tokenizer, model
    
    if tokenizer is None or model is None:
        try:
            tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
            model.to(DEVICE)
            model.eval()
            print(f"Model '{MODEL_NAME}' başarıyla yüklendi.")
        except Exception as e:
            print(f"Model yüklenirken hata oluştu: {e}")
            # Fallback olarak basit bir model kullan
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.linear_model import LogisticRegression
            import pickle
            import os
            
            # Basit model dosyası var mı kontrol et
            if os.path.exists("models/simple_model.pkl"):
                with open("models/simple_model.pkl", "rb") as f:
                    model = pickle.load(f)
                with open("models/vectorizer.pkl", "rb") as f:
                    tokenizer = pickle.load(f)
                print("Basit model başarıyla yüklendi.")
            else:
                # Basit model oluştur
                tokenizer = TfidfVectorizer(max_features=5000)
                model = LogisticRegression()
                print("Basit model oluşturuldu, eğitilmesi gerekiyor.")

def analyze_sentiment(text: str) -> Tuple[str, float]:
    """
    Metni analiz eder ve duygu durumunu döndürür.
    """
    # Model yüklü değilse yükle
    if tokenizer is None or model is None:
        load_model()
    
    # Metni ön işle
    processed_text = preprocess_text(text)
    
    try:
        # Transformers modeli kullanarak analiz et
        if isinstance(model, AutoModelForSequenceClassification):
            inputs = tokenizer(processed_text, return_tensors="pt", truncation=True, padding=True).to(DEVICE)
            with torch.no_grad():
                outputs = model(**inputs)
            
            # Softmax uygula
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            
            # En yüksek olasılıklı sınıfı al
            predicted_class_id = torch.argmax(probs, dim=-1).item()
            confidence = probs[0][predicted_class_id].item()
            
            # Sınıf etiketini al
            if model.config.id2label:
                predicted_label = model.config.id2label[predicted_class_id]
            else:
                # Varsayılan etiketler
                labels = ["negative", "neutral", "positive"]
                predicted_label = labels[predicted_class_id % len(labels)]
        else:
            # Basit model kullanarak analiz et
            features = tokenizer.transform([processed_text])
            predicted_class_id = model.predict(features)[0]
            confidence = max(model.predict_proba(features)[0])
            
            # Basit model için etiketler
            labels = ["negative", "neutral", "positive"]
            predicted_label = labels[predicted_class_id % len(labels)]
        
        # Etiket eşleştirmesi
        result = SENTIMENT_MAPPING.get(predicted_label, "NORMAL")
        
        return result, confidence
    
    except Exception as e:
        print(f"Analiz sırasında hata oluştu: {e}")
        # Hata durumunda varsayılan değer döndür
        return "NORMAL", 0.0

def train_simple_model(texts: List[str], labels: List[str]) -> None:
    """
    Basit bir model eğitir ve kaydeder.
    """
    global tokenizer, model
    
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    import pickle
    import os
    
    # Metinleri ön işle
    processed_texts = [preprocess_text(text) for text in texts]
    
    # Vektörleştirici ve model oluştur
    tokenizer = TfidfVectorizer(max_features=5000)
    X = tokenizer.fit_transform(processed_texts)
    
    # Etiketleri sayısal değerlere dönüştür
    label_map = {"negative": 0, "neutral": 1, "positive": 2}
    y = [label_map.get(label, 1) for label in labels]
    
    # Modeli eğit
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)
    
    # Modeli kaydet
    os.makedirs("models", exist_ok=True)
    with open("models/simple_model.pkl", "wb") as f:
        pickle.dump(model, f)
    with open("models/vectorizer.pkl", "wb") as f:
        pickle.dump(tokenizer, f)
    
    print("Basit model başarıyla eğitildi ve kaydedildi.") 