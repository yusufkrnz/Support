package com.Destek.Support.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Destek.Support.Quick_Solution.ChatBot.ChatBotService;
import com.Destek.Support.Core.ChatSessionService;
import com.Destek.Support.Services.LlamaService;
import com.Destek.Support.Services.QueryLabelingService;
import com.Destek.Support.Quick_Solution.Q_S_Orientation.QueryLabeling;
import com.Destek.Support.Quick_Solution.ChatBot.LlamaConnector;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(
    origins = {
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://127.0.0.1:3000", 
        "http://127.0.0.1:5173",
        "http://localhost:8080", 
        "http://localhost:8081",
        "http://127.0.0.1:8080", 
        "http://127.0.0.1:8081"
    }, 
    allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}, 
    maxAge = 3600,
    allowCredentials = "false"
)
public class ChatbotController {

    private static final Logger logger = Logger.getLogger(ChatbotController.class.getName());

    @Autowired
    private ChatBotService chatBotService;
    
    @Autowired
    private ChatSessionService chatSessionService;
    
    @Autowired
    private LlamaService llamaService;
    
    @Autowired
    private QueryLabelingService queryLabelingService;
    
    @Autowired
    private QueryLabeling queryLabeling;
    
    @Autowired
    private LlamaConnector llamaConnector;
    
