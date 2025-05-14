from flask import Flask, request, jsonify
from routes import app as routes_app
import logging
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("ai_service.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    
    # CORS ayarları
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Register API routes blueprint
    app.register_blueprint(routes_app, url_prefix='/api')
    
    # Varsayılan URL değeri artık Docker Compose'a uyumlu
    ollama_url = os.getenv('OLLAMA_API_URL', 'http://localhost:11434/api/generate')
    llama_model = os.getenv('OLLAMA_MODEL', 'llama3')
    
    logger.info(f"AI Service initialized and ready to handle requests")
    logger.info(f"Using Ollama API URL: {ollama_url}")
    logger.info(f"Using Llama model: {llama_model}")
    
    @app.after_request
    def add_cors_headers(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'false')
        return response
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """
        Sağlık kontrolü endpoint'i
        """
        logger.info("Health check isteği geldi")
        return jsonify({
            "status": "UP",
            "service": "AI Service",
            "message": "AI servis çalışıyor"
        })
    
    @app.route('/api/gemini', methods=['POST'])
    def gemini_api():
        """
        Gemini API entegrasyonu
        """
        data = request.json
        
        if not data or 'prompt' not in data:
            return jsonify({"error": "Geçersiz istek, 'prompt' alanı gerekli"}), 400
        
        prompt = data['prompt']
        logger.info(f"Gemini API isteği: {prompt[:50]}...")
        
        # Demo yanıt
        demo_response = {
            "text": f"Gemini AI yanıtı: '{prompt}' sorunuza cevaben - Bu bir demo yanıttır."
        }
        
        return jsonify(demo_response)

    @app.route('/api/llama', methods=['POST'])
    def llama_api():
        """
        Llama API entegrasyonu
        """
        data = request.json
        
        if not data or 'prompt' not in data:
            return jsonify({"error": "Geçersiz istek, 'prompt' alanı gerekli"}), 400
        
        prompt = data['prompt']
        logger.info(f"Llama API isteği: {prompt[:50]}...")
        
        # Demo yanıt
        demo_response = {
            "text": f"Llama AI yanıtı: '{prompt}' sorunuza cevaben - Bu bir demo yanıttır."
        }
        
        return jsonify(demo_response)

    @app.route('/api/classify', methods=['POST'])
    def classify_query():
        """
        Kullanıcı mesajını sınıflandır
        """
        data = request.json
        
        if not data or 'query' not in data:
            return jsonify({"error": "Geçersiz istek, 'query' alanı gerekli"}), 400
        
        query = data['query']
        logger.info(f"Sınıflandırma isteği: {query[:50]}...")
        
        # Basit kelime tabanlı sınıflandırma
        query_lower = query.lower()
        
        if 'iade' in query_lower or 'para' in query_lower:
            category = "RETURN"
            confidence = 0.85
        elif 'şikayet' in query_lower or 'memnun değil' in query_lower:
            category = "COMPLAINT"
            confidence = 0.80
        elif 'sipariş' in query_lower or 'teslimat' in query_lower:
            category = "CLASSIC_QUERY"
            confidence = 0.75
        else:
            category = "GENERAL_QUERY"
            confidence = 0.60
        
        return jsonify({
            "category": category,
            "confidence": confidence,
            "query": query
        })
    
    return app

# Create the application
app = create_app()

if __name__ == "__main__":
    # Port değişkeninde varsayılan 8000 olarak ayarlıyoruz
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    
    logger.info(f"Starting AI Service on port {port} with debug={debug}")
    app.run(host="0.0.0.0", port=port, debug=debug) 