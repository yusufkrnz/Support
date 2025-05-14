package com.Destek.Support.Quick_Solution.Q_S_Orientation;

import com.Destek.Support.Quick_Solution.Return.QuickReturnService;
import com.Destek.Support.Quick_Solution.Complaint.ComplaintService;
import com.Destek.Support.Quick_Solution.Llama.LlamaService;
import com.Destek.Support.Quick_Solution.Classic_query.ClassicQueryService;
import com.Destek.Support.Quick_Solution.Llama.Ll_daily_chat.DailyChatService;
import com.Destek.Support.Quick_Solution.Llama.Complex_situation.ComplexSituationService;
import com.Destek.Support.Core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class OrientationService {

    private final QueryLabeling queryLabeling;
    private final QuickReturnService returnService;
    private final ComplaintService complaintService;
    private final LlamaService llamaService;
    private final ClassicQueryService classicQueryService;
    private final UserService userService;
    private final RedisTemplate<String, Object> redisTemplate;
    
    // Add the new service dependencies
    private final DailyChatService dailyChatService;
    private final ComplexSituationService complexSituationService;
    
    // Diğer servisler burada enjekte edilebilir (ComplaintService, LlamaService, vs.)

    @Autowired
    public OrientationService(
            QueryLabeling queryLabeling, 
            QuickReturnService returnService,
            ComplaintService complaintService,
            @Qualifier("quickLlamaService") LlamaService llamaService,
            ClassicQueryService classicQueryService,
            UserService userService,
            @Qualifier("quickRedisTemplate") RedisTemplate<String, Object> redisTemplate,
            DailyChatService dailyChatService,
            ComplexSituationService complexSituationService) {
        this.queryLabeling = queryLabeling;
        this.returnService = returnService;
        this.complaintService = complaintService;
        this.llamaService = llamaService;
        this.classicQueryService = classicQueryService;
        this.userService = userService;
        this.redisTemplate = redisTemplate;
        this.dailyChatService = dailyChatService;
        this.complexSituationService = complexSituationService;
    }

    /**
     * Sorguyu Llama AI ile sınıflandırır ve uygun işleme yönlendirir
     * @param query Kullanıcı sorgusu
     * @param userId Kullanıcı ID
     * @return Yönlendirme bilgileri
     */
    public Map<String, Object> routeQuery(String query, String userId) {
        Map<String, Object> response = new HashMap<>();
        
        // Sorguyu sınıflandır
        Map<String, Object> classificationResult = queryLabeling.analyzeLabelWithConfidence(query);
        String labelType = (String) classificationResult.get("label"); 
        double confidence = (double) classificationResult.get("confidence");
        
        // Etiket türüne göre işlemi belirle
        String nextStep = "";
        String message = "";
        boolean requiresLogin = false;
        
        switch (labelType) {
            case "DAILY_CHAT":
                // Günlük sohbet işlemi - DailyChatService kullan
                Map<String, Object> chatResponse = dailyChatService.processDailyChat(query, userId);
                response.put("answer", chatResponse.get("message"));
                response.put("queryType", "DAILY_CHAT");
                
                // Günlük sohbet limiti ve sayaç bilgisini ekle
                int dailyChatCount = dailyChatService.getDailyChatCount(userId);
                response.put("dailyChatCount", dailyChatCount);
                response.put("dailyChatLimit", 5);
                
                // Günlük sohbet limiti aşıldı mı kontrol et
                if (!(boolean) chatResponse.getOrDefault("success", true)) {
                    nextStep = "DAILY_CHAT_LIMIT_EXCEEDED";
                } else {
                    nextStep = "LLAMA_SERVICE";
                }
                message = (String) chatResponse.get("message");
                break;
                
            case "COMPLEX_SITUATION":
                // Karmaşık durum analizi - ComplexSituationService kullan
                Map<String, Object> complexResponse = complexSituationService.analyzeComplexSituation(query, userId);
                response.putAll(complexResponse);
                response.put("queryType", "COMPLEX_SITUATION");
                
                // Karmaşık sorgu limiti ve sayaç bilgisini ekle
                int complexQueryCount = complexSituationService.getComplexQueryCount(userId);
                response.put("complexQueryCount", complexQueryCount);
                response.put("complexQueryLimit", 3);
                
                // İnsan yardımı gerekli mi?
                boolean redirectToAgent = false;
                if (complexResponse.containsKey("redirectToAgent")) {
                    redirectToAgent = (boolean) complexResponse.get("redirectToAgent");
                }
                
                if (redirectToAgent) {
                    nextStep = "HUMAN_AGENT";
                    message = "Sorununuz karmaşık olduğu için sizi bir temsilciye yönlendiriyoruz.";
                } else {
                    nextStep = "LLAMA_SERVICE";
                    message = (String) complexResponse.get("message");
                }
                break;
                
            case "RETURN":
                // İade işlemi
                nextStep = "RETURN_FORM";
                message = "İade talebinizi almak için lütfen formu doldurunuz.";
                requiresLogin = true;
                break;
                
            case "COMPLAINT":
                // Şikayet işlemi
                nextStep = "COMPLAINT_FORM";
                message = "Şikayetinizi almak için lütfen detayları giriniz.";
                requiresLogin = true;
                break;
                
            case "CLASSIC_QUERY":
                // Temel CRUD işlemleri
                nextStep = "CORE_SERVICE";
                message = "Talebiniz işleme alındı.";
                requiresLogin = true;
                break;
                
            default: // GENERAL_QUERY
                // Genel sorgular
                Map<String, Object> generalResponse = llamaService.processGeneralQuery(query, userId);
                response.put("answer", generalResponse.get("message"));
                response.put("queryType", "GENERAL_QUERY");
                
                nextStep = "LLAMA_SERVICE";
                message = (String) generalResponse.get("message");
                break;
        }
        
        // Kullanıcı girişi gerekli mi kontrol et
        if (requiresLogin && (userId == null || userId.isEmpty() || !userService.isUserLoggedIn(userId))) {
            String sessionId = generateSessionId();
            saveQueryToRedis(sessionId, query, labelType);
            
            response.put("sessionId", sessionId);
            response.put("requiresLogin", true);
            response.put("message", "Bu işlemi gerçekleştirmek için lütfen giriş yapın veya hesap oluşturun.");
            response.put("originalQuery", query);
            response.put("queryType", labelType);
            response.put("nextStep", "LOGIN_REQUIRED");
        } else {
            response.put("requiresLogin", false);
            response.put("message", message);
            response.put("nextStep", nextStep);
            response.put("confidence", confidence);
            response.put("originalQuery", query);
            response.put("queryType", labelType);
        }
        
        return response;
    }
    
    /**
     * Benzersiz oturum ID'si oluşturur
     */
    private String generateSessionId() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Kullanıcı giriş yaptıktan sonra kaldığı yerden devam etmesi için yönlendirme
     * @param sessionId Oturum ID
     * @param userId Kullanıcı ID
     * @return Yönlendirme bilgileri
     */
    public Map<String, Object> resumeAfterLogin(String sessionId, String userId) {
        // Redis'ten sorgu bilgilerini al
        Map<String, Object> sessionData = getSessionFromRedis(sessionId);
        
        if (sessionData == null || sessionData.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Oturum bulunamadı veya süresi doldu.");
            errorResponse.put("nextStep", "CHATBOT_HOME");
            return errorResponse;
        }
        
        String originalQuery = (String) sessionData.get("query");
        String queryType = (String) sessionData.get("queryType");
        
        Map<String, Object> response = new HashMap<>();
        response.put("queryType", queryType);
        response.put("originalQuery", originalQuery);
        response.put("isLoggedIn", true);
        
        // QueryType'a göre yönlendirme
        switch (queryType) {
            case "RETURN":
                response.put("nextStep", "RETURN_FORM");
                response.put("message", "İade talebinizi almak için lütfen formu doldurunuz.");
                break;
                
            case "COMPLAINT":
                response.put("nextStep", "COMPLAINT_FORM");
                response.put("message", "Şikayetinizi almak için lütfen detayları giriniz.");
                break;
                
            case "CLASSIC_QUERY":
                response.put("nextStep", "CORE_SERVICE");
                response.put("message", "Talebiniz işleme alındı.");
                break;
                
            default:
                response.put("nextStep", "CHATBOT_HOME");
                response.put("message", "Nasıl yardımcı olabilirim?");
                break;
        }
        
        return response;
    }
    
    /**
     * Sorgu bilgilerini Redis'e kaydet
     * @param sessionId Oturum ID
     * @param query Kullanıcı sorgusu
     * @param queryType Sorgu tipi
     */
    private void saveQueryToRedis(String sessionId, String query, String queryType) {
        String key = "user:session:" + sessionId;
        
        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("query", query);
        sessionData.put("queryType", queryType);
        sessionData.put("timestamp", System.currentTimeMillis());
        
        redisTemplate.opsForHash().putAll(key, sessionData);
        redisTemplate.expire(key, 30, TimeUnit.MINUTES); // 30 dakika geçerli
    }
    
    /**
     * Redis'ten oturum bilgilerini getir
     * @param sessionId Oturum ID
     * @return Oturum verileri
     */
    private Map<String, Object> getSessionFromRedis(String sessionId) {
        String key = "user:session:" + sessionId;
        Map<Object, Object> redisData = redisTemplate.opsForHash().entries(key);
        
        if (redisData == null || redisData.isEmpty()) {
            return new HashMap<>();
        }
        
        Map<String, Object> sessionData = new HashMap<>();
        redisData.forEach((k, v) -> sessionData.put(k.toString(), v));
        
        return sessionData;
    }
    
    /**
     * İade talebini işle ve AI-Service'e gönder
     * @param returnReason İade nedeni
     * @param explanation Açıklama
     * @param imageBase64 Ürün görüntüsü (Base64)
     * @param userId Kullanıcı ID
     * @return İşlem sonucu
     */
    public Map<String, Object> processReturnRequest(String returnReason, String explanation, String imageBase64, String userId) {
        // ReturnService'e yönlendir
        return returnService.processReturnRequest(userId, returnReason, explanation, imageBase64);
    }
    
    /**
     * Şikayet talebini işler
     * @param complaintType Şikayet türü
     * @param explanation Açıklama
     * @param userId Kullanıcı ID
     * @return İşlem sonucu
     */
    public Map<String, Object> processComplaintRequest(String complaintType, String explanation, String userId) {
        // Kullanıcı giriş yapmış mı kontrolü
        if (userId == null || userId.isEmpty() || !userService.isUserLoggedIn(userId)) {
            String sessionId = generateSessionId();
            
            Map<String, Object> sessionData = new HashMap<>();
            sessionData.put("complaintType", complaintType);
            sessionData.put("explanation", explanation);
            sessionData.put("actionType", "COMPLAINT");
            
            saveQueryToRedis(sessionId, "Şikayet: " + complaintType, "COMPLAINT");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("requiresLogin", true);
            response.put("sessionId", sessionId);
            response.put("message", "Şikayet oluşturmak için giriş yapmalısınız.");
            response.put("nextStep", "LOGIN_REQUIRED");
            
            return response;
        }
        
        // Giriş yapmış kullanıcı için şikayet işleme
        return complaintService.processComplaint(complaintType, explanation, userId);
    }
    
    /**
     * Genel sorguyu Llama'ya yönlendir
     * @param query Kullanıcı sorgusu
     * @param userId Kullanıcı ID
     * @return Llama yanıtı
     */
    public Map<String, Object> processGeneralQuery(String query, String userId) {
        // Sorguyu ilk önce sınıflandır
        Map<String, Object> classificationResult = queryLabeling.analyzeLabelWithConfidence(query);
        String labelType = (String) classificationResult.get("label");
        
        // Etiket türüne göre uygun servisi çağır
        Map<String, Object> response;
        switch (labelType) {
            case "DAILY_CHAT":
                response = dailyChatService.processDailyChat(query, userId);
                // Günlük sohbet limiti ve sayaç bilgisini ekle
                int dailyChatCount = dailyChatService.getDailyChatCount(userId);
                response.put("dailyChatCount", dailyChatCount);
                response.put("dailyChatLimit", 5);
                return response;
                
            case "COMPLEX_SITUATION":
                response = complexSituationService.analyzeComplexSituation(query, userId);
                // Karmaşık sorgu limiti ve sayaç bilgisini ekle
                int complexQueryCount = complexSituationService.getComplexQueryCount(userId);
                response.put("complexQueryCount", complexQueryCount);
                response.put("complexQueryLimit", 3);
                return response;
                
            default:
                // Diğer sorgular için LlamaService'e yönlendir
                return llamaService.processGeneralQuery(query, userId);
        }
    }
    
    /**
     * Temel veritabanı sorgusu işle
     * @param operation İşlem türü (siparişler, profil, adresler vb.)
     * @param userId Kullanıcı ID
     * @param params Ek parametreler
     * @return İşlem sonucu
     */
    public Map<String, Object> processClassicQuery(String operation, String userId, Map<String, String> params) {
        // ClassicQueryService'e yönlendir
        switch (operation.toLowerCase()) {
            case "listorders":
                return classicQueryService.listOrders(userId);
                
            case "profile":
                return classicQueryService.getUserProfile(userId);
                
            case "addresses":
                return classicQueryService.getUserAddresses(userId);
                
            case "orderdetails":
                String orderId = params.get("orderId");
                if (orderId == null || orderId.isEmpty()) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Sipariş ID gereklidir");
                    return errorResponse;
                }
                return classicQueryService.getOrderDetails(userId, orderId);
                
            case "trackorder":
                orderId = params.get("orderId");
                if (orderId == null || orderId.isEmpty()) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Sipariş ID gereklidir");
                    return errorResponse;
                }
                return classicQueryService.trackOrder(userId, orderId);
                
            default:
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Desteklenmeyen işlem: " + operation);
                return errorResponse;
        }
    }

    /**
     * Şikayet tiplerini getirir
     * @return Şikayet tiplerinin listesi
     */
    public Map<String, String> getComplaintTypes() {
        return complaintService.getComplaintTypes();
    }
} 