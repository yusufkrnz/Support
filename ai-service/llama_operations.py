import os
import json
import logging
import httpx
import requests
import time
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

# Ollama (Llama) configuration
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/generate")
LLAMA_MODEL = os.getenv("LLAMA_MODEL", "llama3")
LLAMA_MAX_TOKENS = int(os.getenv("LLAMA_MAX_TOKENS", "2048"))
LLAMA_TEMPERATURE = float(os.getenv("LLAMA_TEMPERATURE", "0.3"))
FORCE_TURKISH = True  # Her zaman Türkçe yanıt üretilmesini sağlar

# Logları renkli göstermek için fonksiyon
def log_step(step, message):
    logger.info(f"===== {step}: {message} =====")

async def classify_query(query_text: str) -> Dict[str, Any]:
    """
    Kullanıcı sorgusunu Llama3 modeliyle analiz eder ve sınıflandırır
    """
    try:
        log_step("SİSTEM", "Sorgu sınıflandırma başlatılıyor")
        
        # Prepare prompt for Llama
        prompt = f"""
        Aşağıdaki kullanıcı sorgusunu analiz et ve müşteri desteği kategorilerinden birine sınıflandır:
        
        Kullanıcı Sorgusu: "{query_text}"
        
        Sınıflandırma seçenekleri:
        1. RETURN: İade talebi (ürün iadesi istekleri)
        2. COMPLAINT: Şikayet (ürün, hizmet, personel vb. şikayetleri)
        3. CLASSIC_QUERY: Temel sorgu (sipariş durumu, hesap bilgileri, CRUD işlemleri)
        4. PHILOSOPHICAL_QUERY: Felsefi sorgu (hayat, varoluş, anlam ile ilgili felsefi sorular)
        5. GENERAL_QUERY: Genel sorgu (yukarıdaki kategorilere girmeyen diğer destek soruları)
        
        Sadece aşağıdaki JSON formatında yanıt ver:
        {{
            "category": "RETURN/COMPLAINT/CLASSIC_QUERY/PHILOSOPHICAL_QUERY/GENERAL_QUERY",
            "confidence": float, (0.0-1.0 arası bir değer, emin olma düzeyi)
            "reasoning": "Neden bu kategoriye girdiğine dair kısa açıklama"
        }}
        """
        
        log_step("LLAMA", "Sınıflandırma promptu hazırlandı")
        
        # Call Ollama API (local Llama)
        payload = {
            "model": "llama3",
            "prompt": prompt,
            "stream": False,
            "temperature": 0.2,
            "max_tokens": 1024
        }
        
        try:
            log_step("API", "Ollama API'sine sınıflandırma isteği gönderiliyor")
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    OLLAMA_API_URL,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    logger.error(f"Ollama API error: {response.text}")
                    raise Exception("Llama API error")
                
                log_step("API", "Ollama API'sinden sınıflandırma yanıtı alındı")
                result = response.json()
                text_response = result.get("response", "")
                
                # Extract JSON from the response
                json_str = text_response
                if "```json" in text_response:
                    json_str = text_response.split("```json")[1].split("```")[0]
                elif "```" in text_response:
                    json_str = text_response.split("```")[1].split("```")[0]
                
                # Parse the JSON response
                classification = json.loads(json_str.strip())
                
                log_step("SONUÇ", f"Sınıflandırma sonucu: {classification.get('category')}")
                return {
                    "category": classification.get("category", "GENERAL_QUERY"),
                    "confidence": classification.get("confidence", 0.5),
                    "reasoning": classification.get("reasoning", ""),
                    "original_query": query_text
                }
        
        except Exception as e:
            logger.warning(f"Error calling Ollama API: {str(e)}. Using fallback classification.")
            
            # Fallback to simple keyword-based classification
            query_lower = query_text.lower()
            
            if any(term in query_lower for term in ["iade", "geri", "para iadesi", "return"]):
                category = "RETURN"
                confidence = 0.7
                reason = "İade ile ilgili anahtar kelimeler tespit edildi."
            elif any(term in query_lower for term in ["şikayet", "memnun değil", "kötü", "complaint"]):
                category = "COMPLAINT"
                confidence = 0.7
                reason = "Şikayet ile ilgili anahtar kelimeler tespit edildi."
            elif any(term in query_lower for term in ["hesap", "sipariş", "durum", "güncelle", "ekle", "sil"]):
                category = "CLASSIC_QUERY"
                confidence = 0.7
                reason = "Temel sorgu ile ilgili anahtar kelimeler tespit edildi."
            elif any(term in query_lower for term in ["hayat", "yaşam", "anlam", "felsefe", "varoluş", "anlat", "kelime ile", "kelimeyle", "özetle"]):
                category = "PHILOSOPHICAL_QUERY"
                confidence = 0.8
                reason = "Felsefi veya hayatla ilgili sorgular tespit edildi."
            else:
                category = "GENERAL_QUERY"
                confidence = 0.5
                reason = "Belirli bir kategoriye girmedi, genel sorgu olarak değerlendirildi."
            
            log_step("FALLBACK", f"Keyword bazlı sınıflandırma: {category}")
            return {
                "category": category,
                "confidence": confidence,
                "reasoning": reason,
                "original_query": query_text
            }
    
    except Exception as e:
        logger.error(f"Error in query classification: {str(e)}")
        return {
            "category": "GENERAL_QUERY",
            "confidence": 0.0,
            "reasoning": f"Sınıflandırma hatası: {str(e)}",
            "original_query": query_text
        }

