package com.Destek.Support.Quick_Solution.ChatBot;

import com.Destek.Support.Quick_Solution.Q_S_Orientation.QueryLabeling;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class ChatBotService {

    private static final Logger logger = Logger.getLogger(ChatBotService.class.getName());
    
    private final QueryLabeling queryLabeling;
    private final ChatSessionService chatSessionService;
    private final LlamaConnector llamaConnector;
    
    @Autowired
    public ChatBotService(QueryLabeling queryLabeling, ChatSessionService chatSessionService, LlamaConnector llamaConnector) {
        this.queryLabeling = queryLabeling;
        this.chatSessionService = chatSessionService;
        this.llamaConnector = llamaConnector;
    }

    /**
     * Kullanıcı mesajını işler ve yönlendirir
     * @param message Kullanıcı mesajı
     * @param userId Kullanıcı ID (opsiyonel, null olabilir)
     * @return İşlenmiş yanıt
     */
    public Map<String, Object> processMessage(String message, String userId) {
        try {
            logger.info("Processing message: " + message);
            
            // Yeni oturum ID'si oluştur
            String sessionId = UUID.randomUUID().toString();
            
            // Mesajı ve temel bilgileri sakla
            Map<String, Object> sessionData = new HashMap<>();
            sessionData.put("userId", userId);
            sessionData.put("lastMessage", message);
            sessionData.put("timestamp", System.currentTimeMillis());
            
            // Mesajı QueryLabeling servisine gönder ve etiketlet
            Map<String, Object> labelingResult = queryLabeling.analyzeLabelWithConfidence(message);
            
            // Etiketleme sonucunu oturum bilgisine ekle
            sessionData.put("labelingResult", labelingResult);
            
            // Yanıt oluştur
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", sessionId);
            response.put("labelingResult", labelingResult);
            
            // Etiketleme sonucuna göre farklı akışlar belirlenebilir
            // String'den enum'a dönüştürme
            QueryLabeling.LabelType labelType = QueryLabeling.LabelType.valueOf((String) labelingResult.get("label"));
            
            switch (labelType) {
                case DAILY_CHAT:
                    response.put("message", generateSimpleResponse(message));
                    response.put("nextStep", "CHAT_CONTINUE");
                    break;
                    
                case COMPLEX_SITUATION:
                    // Karma mesajları Llama'ya gönder
                    Map<String, Object> complexResult = llamaConnector.sendTaskRequest("analyze", Map.of("query", message));
                    response.put("message", complexResult.containsKey("analysis") ? 
                            complexResult.get("analysis") : "Karmaşık sorgunuz için detaylı analiz yapıyoruz...");
                    response.put("nextStep", "COMPLEX_ANALYSIS");
                    break;
                    
                case RETURN:
                    response.put("message", "İade talebinizi almak için bazı bilgilere ihtiyacımız var.");
                    response.put("nextStep", "RETURN_FORM");
                    
                    // Form alanlarını ekle
                    response.put("formFields", getReturnFormFields());
                    break;
                    
                case COMPLAINT:
                    response.put("message", "Şikayetinizi detaylandırmak için lütfen formu doldurun.");
                    response.put("nextStep", "COMPLAINT_FORM");
                    
                    // Form alanlarını ekle
                    response.put("formFields", getComplaintFormFields());
                    break;
                    
                case CLASSIC_QUERY:
                    response.put("message", "Sorgunuz işleniyor...");
                    response.put("nextStep", "DB_QUERY");
                    break;
                    
                case GENERAL_QUERY:
                default:
                    // Genel sorguları Llama'ya gönder
                    Map<String, Object> generalResult = llamaConnector.sendQuery(message);
                    response.put("message", generalResult.containsKey("answer") ? 
                            generalResult.get("answer") : "Sorgunuz değerlendiriliyor, lütfen bekleyin...");
                    response.put("nextStep", "AI_ANALYSIS");
                    break;
            }
            
            // Son yanıtı oturum verilerine ekle
            sessionData.put("lastResponse", response);
            sessionData.put("nextStep", response.get("nextStep"));
            
            // Oturumu Redis'e kaydet
            chatSessionService.saveSession(sessionId, sessionData);
            
            return response;
            
        } catch (Exception e) {
            logger.severe("Error processing message: " + e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "Mesajınız işlenirken bir hata oluştu.");
            errorResponse.put("nextStep", "ERROR");
            return errorResponse;
        }
    }
    
    /**
     * Var olan oturum bilgisi ile devam eder
     * @param sessionId Oturum ID
     * @param userId Kullanıcı ID
     * @return İşlenmiş yanıt
     */
    public Map<String, Object> resumeSession(String sessionId, String userId) {
        try {
            // Redis'ten oturum bilgisini al
            Map<String, Object> sessionData = chatSessionService.getSession(sessionId);
            
            if (sessionData.isEmpty()) {
                throw new IllegalArgumentException("Geçersiz veya süresi dolmuş oturum");
            }
            
            // Oturum bilgilerini güncelle
            Map<String, Object> updateData = new HashMap<>();
            updateData.put("userId", userId);
            updateData.put("timestamp", System.currentTimeMillis());
            chatSessionService.updateSession(sessionId, updateData);
            
            // Son mesaj ve etiketleme bilgisini al
            String lastMessage = (String) sessionData.get("lastMessage");
            Map<String, Object> labelingResult = (Map<String, Object>) sessionData.get("labelingResult");
            Map<String, Object> lastResponse = (Map<String, Object>) sessionData.get("lastResponse");
            
            // Yanıt oluştur
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", sessionId);
            response.put("resumed", true);
            response.put("lastMessage", lastMessage);
            response.put("labelingResult", labelingResult);
            
            // Son yanıtı da dahil et
            if (lastResponse != null) {
                response.put("message", lastResponse.get("message"));
                response.put("nextStep", lastResponse.get("nextStep"));
                
                // Form alanları varsa ekle
                if (lastResponse.containsKey("formFields")) {
                    response.put("formFields", lastResponse.get("formFields"));
                }
            } else {
                response.put("message", "Kaldığınız yerden devam ediyoruz. Size nasıl yardımcı olabilirim?");
                response.put("nextStep", "CHAT_CONTINUE");
            }
            
            return response;
            
        } catch (Exception e) {
            logger.severe("Error resuming session: " + e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "Oturum devam ettirilemedi: " + e.getMessage());
            errorResponse.put("nextStep", "NEW_SESSION");
            return errorResponse;
        }
    }
    
    /**
     * Kullanıcının aktif oturumunu kullanıcı ID'sine göre getirir
     * @param userId Kullanıcı ID
     * @return Oturum ID
     */
    public String getUserActiveSession(String userId) {
        return chatSessionService.getUserSession(userId);
    }
    
    /**
     * İade formu için alanları döndürür
     * @return Form alanları
     */
    private Object getReturnFormFields() {
        return new Object[] {
            Map.of(
                "name", "returnReason",
                "type", "select",
                "label", "İade Nedeni",
                "options", new String[] {
                    "Ürün hasarlı geldi",
                    "Yanlış ürün geldi",
                    "Ürün beklentileri karşılamadı",
                    "Fikir değişikliği",
                    "Diğer"
                }
            ),
            Map.of(
                "name", "orderNo",
                "type", "text",
                "label", "Sipariş Numarası"
            ),
            Map.of(
                "name", "explanation",
                "type", "textarea",
                "label", "Açıklama"
            )
        };
    }
    
    /**
     * Şikayet formu için alanları döndürür
     * @return Form alanları
     */
    private Object getComplaintFormFields() {
        return new Object[] {
            Map.of(
                "name", "title",
                "type", "text",
                "label", "Şikayet Başlığı"
            ),
            Map.of(
                "name", "unit",
                "type", "select",
                "label", "İlgili Birim",
                "options", new String[] {
                    "Ürün Kalitesi",
                    "Kargo/Teslimat",
                    "Müşteri Hizmetleri",
                    "Web Sitesi/Uygulama",
                    "Diğer"
                }
            ),
            Map.of(
                "name", "description",
                "type", "textarea",
                "label", "Detaylı Açıklama"
            )
        };
    }
    
    /**
     * Basit mesajlar için hızlı yanıt üretir
     * Daha kapsamlı uygulamada bu AI ile yapılabilir
     */
    private String generateSimpleResponse(String message) {
        String lowerMessage = message.toLowerCase();
        
        if (lowerMessage.contains("merhaba") || lowerMessage.contains("selam")) {
            return "Merhaba! Size nasıl yardımcı olabilirim?";
        }
        
        if (lowerMessage.contains("teşekkür")) {
            return "Rica ederim! Başka bir konuda yardımcı olabilir miyim?";
        }
        
        if (lowerMessage.contains("nasılsın")) {
            return "İyiyim, teşekkür ederim. Size nasıl yardımcı olabilirim?";
        }
        
        return "Anlıyorum. Size nasıl yardımcı olabilirim?";
    }

    public Map<String, Object> processChatMessage(String message, String userId, String sessionId, String companyCode) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            logger.info("Mesaj işleme başlatıldı: " + message);
            
            // Oturum ID'si yoksa yeni oturum oluştur
            if (sessionId == null || sessionId.isEmpty()) {
                sessionId = chatSessionService.createSession(companyCode);
                result.put("sessionId", sessionId);
                logger.info("Yeni oturum oluşturuldu: " + sessionId);
            } else {
                result.put("sessionId", sessionId);
            }
            
            // Kullanıcı mesajını Redis'e kaydet
            chatSessionService.addSessionMessage(sessionId, message, true);
            
            // 1. Adım: Mesajın ne tür bir soru olduğunu belirle
            QueryLabeling.LabelType labelType = queryLabeling.labelQuery(message);
            
            // Redis'e etiketleme sonucunu kaydet
            Map<String, Object> sessionUpdate = new HashMap<>();
            sessionUpdate.put("labelingResult", labelType.name());
            sessionUpdate.put("queryType", labelType.name());
            sessionUpdate.put("lastQuery", message);
            sessionUpdate.put("lastQueryTime", System.currentTimeMillis());
            if (userId != null && !userId.isEmpty()) {
                sessionUpdate.put("userId", userId);
            }
            chatSessionService.updateSession(sessionId, sessionUpdate);
            
            logger.info("Sorgu kategori tespiti: " + labelType.name());
            result.put("labelingResult", labelType.name());
            
            // 2. Adım: Kategori tipine göre işlem
            Map<String, Object> aiResponse = new HashMap<>();
            
            switch (labelType) {
                // Kategorilere göre işlemler...
                case DAILY_CHAT:
                    aiResponse.put("message", "Merhaba! Size nasıl yardımcı olabilirim?");
                    aiResponse.put("nextStep", "CHAT_CONTINUE");
                    break;
                    
                case GENERAL_QUERY:
                    aiResponse.put("message", "Sormuş olduğu soruyu cevaplamak mümkün değildir. Daha spesifik bir soru veya size yardımcı olmak istediğiniz konuda soru sormanız önerilir.");
                    aiResponse.put("nextStep", "CHAT_CONTINUE");
                    break;
                    
                case RETURN:
                    aiResponse.put("message", "İade talebinizi almak için bazı bilgilere ihtiyacımız var.");
                    aiResponse.put("nextStep", "RETURN_FORM");
                    break;
                    
                case COMPLAINT:
                    aiResponse.put("message", "Şikayetinizi detaylandırmak için lütfen formu doldurun.");
                    aiResponse.put("nextStep", "COMPLAINT_FORM");
                    break;
                    
                case CLASSIC_QUERY:
                    aiResponse.put("message", "Bu bilgileri sizinle paylaşmak için giriş yapmanız gerekiyor.");
                    aiResponse.put("nextStep", "LOGIN_REQUIRED");
                    break;
                    
                case COMPLEX_SITUATION:
                default:
                    aiResponse.put("message", "Anlayamadım. Lütfen sorunuzu daha açık bir şekilde ifade edebilir misiniz?");
                    aiResponse.put("nextStep", "CHAT_CONTINUE");
                    aiResponse.put("model", "fallback");
                    break;
            }
            
            // AI yanıtını sonuca ekle
            String answer = (String) aiResponse.getOrDefault("message", "Cevap bulunamadı.");
            result.put("answer", answer);
            result.put("success", true);
            result.put("model", aiResponse.getOrDefault("model", "unknown"));
            result.put("nextStep", aiResponse.getOrDefault("nextStep", "CHAT_CONTINUE"));
            
            // Bot yanıtını Redis'e kaydet
            chatSessionService.addSessionMessage(sessionId, answer, false);
            
            return result;
        } catch (Exception e) {
            logger.severe("Mesaj işleme hatası: " + e.getMessage());
            e.printStackTrace();
            result.put("success", false);
            result.put("error", e.getMessage());
            return result;
        }
    }
} 