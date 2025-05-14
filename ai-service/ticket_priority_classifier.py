import os
import json
import logging
import requests
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ollama (Llama) configuration
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/generate")
LLAMA_MODEL = os.getenv("LLAMA_MODEL", "llama3")

def classify_ticket_priority(title: str, description: str, category: str = None) -> Dict[str, Any]:
    """
    Destek talebi içeriğini analiz ederek öncelik seviyesini belirler
    
    Args:
        title: Talep başlığı
        description: Talep açıklaması
        category: Talep kategorisi (opsiyonel)
        
    Returns:
        Dict containing priority level, confidence score, and reasoning
    """
    try:
        logger.info(f"Classifying ticket priority for: {title}")
        
        # Prepare prompt for Llama
        prompt = f"""
        Aşağıdaki destek talebini analiz et ve öncelik seviyesini belirle:
        
        Başlık: "{title}"
        Açıklama: "{description}"
        {"Kategori: " + category if category else ""}
        
        Aşağıdaki kriterlere göre değerlendir:
        1. DÜŞÜK: Acil olmayan, standart talep veya bilgi sorusu
        2. NORMAL: Normal işlem gerektiren, makul sürede yanıt verilmesi gereken talep
        3. YÜKSEK: Hızlı yanıt gerektiren, müşteri memnuniyeti için önemli talep
        4. ACİL: Derhal müdahale gerektiren, kritik sorun veya ciddi müşteri mağduriyeti
        
        Sadece aşağıdaki JSON formatında yanıt ver:
        {{
            "priority": "DÜŞÜK/NORMAL/YÜKSEK/ACİL",
            "confidence": float, (0.0-1.0 arası bir değer, emin olma düzeyi)
            "reasoning": "Öncelik seviyesi hakkında kısa açıklama",
            "tags": ["öneri1", "öneri2"] (talep için uygun etiketler)
        }}
        """
        
        # Call Ollama API (local Llama)
        payload = {
            "model": LLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "temperature": 0.2,
            "max_tokens": 1024
        }
        
        response = requests.post(
            OLLAMA_API_URL,
            json=payload,
            timeout=30.0
        )
        
        if response.status_code != 200:
            logger.error(f"Ollama API error: {response.text}")
            raise Exception("Llama API error")
        
        result = response.json()
        text_response = result.get("response", "")
        
        # Extract JSON from the response
        json_str = text_response
        if "```json" in text_response:
            json_str = text_response.split("```json")[1].split("```")[0]
        elif "```" in text_response:
            json_str = text_response.split("```")[1].split("```")[0]
        
        # Parse the JSON response
        try:
            classification = json.loads(json_str.strip())
            return {
                "priority": classification.get("priority", "NORMAL"),
                "confidence": classification.get("confidence", 0.5),
                "reasoning": classification.get("reasoning", ""),
                "tags": classification.get("tags", [])
            }
        except json.JSONDecodeError:
            logger.error(f"JSON parse error from Llama response: {text_response}")
            # Fallback to simple classification
            return fallback_classification(title, description)
            
    except Exception as e:
        logger.error(f"Error in ticket priority classification: {str(e)}")
        return fallback_classification(title, description)


def fallback_classification(title: str, description: str) -> Dict[str, Any]:
    """
    Llama API başarısız olduğunda kullanılacak yedek sınıflandırma sistemi
    """
    combined_text = (title + " " + description).lower()
    
    # Basit anahtar kelime bazlı önceliklendirme
    urgent_keywords = ["acil", "çok önemli", "hemen", "tehlikeli", "ciddi sorun", "sağlık", "güvenlik"]
    high_keywords = ["önemli", "hızlı", "yanlış ürün", "bozuk", "çalışmıyor", "hasarlı"]
    low_keywords = ["bilgi", "soru", "ne zaman", "öğrenmek", "teşekkür"]
    
    if any(word in combined_text for word in urgent_keywords):
        return {
            "priority": "ACİL",
            "confidence": 0.7,
            "reasoning": "Acil anahtar kelimeler tespit edildi",
            "tags": ["acil yanıt gerekli"]
        }
    elif any(word in combined_text for word in high_keywords):
        return {
            "priority": "YÜKSEK",
            "confidence": 0.6,
            "reasoning": "Yüksek öncelik anahtar kelimeleri tespit edildi",
            "tags": ["ürün sorunu"]
        }
    elif any(word in combined_text for word in low_keywords):
        return {
            "priority": "DÜŞÜK",
            "confidence": 0.6,
            "reasoning": "Bilgi talebi olarak değerlendirildi",
            "tags": ["bilgi talebi"]
        }
    else:
        return {
            "priority": "NORMAL",
            "confidence": 0.5,
            "reasoning": "Standart talep olarak değerlendirildi",
            "tags": ["standart talep"]
        }


# API test fonksiyonu
if __name__ == "__main__":
    test_tickets = [
        {
            "title": "Ürün açıklaması gerçeği yansıtmıyor",
            "description": "Satın aldığım ürün açıklamada belirtilen özelliklere sahip değil. Ürün açıklaması gerçeği yansıtmıyor."
        },
        {
            "title": "ACİL: Teslim edilen üründe sağlık sorunu",
            "description": "Bugün teslim aldığım kozmetik üründen alerjik reaksiyon geliştirdim ve hastaneye gittim. Acilen ürün içeriğini öğrenmem gerekiyor."
        },
        {
            "title": "Sipariş durumu hakkında bilgi almak istiyorum",
            "description": "3 gün önce verdiğim siparişimin durumunu öğrenmek istiyorum. Ne zaman kargoya verilecek?"
        }
    ]
    
    for ticket in test_tickets:
        result = classify_ticket_priority(ticket["title"], ticket["description"])
        print(f"\nTicket: {ticket['title']}")
        print(f"Priority: {result['priority']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Reasoning: {result['reasoning']}")
        print(f"Tags: {result['tags']}") 