async def get_required_info_for_category(category: str) -> Dict[str, Any]:
    """
    Kategoriye göre gerekli bilgileri belirler
    """
    required_info = {
        "RETURN": {
            "fields": [
                {"name": "returnReason", "type": "select", "label": "İade Nedeni", 
                 "options": ["Ürün hasarlı geldi", "Yanlış ürün geldi", "Ürün beklentileri karşılamadı", "Fikir değişikliği", "Diğer"]},
                {"name": "explanation", "type": "textarea", "label": "Açıklama"},
                {"name": "image", "type": "file", "label": "Ürün Fotoğrafı", "accept": "image/*"}
            ],
            "requiredValidation": True,
            "validationEndpoint": "/api/returns/validate-image",
            "nextStep": "GEMINI_VALIDATION"
        },
        "COMPLAINT": {
            "fields": [
                {"name": "title", "type": "text", "label": "Şikayet Başlığı"},
                {"name": "unit", "type": "select", "label": "İlgili Birim", 
                 "options": ["Ürün Kalitesi", "Kargo/Teslimat", "Müşteri Hizmetleri", "Web Sitesi/Uygulama", "Diğer"]},
                {"name": "description", "type": "textarea", "label": "Detaylı Açıklama"}
            ],
            "requiredValidation": False,
            "nextStep": "LLAMA_ANALYSIS"
        },
        "CLASSIC_QUERY": {
            "fields": [
                {"name": "queryType", "type": "select", "label": "Sorgu Tipi",
                 "options": ["Sipariş Durumu", "Hesap Bilgileri", "Ürün Bilgileri", "Diğer"]}
            ],
            "requiredValidation": False,
            "nextStep": "CORE_SERVICE"
        },
        "PHILOSOPHICAL_QUERY": {
            "fields": [
                {"name": "message", "type": "textarea", "label": "Daha fazla detay eklemek ister misiniz?"}
            ],
            "requiredValidation": False,
            "nextStep": "LLAMA_SERVICE"
        },
        "GENERAL_QUERY": {
            "fields": [
                {"name": "message", "type": "textarea", "label": "Mesajınız"}
            ],
            "requiredValidation": False,
            "nextStep": "LLAMA_SERVICE"
        }
    }
    
    return required_info.get(category, required_info["GENERAL_QUERY"])

