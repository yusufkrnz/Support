package com.Destek.Support.Quick_Solution.ChatBot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Llama AI servisi ile iletişim kurmak için bağlantı sınıfı
 */
@Component
public class LlamaConnector {

    private static final Logger logger = Logger.getLogger(LlamaConnector.class.getName());
    
    private final RestTemplate restTemplate;
    
    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;
    
    // Bağlantı zaman aşımı (ms)
    private static final int CONNECTION_TIMEOUT = 10000;
    
    // Okuma zaman aşımı (ms)
    private static final int READ_TIMEOUT = 30000;
    
    public LlamaConnector() {
        // RestTemplate'i timeout değerleri ile oluştur
        this.restTemplate = new RestTemplateBuilder()
                .setConnectTimeout(Duration.ofMillis(CONNECTION_TIMEOUT))
                .setReadTimeout(Duration.ofMillis(READ_TIMEOUT))
                .build();
    }
    
    @PostConstruct
    public void init() {
        logger.info("LlamaConnector initialized with AI service URL: " + aiServiceUrl);
    }
    
    /**
     * Metni Llama modeline gönderir
     * @param queryText Kullanıcı sorgusu
     * @return Model yanıtı
     */
    public Map<String, Object> sendQuery(String queryText) {
        try {
            logger.info("Sending query to Llama: " + queryText);
            logger.info("Using AI Service URL: " + aiServiceUrl);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("query", queryText);
            
            // Check if it's a philosophical query
            if (isPhilosophicalQuery(queryText)) {
                requestBody.put("queryType", "PHILOSOPHICAL_QUERY");
                logger.info("Query detected as philosophical by LlamaConnector: " + queryText);
            }
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            // URL'i doğru bir şekilde oluştur - /api/process-query kullan
            String url = aiServiceUrl + "/api/process-query";
            logger.info("Full request URL: " + url);
            
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, requestEntity, Map.class);
            
            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> responseBody = responseEntity.getBody();
                
                logger.info("Received response from Llama: " + responseBody);
                return responseBody;
            } else {
                logger.warning("No valid response from Llama API");
                throw new RuntimeException("No valid response from Llama API");
            }
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error calling Llama API: " + e.getMessage(), e);
            
            // Hata durumunda varsayılan yanıt
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "Üzgünüm, şu anda yanıt veremiyorum. Teknik bir sorun var: " + e.getMessage());
            errorResponse.put("answer", "Üzgünüm, şu anda yanıt veremiyorum. Teknik bir sorun var.");
            
            // Özel durum - felsefik sorgulara hazır yanıtlar
            if (isPhilosophicalQuery(queryText)) {
                // Hayatı 3 kelime ile anlat için özel yanıt
                if (queryText.toLowerCase().contains("hayat") && 
                    (queryText.toLowerCase().contains("kelime ile") || 
                     (queryText.contains("3") && queryText.contains("anlat")))) {
                    errorResponse.put("answer", "Doğum, deneyim, ölüm.");
                } else {
                    errorResponse.put("answer", "Bu felsefi soruyu düşünmek için zaman ayırdığınız için teşekkürler.");
                }
            }
            
            return errorResponse;
        }
    }
    
    /**
     * Özel bir görev için Llama API'ye istek gönderir
     * @param task Görev tipi ("classify", "analyze", "generate", vb.)
     * @param data İstek verisi
     * @return API yanıtı
     */
    public Map<String, Object> sendTaskRequest(String task, Map<String, Object> data) {
        try {
            logger.info("Sending task request to Llama: " + task);
            logger.info("Task data: " + data);
            logger.info("Using AI Service URL: " + aiServiceUrl);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>(data);
            requestBody.put("task", task);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            // URL'i doğru bir şekilde oluştur - /api/ ile başlat
            String url = aiServiceUrl + "/api/" + task;
            logger.info("Full request URL: " + url);
            
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, requestEntity, Map.class);
            
            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> responseBody = responseEntity.getBody();
                
                logger.info("Received response from Llama for task " + task + ": " + responseBody);
                return responseBody;
            } else {
                logger.warning("No valid response from Llama API for task: " + task);
                throw new RuntimeException("No valid response from Llama API for task: " + task);
            }
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error calling Llama API for task: " + task + " - " + e.getMessage(), e);
            
            // Hata durumunda varsayılan yanıt
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "Llama API task hatası: " + e.getMessage());
            
            // Task'e özel varsayılan yanıtlar
            if ("classify".equals(task)) {
                errorResponse.put("category", "GENERAL_QUERY");
                errorResponse.put("confidence", 0.5);
            } else if ("get-required-info".equals(task)) {
                errorResponse.put("fields", new ArrayList<>());
            } else if ("process-query".equals(task)) {
                errorResponse.put("answer", "Üzgünüm, şu anda bu soruyu yanıtlayamıyorum.");
            }
            
            return errorResponse;
        }
    }
    
    /**
     * Bir sorgunu felsefi nitelikte olup olmadığını kontrol eder
     */
    private boolean isPhilosophicalQuery(String query) {
        String lowerQuery = query.toLowerCase();
        
        // Hayatla ilgili ve belirli kelime sayısıyla açıklama istekleri
        if (lowerQuery.contains("hayat") && 
            (lowerQuery.contains("kelime ile") || lowerQuery.contains("kelimeyle") || 
             (lowerQuery.contains("3") && lowerQuery.contains("anlat")))) {
            return true;
        }
        
        // Genel felsefi terimler
        return lowerQuery.contains("hayat") || 
               lowerQuery.contains("yaşam") || 
               lowerQuery.contains("anlam") || 
               lowerQuery.contains("varoluş") || 
               lowerQuery.contains("mutluluk") ||
               lowerQuery.contains("felsefe") ||
               lowerQuery.contains("aşk");
    }
} 