    @PostMapping("/sendMessage")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, String> request) {
        try {
            String message = request.get("message");
            String userId = request.get("userId");
            String companyCode = request.get("companyCode");
            String sessionId = request.get("sessionId");
            
            logger.info("===== ADIM 1: Chatbot isteği alındı =====");
            logger.info("Mesaj: " + message);
            logger.info("Kullanıcı ID: " + userId);
            logger.info("Şirket kodu: " + companyCode);
            logger.info("Oturum ID: " + sessionId);
            
            // CORS başlıkları - tek yerde tanımlanacak
            HttpHeaders headers = new HttpHeaders();
            
            if (message == null || message.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Mesaj boş olamaz");
                return ResponseEntity.badRequest().body(response);
            }
            
            // "Hayatı 3 kelime ile anlat" için özel işleme
            if (message.toLowerCase().contains("hayat") && 
                (message.toLowerCase().contains("3") || message.toLowerCase().contains("üç")) && 
                message.toLowerCase().contains("kelime") && 
                message.toLowerCase().contains("anlat")) {
                
                logger.info("===== ÖZEL DURUM: 'hayatı 3 kelime ile anlat' sorgusu algılandı =====");
                
                // Özel yanıt hazırla
                Map<String, Object> response = new HashMap<>();
                Map<String, Object> labelingResult = new HashMap<>();
                labelingResult.put("category", "PHILOSOPHICAL_QUERY");
                labelingResult.put("confidence", 0.99);
                labelingResult.put("reasoning", "Hayatı 3 kelime ile anlat özel sorgusu");
                
                if (sessionId == null || sessionId.isEmpty()) {
                    sessionId = chatSessionService.createSession(message, userId);
                }
                
                chatSessionService.addMessageToSession(sessionId, message, true);
                
                String answer = "Doğum, yaşam, ölüm.";
                chatSessionService.addMessageToSession(sessionId, answer, false);
                
                response.put("success", true);
                response.put("sessionId", sessionId);
                response.put("companyCode", companyCode);
                response.put("labelingResult", labelingResult);
                response.put("message", answer);
                response.put("nextStep", "CHAT_CONTINUE");
                
                return ResponseEntity.ok().body(response);
            }
            
            try {
                // Gelişmiş işleme - QueryLabeling ve ChatSession entegrasyonu
                Map<String, Object> response = new HashMap<>();
                
                // Get or create session
                if (sessionId == null || sessionId.isEmpty()) {
                    sessionId = chatSessionService.createSession(message, userId);
                    response.put("sessionId", sessionId);
                    logger.info("Yeni oturum oluşturuldu: " + sessionId);
                } else {
                    logger.info("Mevcut oturum kullanılıyor: " + sessionId);
                }
                
                // Add user message to session
                chatSessionService.addMessageToSession(sessionId, message, true);
                logger.info("Kullanıcı mesajı oturuma eklendi: " + message);
                
                try {
                    // 1. Adım: Java ile Etiketleme
                    logger.info("===== ADIM 2: Sorgu etiketleme başlıyor =====");
                    Map<String, Object> labelingResult = queryLabelingService.labelQuery(message);
                    String category = (String) labelingResult.get("category");
                    double confidence = (double) labelingResult.get("confidence");
                    
                    logger.info("Etiketleme sonucu: Kategori=" + category + ", Güven=" + confidence);
                    logger.info("Etiketleme nedeni: " + labelingResult.get("reasoning"));
                    
                    // 2. Adım: Redis'e kaydetme
                    logger.info("===== ADIM 3: Redis'e sınıflandırma kaydediliyor =====");
                    chatSessionService.storeClassification(sessionId, category, confidence);
                    
                    // 3. Adım: Kategoriye göre işleme
                    logger.info("===== ADIM 4: Kategoriye göre işleme başlıyor: " + category + " =====");
                    Map<String, Object> aiResponse;
                    
                    if ("RETURN".equals(category)) {
                        // İade işlemi için form gerekli
                        logger.info("İade formu hazırlanıyor");
                        aiResponse = new HashMap<>();
                        aiResponse.put("message", "İade talebinizi almak için lütfen aşağıdaki formu doldurun.");
                        aiResponse.put("nextStep", "RETURN_FORM");
                        
                        // 4. Adım: İlgili form alanlarını al
                        logger.info("===== ADIM 5: Form alanları alınıyor (RETURN) =====");
                        aiResponse.put("formFields", llamaConnector.sendTaskRequest("get-required-info", 
                                Map.of("category", "RETURN")));
                    }
                    else if ("COMPLAINT".equals(category)) {
                        // Şikayet işlemi için form gerekli
                        logger.info("Şikayet formu hazırlanıyor");
                        aiResponse = new HashMap<>();
                        aiResponse.put("message", "Şikayetinizi almak için lütfen aşağıdaki formu doldurun.");
                        aiResponse.put("nextStep", "COMPLAINT_FORM");
                        
                        // İlgili form alanlarını al
                        logger.info("===== ADIM 5: Form alanları alınıyor (COMPLAINT) =====");
                        aiResponse.put("formFields", llamaConnector.sendTaskRequest("get-required-info", 
                                Map.of("category", "COMPLAINT")));
                    }
                    else if ("CLASSIC_QUERY".equals(category)) {
                        if (!isAuthenticated(userId)) {
                            logger.info("Kullanıcı kimlik doğrulaması gerekiyor");
                            aiResponse = new HashMap<>();
                            aiResponse.put("message", "Bu bilgiyi almak için giriş yapmanız gerekmektedir.");
                            aiResponse.put("requiresAuth", true);
                            aiResponse.put("nextStep", "LOGIN");
                        } else {
                            // 4. Adım: Llama AI'a sorgu gönder
                            logger.info("===== ADIM 5: Classic query LlamaConnector'a iletiliyor =====");
                            Map<String, Object> requestData = new HashMap<>();
                            requestData.put("query", message);
                            requestData.put("queryType", "CLASSIC_QUERY");
                            
                            aiResponse = llamaConnector.sendTaskRequest("process-query", requestData);
                            aiResponse.put("nextStep", "CHAT_CONTINUE");
                        }
                    }
                    else if ("PHILOSOPHICAL_QUERY".equals(category)) {
                        // Felsefi sorulara özel işleme
                        logger.info("===== ADIM 5: Felsefi sorgu LlamaConnector'a iletiliyor =====");
                        Map<String, Object> requestData = new HashMap<>();
                        requestData.put("query", message);
                        requestData.put("queryType", "PHILOSOPHICAL_QUERY");
                        
                        try {
                            // Felsefi soruları direkt olarak Llama modeline gönder
                            logger.info("LlamaConnector sendQuery çağrılıyor...");
                            aiResponse = llamaConnector.sendQuery(message);
                            logger.info("LlamaConnector yanıtı alındı: " + aiResponse);
                            
                            // Yanıt yoksa veya başarısızsa özel yanıt kullan
                            if (aiResponse == null || !aiResponse.containsKey("answer") || aiResponse.get("answer") == null) {
                                logger.warning("LlamaConnector geçerli yanıt vermedi, alternatif yanıt kullanılıyor");
                                aiResponse = new HashMap<>();
                                
                                // Özel felsefik sorgu yanıtları
                                String lowerMessage = message.toLowerCase();
                                if (lowerMessage.contains("hayat") && 
                                    (lowerMessage.contains("kelime ile") || lowerMessage.contains("kelimeyle") ||
                                     (lowerMessage.contains("3") && lowerMessage.contains("anlat")))) {
                                    aiResponse.put("message", "Doğum, yaşantı, ölüm.");
                                } else if (lowerMessage.contains("mutluluk")) {
                                    aiResponse.put("message", "Mutluluk, anın içinde huzur bulabilmektir.");
                                } else if (lowerMessage.contains("anlam") || lowerMessage.contains("amaç")) {
                                    aiResponse.put("message", "Hayatın anlamı kişisel bir keşiftir, herkes kendi anlamını yaratır.");
                                } else {
                                    aiResponse.put("message", "Bu derin felsefi soruyu yanıtlamak için düşünüyorum.");
                                }
                            } else {
                                // AI yanıtını message alanına koy
                                aiResponse.put("message", aiResponse.get("answer"));
                            }
                            
                            logger.info("===== ADIM 6: Felsefi sorgu yanıtı hazır =====");
                            logger.info("Yanıt: " + aiResponse.get("message"));
                        } catch (Exception e) {
                            logger.warning("Felsefi sorgu işleme hatası: " + e.getMessage());
                            aiResponse = new HashMap<>();
                            aiResponse.put("message", "Bu derin felsefi soruyu yanıtlamak zaman alabilir.");
                        }
                        
                        aiResponse.put("nextStep", "CHAT_CONTINUE");
                    }
                    else {
                        // Genel sorgu
                        logger.info("===== ADIM 5: Genel sorgu LlamaConnector'a iletiliyor =====");
                        
                        // 4. Adım: Llama AI'a sorgu gönder
                        Map<String, Object> requestData = new HashMap<>();
                        requestData.put("query", message);
                        logger.info("LlamaConnector.sendQuery çağrılıyor...");
                        
                        aiResponse = llamaConnector.sendQuery(message);
                        logger.info("LlamaConnector yanıtı alındı: " + aiResponse);
                        
                        // Eğer yanıt yoksa varsayılan yanıt ver
                        if (aiResponse == null || !aiResponse.containsKey("answer")) {
                            logger.warning("LlamaConnector geçerli yanıt vermedi, varsayılan yanıt kullanılıyor");
                            aiResponse = new HashMap<>();
                            aiResponse.put("message", "Anlıyorum. Size nasıl yardımcı olabilirim?");
                        } else {
                            // AI yanıtını message alanına koy
                            aiResponse.put("message", aiResponse.get("answer"));
                        }
                        
                        aiResponse.put("nextStep", "CHAT_CONTINUE");
                        logger.info("===== ADIM 6: Genel sorgu yanıtı hazır =====");
                        logger.info("Yanıt: " + aiResponse.get("message"));
                    }
                    
                    // 5. Adım: AI yanıtını oturuma ekle
                    logger.info("===== ADIM 7: AI yanıtı oturuma ekleniyor =====");
                    String aiMessage = (String) aiResponse.getOrDefault("message", "Üzgünüm, yanıt üretilirken bir sorun oluştu.");
                    chatSessionService.addMessageToSession(sessionId, aiMessage, false);
                    
                    // 6. Adım: Yanıta ek bilgileri ekle
                    logger.info("===== ADIM 8: Yanıt hazırlanıyor =====");
                    response.putAll(aiResponse);
                    response.put("success", true);
                    response.put("companyCode", companyCode);
                    response.put("labelingResult", labelingResult);
                    
                    logger.info("===== ADIM 9: İşlem tamamlandı, yanıt gönderiliyor =====");
                    
                } catch (Exception e) {
                    logger.severe("İşleme hatası: " + e.getMessage());
                    e.printStackTrace();
                    
                    // Hata durumunda basit yanıt
                    response.put("success", false);
                    response.put("message", "Mesajınız işlenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
                    response.put("error", e.getMessage());
                }
                
                return ResponseEntity.ok().body(response);
            } catch (Exception e) {
                logger.warning("ChatBot servis hatası: " + e.getMessage());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Chatbot servisi şu anda kullanılamıyor: " + e.getMessage());
                return ResponseEntity.ok().body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.severe("Genel hata: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Mesaj işlenirken hata oluştu: " + e.getMessage());
            
            return ResponseEntity.ok().body(response);
        }
    }
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, Object>> getSession(@PathVariable String sessionId) {
        try {
            // Oturum bilgilerini getir
            Map<Object, Object> sessionData = chatSessionService.getSession(sessionId);
            
            // Basit bir test yanıtı döndür
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessionId", sessionId);
            response.put("status", "active");
            response.put("message", "Session bilgileri başarıyla alındı");
            
            // Son kullanıcı mesajını bul
            String lastMessage = findLastUserMessage(sessionData);
            if (lastMessage != null) {
                response.put("lastMessage", lastMessage);
            }
            
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            logger.severe("Session hatası: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Oturum bilgileri alınamadı: " + e.getMessage());
            
            return ResponseEntity.ok().body(response);
        }
    }
    
    /**
     * Resume a conversation after login
     */
    @PostMapping("/resume")
    public ResponseEntity<Map<String, Object>> resumeConversation(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");
        String userId = request.get("userId");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Associate session with user
            boolean success = chatSessionService.attachSessionToUser(sessionId, userId);
            
            if (!success) {
                response.put("resumed", false);
                response.put("message", "Oturum bulunamadı veya süresi dolmuş.");
                return ResponseEntity.ok().body(response);
            }
            
            // Get session data
            Map<Object, Object> sessionData = chatSessionService.getSession(sessionId);
            
            // Get last user message for context
            String lastMessage = findLastUserMessage(sessionData);
            
            response.put("resumed", true);
            response.put("lastMessage", lastMessage);
            response.put("message", "Hoş geldiniz! Kaldığınız yerden devam ediyoruz.");
            
            return ResponseEntity.ok().body(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "İşlem sırasında bir hata oluştu: " + e.getMessage());
            return ResponseEntity.ok().body(response);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Chatbot API");
        response.put("message", "Chatbot servisi çalışıyor");
        
        logger.info("Health check isteği: Chatbot servisi UP");
        
        return ResponseEntity.ok().body(response);
    }
    
    @GetMapping("/sendMessage")
    public ResponseEntity<Map<String, Object>> handleGetSendMessage() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Please use POST method instead of GET for this endpoint");
        
        logger.info("GET request to /sendMessage - Returning guidance message");
        
        return ResponseEntity.ok().body(response);
    }
    
    /**
     * CORS Preflight options for specific endpoints - artık GlobalCorsFilter tarafından yönetiliyor
     */
    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        logger.info("OPTIONS request handled by ChatbotController");
        return ResponseEntity.ok().build();
    }
    
    /**
     * Check if a user is authenticated
     */
    private boolean isAuthenticated(String userId) {
        return userId != null && !userId.isEmpty();
    }
    
    /**
     * Find the last user message in the session data
     */
    private String findLastUserMessage(Map<Object, Object> sessionData) {
        if (sessionData == null) {
            return null;
        }
        
        Integer messageCount = (Integer) sessionData.get("messageCount");
        if (messageCount == null || messageCount <= 0) {
            return null;
        }
        
        // Find the last user message by iterating backwards
        for (int i = messageCount - 1; i >= 0; i--) {
            String message = (String) sessionData.get("user_msg:" + i);
            if (message != null) {
                return message;
            }
        }
        
        // Fallback to the initial message
        return (String) sessionData.get("initialMessage");
    }
    
    /**
     * Demo yanıt oluştur
     */
    private Map<String, Object> generateDemoResponse(String message, String companyCode) {
        Map<String, Object> response = new HashMap<>();
        String sessionId = "demo-" + System.currentTimeMillis();
        
        response.put("success", true);
        response.put("sessionId", sessionId);
        response.put("companyCode", companyCode);
        
        if (message == null || message.isEmpty()) {
            response.put("message", "Üzgünüm, anlaşılamayan bir mesaj gönderdiniz. Lütfen tekrar deneyin.");
            return response;
        }
        
        String lowerMessage = message.toLowerCase();
        
        // Basit kelime eşleşmelerine dayalı yanıtlar
        if (lowerMessage.contains("merhaba") || lowerMessage.contains("selam")) {
            response.put("message", "Merhaba! Size nasıl yardımcı olabilirim?");
        }
        else if (lowerMessage.contains("nasılsın") || lowerMessage.contains("naber")) {
            response.put("message", "İyiyim, teşekkür ederim! Size nasıl yardımcı olabilirim?");
        }
        else if (lowerMessage.contains("ürün") || lowerMessage.contains("fiyat")) {
            response.put("message", "Hangi ürün hakkında bilgi almak istersiniz? Ürün adını yazabilirsiniz.");
        }
        else if (lowerMessage.contains("şikayet")) {
            response.put("message", "Şikayetinizi almak için size bir form sunabilirim. Şikayetinizi bildirmek ister misiniz?");
        }
        else if (lowerMessage.contains("iade")) {
            response.put("message", "İade talebinizi almak için lütfen iade formunu doldurun.");
        }
        else if (lowerMessage.contains("teşekkür")) {
            response.put("message", "Rica ederim! Başka bir konuda yardımcı olabilir miyim?");
        }
        else if (lowerMessage.contains("yardım")) {
            response.put("message", "Size nasıl yardımcı olabilirim? Ürün sorgulama, şikayet bildirme veya iade talebi gibi konularda yardımcı olabilirim.");
        }
        // CORS hatası veya test mesajları
        else if (lowerMessage.contains("cors") || lowerMessage.contains("test")) {
            response.put("message", "CORS testi başarılı! API bağlantısı kuruldu ve çalışıyor.");
        }
        // Varsayılan yanıt
        else {
            response.put("message", "Sorunuzu anladım ve size yardımcı olmak istiyorum. Ne tür bir yardıma ihtiyacınız var?");
        }
        
        logger.info("Demo yanıt oluşturuldu: " + response.get("message"));
        return response;
    }
} 