def process_general_query(query: str) -> Dict[str, Any]:
    """
    Java LlamaConnector'dan gelen genel sorguları işler
    """
    try:
        log_step("LLAMA-OPS", f"Genel sorgu işleme başladı: {query}")
        
        # Dil zorlaması için ek talimat
        language_instruction = "\nYanıtını her zaman Türkçe dilinde ver." if FORCE_TURKISH else ""
        
        # Prepare prompt for Llama
        prompt = f"""
        Aşağıdaki kullanıcı sorgusunu yanıtla. Bu bir e-ticaret destek platformu için sorulmuş sorulardır:
        
        Kullanıcı Sorgusu: "{query}"
        
        Soruya mümkün olduğunca kısa ve net yanıt ver. Eğer soru çok karmaşıksa veya yanıtlayamayacağın bir şeyse, 
        neden yanıtlayamadığını ve alternatif seçenekleri belirt.{language_instruction}
        """
        
        log_step("LLAMA-OPS", "Genel sorgu promptu hazırlandı")
        
        payload = {
            "model": "llama3",
            "prompt": prompt,
            "stream": False,
            "temperature": 0.3,
            "max_tokens": 1024
        }
        
        log_step("LLAMA-OPS", "Ollama API'ye genel sorgu isteği gönderiliyor")
        # Call Ollama API (local Llama)
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=30.0)
        
        if response.status_code != 200:
            logger.error(f"Ollama API error: {response.text}")
            raise Exception("Llama API error")
        
        log_step("LLAMA-OPS", "Ollama API'den genel sorgu yanıtı alındı")
        result = response.json()
        text_response = result.get("response", "")
        
        log_step("LLAMA-OPS", f"İşlem tamamlandı, yanıt: {text_response[:50]}...")
        
        return {
            "answer": text_response.strip(),
            "model": "llama3",
            "process_time": time.time()
        }
        
    except Exception as e:
        logger.error(f"===== LLAMA-OPS HATA: Genel sorgu işleme hatası: {str(e)} =====")
        return {
            "error": True,
            "message": f"Error processing query: {str(e)}",
            "answer": "Üzgünüm, şu anda bu soruyu yanıtlayamıyorum."
        }

def process_philosophical_query(query: str) -> Dict[str, Any]:
    """
    Felsefi sorguları Llama3 modeliyle işler
    """
    try:
        log_step("LLAMA-OPS", f"Felsefi sorgu işleme başladı: {query}")
        
        # Dil zorlaması için ek talimat
        language_instruction = "\nYanıtını her zaman Türkçe dilinde ver." if FORCE_TURKISH else ""
        
        # Felsefi sorulara özel bir prompt hazırla
        prompt = f"""
        Aşağıdaki felsefi/varoluşsal soruyu düşünceli bir şekilde yanıtla:
        
        Kullanıcı Sorusu: "{query}"
        
        Bu soruyu bir filozof olarak ele al ve derinlikli ama özlü bir cevap ver. 
        Yanıtın düşündürücü ve anlamlı olmalı, ancak çok uzun olmamalı.
        Gereksiz akademik terimlerden kaçın ve anlaşılır bir dil kullan.{language_instruction}
        """
        
        log_step("LLAMA-OPS", "Felsefi sorgu promptu hazırlandı")
        
        payload = {
            "model": "llama3",
            "prompt": prompt,
            "stream": False,
            "temperature": 0.5,  # Daha yaratıcı yanıtlar için
            "max_tokens": 1024
        }
        
        log_step("LLAMA-OPS", "Ollama API'ye felsefi sorgu isteği gönderiliyor")
        # Call Ollama API (local Llama)
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=30.0)
        
        if response.status_code != 200:
            logger.error(f"Ollama API error: {response.text}")
            raise Exception("Llama API error")
        
        log_step("LLAMA-OPS", "Ollama API'den felsefi sorgu yanıtı alındı")
        result = response.json()
        text_response = result.get("response", "")
        
        # Eğer sorulan soru "hayatı 3 kelime ile anlat" gibi bir şeyse
        query_lower = query.lower()
        if ("kelime" in query_lower and "anlat" in query_lower) or ("kelimeyle" in query_lower):
            log_step("LLAMA-OPS", "'X kelime ile anlat' tipinde sorgu tespit edildi")
            words_count = 3  # Varsayılan
            if "3" in query_lower or "üç" in query_lower:
                words_count = 3
            elif "5" in query_lower or "beş" in query_lower:
                words_count = 5
            
            logger.info(f"Kelime sınırı: {words_count}")
            
            # Yanıt uzunsa, sadece belirtilen kelime sayısı kadar al
            words = text_response.split()
            if len(words) > words_count:
                text_response = ", ".join(words[:words_count])
                logger.info(f"Yanıt kısaltıldı: {text_response}")
        
        log_step("LLAMA-OPS", f"İşlem tamamlandı, yanıt: {text_response[:50]}...")
        
        return {
            "answer": text_response.strip(),
            "model": "llama3",
            "queryType": "PHILOSOPHICAL_QUERY",
            "process_time": time.time()
        }
        
    except Exception as e:
        logger.error(f"===== LLAMA-OPS HATA: Felsefi sorgu işleme hatası: {str(e)} =====")
        
        # Fallback yanıtlar
        query_lower = query.lower()
        fallback_response = "Üzgünüm, bu derin felsefi soruyu şu anda yanıtlayamıyorum."
        
        if "hayat" in query_lower and ("kelime" in query_lower or "3" in query_lower):
            logger.info("===== LLAMA-OPS: 'hayatı 3 kelime ile anlat' için özel fallback yanıtı kullanılıyor =====")
            fallback_response = "Doğum, yaşam, ölüm."
        elif "mutluluk" in query_lower:
            logger.info("===== LLAMA-OPS: 'mutluluk' için özel fallback yanıtı kullanılıyor =====")
            fallback_response = "Anın içinde yaşamak."
        elif "anlam" in query_lower or "amaç" in query_lower:
            logger.info("===== LLAMA-OPS: 'anlam/amaç' için özel fallback yanıtı kullanılıyor =====")
            fallback_response = "Hayatın anlamı kendini bulmaktır."
        
        return {
            "error": True,
            "message": f"Error processing philosophical query: {str(e)}",
            "answer": fallback_response
        }

