import re
import random
from typing import Dict, List, Tuple, Any, Optional
from utils.preprocessing import preprocess_text

# Basit kural tabanlı chatbot için yanıt şablonları
RESPONSE_TEMPLATES = {
    "greeting": [
        "Merhaba! Size nasıl yardımcı olabilirim?",
        "Hoş geldiniz! Destek ekibimize hoş geldiniz. Size nasıl yardımcı olabilirim?",
        "Merhaba! Destek hattına hoş geldiniz. Nasıl yardımcı olabilirim?"
    ],
    "farewell": [
        "Görüşmek üzere! Başka bir sorunuz olursa bize ulaşabilirsiniz.",
        "İyi günler! Herhangi bir sorunuz olursa tekrar yazabilirsiniz.",
        "Hoşça kalın! Yardıma ihtiyacınız olursa buradayız."
    ],
    "thanks": [
        "Rica ederim! Başka bir konuda yardıma ihtiyacınız var mı?",
        "Ne demek, yardımcı olabildiysem ne mutlu bana!",
        "Rica ederim, başka sorunuz varsa yanıtlamaktan memnuniyet duyarım."
    ],
    "product_info": [
        "Ürünlerimiz hakkında bilgi almak için lütfen ürün adını veya kodunu belirtir misiniz?",
        "Hangi ürünümüz hakkında bilgi almak istiyorsunuz?",
        "Size ürünlerimiz hakkında yardımcı olmak isterim. Hangi ürünle ilgileniyorsunuz?"
    ],
    "order_status": [
        "Sipariş durumunuzu kontrol etmek için sipariş numaranızı paylaşır mısınız?",
        "Sipariş takibi için sipariş numaranıza ihtiyacım var. Paylaşabilir misiniz?",
        "Siparişinizin durumunu öğrenmek için lütfen sipariş numaranızı belirtin."
    ],
    "return_policy": [
        "İade politikamız şu şekildedir: Ürünü satın aldıktan sonraki 14 gün içinde iade edebilirsiniz.",
        "Ürünlerimizi 14 gün içinde iade edebilirsiniz. İade işlemi için müşteri hizmetlerimizle iletişime geçmeniz yeterli.",
        "İade işlemleri için 14 gün süreniz bulunmaktadır. Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir."
    ],
    "shipping_info": [
        "Kargo bilgilerinizi kontrol etmek için sipariş numaranızı paylaşır mısınız?",
        "Siparişinizin kargo durumunu öğrenmek için sipariş numaranıza ihtiyacım var.",
        "Kargo takibi için lütfen sipariş numaranızı belirtin."
    ],
    "complaint": [
        "Şikayetinizi dikkate alıyoruz. Detayları paylaşabilir misiniz?",
        "Yaşadığınız sorunu çözmek için elimizden geleni yapacağız. Lütfen detayları paylaşın.",
        "Sorununuzu çözmek için buradayız. Lütfen yaşadığınız problemi detaylandırır mısınız?"
    ],
    "representative": [
        "Müşteri temsilcimizle görüşmek istediğinizi not aldım. Sizi en kısa sürede bir temsilcimize yönlendireceğim.",
        "Talebinizi aldım, bir müşteri temsilcimiz sizinle en kısa sürede iletişime geçecek.",
        "Müşteri temsilcimize bağlanma talebinizi aldım. Kısa süre içinde bir temsilcimiz sizinle ilgilenecek."
    ],
    "default": [
        "Anlamadım, lütfen daha açık bir şekilde belirtir misiniz?",
        "Bu konuda size yardımcı olmak isterim. Lütfen biraz daha açıklayıcı olabilir misiniz?",
        "Üzgünüm, tam olarak anlayamadım. Lütfen sorunuzu farklı bir şekilde ifade edebilir misiniz?"
    ]
}

# Anahtar kelime eşleştirmeleri
KEYWORD_PATTERNS = {
    "greeting": r"\b(merhaba|selam|günaydın|iyi\s*günler|iyi\s*akşamlar|nasılsın)\b",
    "farewell": r"\b(hoşça\s*kal|görüşürüz|bye|güle\s*güle|iyi\s*günler|iyi\s*akşamlar)\b",
    "thanks": r"\b(teşekkür|teşekkürler|sağol|sağolun|teşekkür\s*ederim)\b",
    "product_info": r"\b(ürün|ürünler|ürün\s*bilgisi|ürün\s*özellikleri|fiyat|fiyatlar)\b",
    "order_status": r"\b(sipariş|siparişim|sipariş\s*durumu|ne\s*zaman\s*gelecek)\b",
    "return_policy": r"\b(iade|geri\s*iade|para\s*iadesi|ürün\s*iadesi|değişim)\b",
    "shipping_info": r"\b(kargo|teslimat|ne\s*zaman\s*gelir|kargo\s*takip|kargo\s*durumu)\b",
    "complaint": r"\b(şikayet|sorun|problem|hata|yanlış|bozuk|arızalı|çalışmıyor)\b",
    "representative": r"\b(temsilci|müşteri\s*temsilcisi|gerçek\s*kişi|insanla\s*görüşmek|canlı\s*destek)\b"
}

def get_intent(text: str) -> str:
    """
    Metinden niyet (intent) çıkarımı yapar.
    """
    # Metni ön işle
    processed_text = preprocess_text(text, remove_stops=False)
    
    # Her bir anahtar kelime kalıbını kontrol et
    for intent, pattern in KEYWORD_PATTERNS.items():
        if re.search(pattern, processed_text, re.IGNORECASE):
            return intent
    
    # Eşleşme bulunamazsa varsayılan niyet
    return "default"

def generate_response(text: str, context: Optional[List[Dict[str, Any]]] = None) -> Tuple[str, List[str]]:
    """
    Kullanıcı mesajına yanıt üretir.
    """
    # Niyet çıkarımı yap
    intent = get_intent(text)
    
    # İlgili yanıt şablonlarından rastgele bir yanıt seç
    response_templates = RESPONSE_TEMPLATES.get(intent, RESPONSE_TEMPLATES["default"])
    response = random.choice(response_templates)
    
    # Önerilen eylemler
    suggested_actions = []
    
    # Niyete göre önerilen eylemleri belirle
    if intent == "product_info":
        suggested_actions = ["Ürün Kataloğu", "Fiyat Listesi", "Kampanyalar"]
    elif intent == "order_status":
        suggested_actions = ["Sipariş Takibi", "Sipariş İptali", "Sipariş Değişikliği"]
    elif intent == "return_policy":
        suggested_actions = ["İade Talebi Oluştur", "İade Koşullarını Gör", "Değişim Talebi"]
    elif intent == "shipping_info":
        suggested_actions = ["Kargo Takibi", "Teslimat Adresi Değiştir", "Teslimat Saati Seç"]
    elif intent == "complaint":
        suggested_actions = ["Şikayet Oluştur", "Müşteri Temsilcisiyle Görüş", "Geri Bildirim Gönder"]
    elif intent == "representative":
        suggested_actions = ["Müşteri Temsilcisine Bağlan"]
    
    return response, suggested_actions 