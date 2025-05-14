from flask import Blueprint, request, jsonify
import asyncio
import logging
import json
from llama_operations import classify_query, process_general_query, get_required_info_for_category, analyze_complex_query, process_philosophical_query

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint with no prefix - prefix will be added when registered
app = Blueprint('api', __name__)

@app.route('/process-query', methods=['POST'])
def process_query():
    try:
        logger.info("===== AI-SERVICE ADIM 1: /process-query endpointi çağrıldı =====")
        data = request.json
        
        if not data or 'query' not in data:
            logger.error("Eksik veri: 'query' alanı bulunamadı")
            return jsonify({
                'error': True,
                'message': 'Query field is required'
            }), 400
        
        query_text = data['query']
        query_type = data.get('queryType', None)
        logger.info(f"===== AI-SERVICE ADIM 2: Sorgu işleniyor =====")
        logger.info(f"Sorgu metni: {query_text}")
        logger.info(f"Sorgu tipi: {query_type}")
        
        # Check if this is a philosophical query
        if query_type and query_type == "PHILOSOPHICAL_QUERY":
            logger.info("===== AI-SERVICE ADIM 3: Felsefi sorgu işleniyor =====")
            # Use a specialized prompt for philosophical questions
            result = process_philosophical_query(query_text)
            logger.info(f"Felsefi sorgu yanıtı: {result.get('answer', 'Yanıt yok')}")
        else:
            # Process the general query using Llama
            logger.info("===== AI-SERVICE ADIM 3: Genel sorgu işleniyor =====")
            result = process_general_query(query_text)
            logger.info(f"Genel sorgu yanıtı: {result.get('answer', 'Yanıt yok')}")
        
        logger.info("===== AI-SERVICE ADIM 4: Yanıt döndürülüyor =====")
        logger.info(f"Yanıt: {json.dumps(result, ensure_ascii=False)[:200]}...")
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"===== AI-SERVICE HATA: Sorgu işleme hatası: {str(e)} =====")
        return jsonify({
            'error': True,
            'message': f"Server error: {str(e)}"
        }), 500

@app.route('/classify', methods=['POST'])
def classify():
    try:
        logger.info("===== AI-SERVICE ADIM 1: /classify endpointi çağrıldı =====")
        data = request.json
        
        if not data or 'query' not in data:
            logger.error("Eksik veri: 'query' alanı bulunamadı")
            return jsonify({
                'error': True,
                'message': 'Query field is required'
            }), 400
        
        query_text = data['query']
        logger.info(f"===== AI-SERVICE ADIM 2: Sorgu sınıflandırılıyor: {query_text} =====")
        
        # Run the async function in a synchronous context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        classification_result = loop.run_until_complete(classify_query(query_text))
        loop.close()
        
        logger.info(f"===== AI-SERVICE ADIM 3: Sınıflandırma sonucu =====")
        logger.info(f"Kategori: {classification_result.get('category', 'Kategori yok')}")
        logger.info(f"Güven: {classification_result.get('confidence', 0)}")
        logger.info(f"Açıklama: {classification_result.get('reasoning', 'Açıklama yok')}")
        
        return jsonify(classification_result)
    
    except Exception as e:
        logger.error(f"===== AI-SERVICE HATA: Sınıflandırma hatası: {str(e)} =====")
        return jsonify({
            'error': True,
            'message': f"Server error: {str(e)}"
        }), 500

@app.route('/get-required-info', methods=['POST'])
def get_required_info():
    try:
        logger.info("===== AI-SERVICE ADIM 1: /get-required-info endpointi çağrıldı =====")
        data = request.json
        
        if not data or 'category' not in data:
            logger.error("Eksik veri: 'category' alanı bulunamadı")
            return jsonify({
                'error': True,
                'message': 'Category field is required'
            }), 400
        
        category = data['category']
        logger.info(f"===== AI-SERVICE ADIM 2: Kategori bilgisi alınıyor: {category} =====")
        
        # Run the async function in a synchronous context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        info_result = loop.run_until_complete(get_required_info_for_category(category))
        loop.close()
        
        logger.info(f"===== AI-SERVICE ADIM 3: Kategori bilgisi alındı =====")
        logger.info(f"Form alanları: {len(info_result.get('fields', []))} adet")
        
        return jsonify(info_result)
    
    except Exception as e:
        logger.error(f"===== AI-SERVICE HATA: Kategori bilgisi alma hatası: {str(e)} =====")
        return jsonify({
            'error': True,
            'message': f"Server error: {str(e)}"
        }), 500

@app.route('/analyze', methods=['POST'])
def analyze_complex():
    try:
        logger.info("===== AI-SERVICE ADIM 1: /analyze endpointi çağrıldı =====")
        data = request.json
        
        if not data or 'query' not in data:
            logger.error("Eksik veri: 'query' alanı bulunamadı")
            return jsonify({
                'error': True,
                'message': 'Query field is required'
            }), 400
        
        query_text = data['query']
        context = data.get('context', '')
        logger.info(f"===== AI-SERVICE ADIM 2: Karmaşık sorgu analiz ediliyor: {query_text} =====")
        logger.info(f"Bağlam: {context[:100]}...")
        
        # Process the complex query
        result = analyze_complex_query(query_text, context)
        
        logger.info(f"===== AI-SERVICE ADIM 3: Analiz sonucu =====")
        logger.info(f"Uzman yardımı gerekli: {result.get('requiresExpertHelp', False)}")
        logger.info(f"Önerilen eylem sayısı: {len(result.get('recommendedActions', []))}")
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"===== AI-SERVICE HATA: Karmaşık sorgu analiz hatası: {str(e)} =====")
        return jsonify({
            'error': True,
            'message': f"Server error: {str(e)}"
        }), 500 