def analyze_complex_query(query: str, context: str = "") -> Dict[str, Any]:
    """
    Java LlamaConnector'dan gelen karmaşık sorguları analiz eder
    """
    try:
        log_step("LLAMA-OPS", f"Karmaşık sorgu analizi başladı: {query}")
        
        # Dil zorlaması için ek talimat
        language_instruction = "\nYanıtını her zaman Türkçe dilinde ver." if FORCE_TURKISH else ""
        
        # Prepare prompt for Llama
        context_text = f"\nBağlam Bilgisi: {context}" if context else ""
        
        prompt = f"""
        Aşağıdaki karmaşık sorguyu analiz et ve gerekli eylemleri belirle:
        
        Kullanıcı Sorgusu: "{query}"{context_text}
        
        Şu formatta yanıt ver:
        - Bu sorunu otomatik olarak çözebilir misin? (Evet/Hayır)
        - Sorunun detaylı analizi
        - Kullanıcının yapması gereken eylemler (maddeler halinde)
        - Sistemin yapması gereken eylemler (maddeler halinde){language_instruction}
        """
        
        log_step("LLAMA-OPS", "Karmaşık sorgu promptu hazırlandı")
        
        payload = {
            "model": "llama3",
            "prompt": prompt,
            "stream": False,
            "temperature": 0.3,
            "max_tokens": 1500
        }
        
        log_step("LLAMA-OPS", "Ollama API'ye karmaşık sorgu isteği gönderiliyor")
        response = requests.post(
            OLLAMA_API_URL,
            json=payload,
            timeout=30.0
        )
        
        if response.status_code != 200:
            logger.error(f"Ollama API error: {response.text}")
            raise Exception("Llama API error")
        
        log_step("LLAMA-OPS", "Ollama API'den karmaşık sorgu yanıtı alındı")
        result = response.json()
        analysis_text = result.get("response", "")
        
        # Yanıtı analiz et
        requires_expert = "hayır" in analysis_text.lower()[:100]
        
        # Önerilen eylemleri çıkar
        recommended_actions = []
        lines = analysis_text.split("\n")
        for line in lines:
            if line.strip().startswith("-") or line.strip().startswith("*"):
                action = line.strip()[1:].strip()
                if action:
                    recommended_actions.append(action)
        
        log_step("LLAMA-OPS", f"İşlem tamamlandı, analiz: {analysis_text[:50]}...")
        
        return {
            "analysis": analysis_text,
            "requiresExpertHelp": requires_expert,
            "recommendedActions": recommended_actions[:5]  # En fazla 5 öneri
        }
        
    except Exception as e:
        logger.error(f"Error analyzing complex query: {str(e)}")
        return {
            "analysis": f"Karmaşık sorgu analizi sırasında hata oluştu: {str(e)}",
            "requiresExpertHelp": True,
            "recommendedActions": ["Müşteri temsilcisine yönlendir"]
        } 