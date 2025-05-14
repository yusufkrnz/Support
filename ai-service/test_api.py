import requests
import base64
import json
import os
from pprint import pprint

# API adresini yapılandırma
API_BASE_URL = "http://localhost:8000"

def test_return_evaluation():
    """
    İade değerlendirme API'sini test eder
    """
    print("\n=== İade Değerlendirme Testi ===")
    
    # Test verileri
    data = {
        "reason": "Ürün beklediğim gibi değil",
        "description": "Aldığım ürün web sitesinde göründüğünden çok daha küçük. Beklentilerimi karşılamadı.",
        "companyName": "TechStore",
        "image_base64": None  # Basitlik için görsel eklemedik
    }
    
    # API isteği gönder
    response = requests.post(f"{API_BASE_URL}/api/evaluate-return", json=data)
    
    # Yanıtı kontrol et
    if response.status_code == 200:
        result = response.json()
        print("Başarılı! İade değerlendirme sonucu:")
        pprint(result)
    else:
        print(f"Hata: {response.status_code}")
        print(response.text)

def test_full_return_evaluation():
    """
    Gelişmiş iade değerlendirme API'sini test eder
    """
    print("\n=== Gelişmiş İade Değerlendirme Testi ===")
    
    # Test verileri
    data = {
        "reason": "Ürün hasarlı geldi",
        "description": "Kargoda ürün zarar görmüş, kutusu ezik ve içindeki parçalar kırık.",
        "companyName": "TechStore",
        "image_base64": None
    }
    
    # API isteği gönder
    response = requests.post(f"{API_BASE_URL}/api/returns/evaluate-full", json=data)
    
    # Yanıtı kontrol et
    if response.status_code == 200:
        result = response.json()
        print("Başarılı! Gelişmiş iade değerlendirme sonucu:")
        pprint(result)
    else:
        print(f"Hata: {response.status_code}")
        print(response.text)

def test_image_validation():
    """
    Görsel doğrulama API'sini test eder (görseli Base64'e çevirerek)
    """
    print("\n=== Görsel Doğrulama Testi ===")
    
    # Örnek bir görsel yükle (test için)
    image_path = "sample_image.jpg"  # Bu dosyayı oluşturun veya var olan bir görsel yolu girin
    
    # Görsel dosyası yoksa testi atla
    if not os.path.exists(image_path):
        print(f"Uyarı: Test görseli bulunamadı: {image_path}")
        return
    
    # Görseli Base64'e çevir
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    
    # Test verileri
    data = {
        "returnReason": "Ürün hasarlı geldi",
        "explanation": "Kargoda ürün zarar görmüş, kutusu ezik ve içindeki parçalar kırık.",
        "image": encoded_string
    }
    
    # API isteği gönder
    response = requests.post(f"{API_BASE_URL}/api/returns/validate-image", json=data)
    
    # Yanıtı kontrol et
    if response.status_code == 200:
        result = response.json()
        print("Başarılı! Görsel doğrulama sonucu:")
        # Uzun base64 verisi çıktıyı karmaşık hale getirmesin diye kısaltılmış özeti göster
        if "data" in result and "validation" in result["data"]:
            if "image" in result["data"]["validation"]:
                result["data"]["validation"]["image"] = "[BASE64_DATA_TRUNCATED]"
        pprint(result)
    else:
        print(f"Hata: {response.status_code}")
        print(response.text)

def test_query_classification():
    """
    Sorgu etiketleme API'sini test eder
    """
    print("\n=== Sorgu Etiketleme Testi ===")
    
    # Test sorguları
    queries = [
        "Aldığım ürünü iade etmek istiyorum, hasarlı geldi",
        "Siparişim hala gelmedi, nerede kaldı?",
        "Ürününüzden memnun kalmadım, şikayet etmek istiyorum",
        "Hesap bilgilerimi güncellemek istiyorum"
    ]
    
    for query in queries:
        print(f"\nTest sorgusu: '{query}'")
        
        # API isteği gönder
        data = {"query": query}
        response = requests.post(f"{API_BASE_URL}/api/query/classify", json=data)
        
        # Yanıtı kontrol et
        if response.status_code == 200:
            result = response.json()
            print("Başarılı! Etiketleme sonucu:")
            # Sadece sınıflandırma sonucunu göster
            if "data" in result and "classification" in result["data"]:
                print(f"Kategori: {result['data']['classification']['category']}")
                print(f"Güven: {result['data']['classification']['confidence']}")
                print(f"Açıklama: {result['data']['classification']['reasoning']}")
                print("\nGerekli form alanları:")
                if "requiredInfo" in result["data"] and "fields" in result["data"]["requiredInfo"]:
                    for field in result["data"]["requiredInfo"]["fields"]:
                        print(f"- {field['label']} ({field['type']})")
        else:
            print(f"Hata: {response.status_code}")
            print(response.text)

def test_orientation_process():
    """
    Tam yönlendirme sürecini test eder
    """
    print("\n=== Yönlendirme Süreci Testi ===")
    
    # Test sorguları ve beklenen kategorileri
    test_cases = [
        {"query": "Satın aldığım ürünü iade etmek istiyorum", "expected": "RETURN"},
        {"query": "Siparişim ne zaman gelecek?", "expected": "CLASSIC_QUERY"},
        {"query": "Müşteri hizmetleriniz çok kötü!", "expected": "COMPLAINT"},
        {"query": "Nasıl indirim kuponu alabilirim?", "expected": "GENERAL_QUERY"}
    ]
    
    for case in test_cases:
        print(f"\nTest sorgusu: '{case['query']}'")
        print(f"Beklenen kategori: {case['expected']}")
        
        # API isteği gönder
        data = {"query": case["query"]}
        response = requests.post(f"{API_BASE_URL}/api/orientation/process", json=data)
        
        # Yanıtı kontrol et
        if response.status_code == 200:
            result = response.json()
            print("Başarılı! Yönlendirme sonucu:")
            if "data" in result:
                print(f"Kategori: {result['data'].get('category', 'N/A')}")
                print(f"Sonraki adım: {result['data'].get('nextStep', 'N/A')}")
                print(f"Mesaj: {result['data'].get('message', 'N/A')}")
                print(f"Durum: {result['data'].get('status', 'N/A')}")
        else:
            print(f"Hata: {response.status_code}")
            print(response.text)

if __name__ == "__main__":
    print("AI Servisi API Testi Başlatılıyor...")
    
    try:
        # İade işlemleri testleri
        test_return_evaluation()
        test_full_return_evaluation()
        test_image_validation()
        
        # Etiketleme ve yönlendirme testleri
        test_query_classification()
        test_orientation_process()
        
        print("\nTüm testler tamamlandı!")
    except Exception as e:
        print(f"\nHata oluştu: {str(e)}") 