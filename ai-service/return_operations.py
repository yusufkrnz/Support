import logging
import gemini_operations
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def process_return_request(company_name: str, reason: str, description: str, image_base64: Optional[str] = None) -> Dict[str, Any]:
    """
    İade talebini değerlendirir ve sonuç döndürür
    """
    # Gemini modülünü kullanarak değerlendirme
    evaluation_result = await gemini_operations.evaluate_return_request(
        company_name, reason, description, image_base64
    )
    
    # Değerlendirme sonucuna göre işlem
    is_valid = evaluation_result.get("valid", False)
    confidence = evaluation_result.get("confidence", 0)
    reasoning = evaluation_result.get("reasoning", "")
    
    # İade durumuna göre işleme belirleme
    process_status = "APPROVED" if is_valid and confidence > 70 else "PENDING_REVIEW"
    
    if process_status == "PENDING_REVIEW" and confidence < 40:
        process_status = "NEEDS_MORE_INFO"
    
    return {
        "evaluation": evaluation_result,
        "processStatus": process_status,
        "nextSteps": get_next_steps(process_status),
        "customerMessage": get_customer_message(process_status, reasoning)
    }

async def validate_return_images(return_reason: str, explanation: str, image: str) -> Dict[str, Any]:
    """
    İade talebi için yüklenen görselleri doğrular
    """
    # Gemini modülünü kullanarak görsel doğrulama
    validation_result = await gemini_operations.validate_return_photo(
        return_reason, explanation, image
    )
    
    # Doğrulama sonucuna göre işlem
    is_valid = validation_result.get("isValid", False)
    score = validation_result.get("confidenceScore", 0.0)
    
    # Görsel doğrulama durumuna göre işlem belirleme
    image_status = "VALID" if is_valid and score > 0.7 else "INVALID"
    
    if not is_valid and score > 0.4:
        image_status = "NEEDS_REVIEW"
    
    return {
        "validation": validation_result,
        "imageStatus": image_status,
        "requiresAdditionalImages": image_status == "INVALID" or score < 0.5,
        "customerMessage": get_image_validation_message(image_status)
    }

def get_next_steps(process_status: str) -> list:
    """
    İade işleminin sonraki adımlarını belirler
    """
    steps = {
        "APPROVED": ["Müşteriye onay e-postası gönder", "Kargo bilgisi iste", "Ödeme iadesi için finansmanı bilgilendir"],
        "PENDING_REVIEW": ["İnsan operatörüne iade talebini yönlendir", "İlave doküman iste"],
        "NEEDS_MORE_INFO": ["Müşteriden ek bilgi iste", "Ürün fotoğrafı iste"]
    }
    
    return steps.get(process_status, ["İnsan operatörüne iade talebini yönlendir"])

def get_customer_message(process_status: str, reasoning: str) -> str:
    """
    Müşteriye iletilecek mesajı belirler
    """
    messages = {
        "APPROVED": "İade talebiniz onaylanmıştır. Lütfen kargo bilgilerini bekleyiniz.",
        "PENDING_REVIEW": "İade talebiniz incelemeye alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.",
        "NEEDS_MORE_INFO": "İade talebiniz için ek bilgilere ihtiyacımız var. Lütfen talep edilen bilgileri sağlayınız."
    }
    
    return messages.get(process_status, "İade talebiniz alınmıştır.") + f" Değerlendirme: {reasoning}"

def get_image_validation_message(image_status: str) -> str:
    """
    Görsel doğrulama sonucuna göre müşteriye iletilecek mesajı belirler
    """
    messages = {
        "VALID": "Yüklediğiniz görseller iade talebiniz için yeterlidir.",
        "INVALID": "Yüklediğiniz görseller iade talebiniz için uygun değildir. Lütfen daha net görseller yükleyin.",
        "NEEDS_REVIEW": "Yüklediğiniz görseller incelenmektedir. Gerekirse sizinle iletişime geçeceğiz."
    }
    
    return messages.get(image_status, "Görsel değerlendirmesi tamamlandı.") 