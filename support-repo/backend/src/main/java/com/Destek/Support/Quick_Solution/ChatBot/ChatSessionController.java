package com.Destek.Support.Quick_Solution.ChatBot;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Destek.Support.Core.service.UserService;
import com.Destek.Support.Quick_Solution.Q_S_Orientation.OrientationService;

@RestController
@RequestMapping("/quicksolution/chatbot")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true", allowedHeaders = "*")
public class ChatSessionController {
    
    @Autowired
    private ChatSessionService chatSessionService;
    
    @Autowired
    private OrientationService orientationService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Chatbot oturumu başlatır
     */
    @PostMapping("/session/init")
    public ResponseEntity<Map<String, Object>> initializeSession(@RequestBody Map<String, String> request) {
        String companyCode = request.get("companyCode");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Yeni oturum oluştur
            String sessionId = chatSessionService.createSession(companyCode);
            
            response.put("success", true);
            response.put("sessionId", sessionId);
            response.put("welcomeMessage", getWelcomeMessage(companyCode));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Oturum oluşturulamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Chatbot sorgusu işler
     */
    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> processQuery(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        String sessionId = request.get("sessionId");
        String userId = request.get("userId");
        String companyCode = request.get("companyCode");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Oturum kontrolü
            if (sessionId == null || sessionId.isEmpty()) {
                // Yeni oturum oluştur
                sessionId = chatSessionService.createSession(companyCode);
                response.put("sessionId", sessionId);
            }
            
            // Sorguyu işle
            Map<String, Object> routeResponse = orientationService.routeQuery(query, userId);
            response.putAll(routeResponse);
            
            // Oturumu güncelle
            Map<String, Object> sessionUpdate = new HashMap<>();
            sessionUpdate.put("lastQuery", query);
            sessionUpdate.put("lastQueryTime", System.currentTimeMillis());
            sessionUpdate.put("queryCount", chatSessionService.incrementQueryCount(sessionId));
            
            chatSessionService.updateSession(sessionId, sessionUpdate);
            
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Sorgu işlenemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Giriş sonrası kaldığı işleme devam eder
     */
    @PostMapping("/resume-action")
    public ResponseEntity<Map<String, Object>> resumeAfterLogin(@RequestBody Map<String, String> request) {
        String pendingSessionId = request.get("sessionId");
        String userId = request.get("userId");
        String chatSessionId = request.get("chatSessionId");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Kullanıcı bilgileri
            boolean isLoggedIn = userService.isUserLoggedIn(userId);
            
            if (!isLoggedIn) {
                response.put("success", false);
                response.put("message", "Kullanıcı giriş yapmamış");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Chatbot oturumu ile kullanıcıyı ilişkilendir
            if (chatSessionId != null && !chatSessionId.isEmpty()) {
                userService.associateChatbotSession(chatSessionId, userId, 30); // 30 dakika geçerli
            }
            
            // Bekleyen işlemi devam ettir
            Map<String, Object> resumeResponse = orientationService.resumeAfterLogin(pendingSessionId, userId);
            response.putAll(resumeResponse);
            
            response.put("success", true);
            response.put("resumed", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "İşleme devam edilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * İade sürecini işler
     */
    @PostMapping("/process-return")
    public ResponseEntity<Map<String, Object>> processReturn(@RequestBody Map<String, Object> request) {
        String returnReason = (String) request.get("returnReason");
        String explanation = (String) request.get("explanation");
        String imageBase64 = (String) request.get("imageBase64");
        String userId = (String) request.get("userId");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Kullanıcı kontrolü
            if (userId == null || userId.isEmpty() || !userService.isUserLoggedIn(userId)) {
                response.put("success", false);
                response.put("message", "Bu işlem için giriş yapmalısınız");
                response.put("requiresLogin", true);
                return ResponseEntity.ok(response);
            }
            
            // İade işlemini gerçekleştir
            Map<String, Object> returnResponse = orientationService.processReturnRequest(returnReason, explanation, imageBase64, userId);
            response.putAll(returnResponse);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "İade işlemi oluşturulamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Şikayet sürecini işler
     */
    @PostMapping("/process-complaint")
    public ResponseEntity<Map<String, Object>> processComplaint(@RequestBody Map<String, Object> request) {
        String complaintType = (String) request.get("complaintType");
        String explanation = (String) request.get("explanation");
        String userId = (String) request.get("userId");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Şikayet işlemini gerçekleştir
            Map<String, Object> complaintResponse = orientationService.processComplaintRequest(complaintType, explanation, userId);
            response.putAll(complaintResponse);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Şikayet işlemi oluşturulamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Şirket koduna göre karşılama mesajı oluşturur
     */
    private String getWelcomeMessage(String companyCode) {
        if (companyCode == null) {
            return "Merhaba! Size nasıl yardımcı olabilirim?";
        }
        
        switch (companyCode.toUpperCase()) {
            case "BIM":
                return "Merhaba! BİM destek chatbotuna hoş geldiniz. Size nasıl yardımcı olabilirim?";
            case "ATASUN":
                return "Merhaba! Atasun Optik chatbotuna hoş geldiniz. Size nasıl yardımcı olabilirim?";
            case "GRATIS":
                return "Merhaba! Gratis destek botuna hoş geldiniz. Size nasıl yardımcı olabilirim?";
            default:
                return "Merhaba! Size nasıl yardımcı olabilirim?";
        }
    }
    
    /**
     * Chatbot oturumunu getir
     * @param sessionId Oturum ID
     * @return Oturum bilgileri
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, Object>> getSession(@PathVariable String sessionId, 
                                                         @RequestParam(required = false) String userId) {
        try {
            System.out.println("DEBUG: Session getiriliyor, ID: " + sessionId + ", User ID: " + userId);
            Map<String, Object> sessionData = chatSessionService.getSession(sessionId);
            
            if (sessionData.isEmpty()) {
                System.out.println("DEBUG: Session bulunamadı: " + sessionId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Oturum bulunamadı");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            System.out.println("DEBUG: Session bulundu: " + sessionId + ", Veriler: " + sessionData);
            
            // Kullanıcı ID'si belirtilmişse ve farklıysa ilişkilendir
            if (userId != null && !userId.isEmpty()) {
                Object currentUserId = sessionData.get("userId");
                if (currentUserId == null || !userId.equals(currentUserId.toString())) {
                    System.out.println("DEBUG: Kullanıcı ilişkilendiriliyor: " + userId);
                    Map<String, Object> updateData = new HashMap<>();
                    updateData.put("userId", userId);
                    chatSessionService.updateSession(sessionId, updateData);
                    
                    // Güncellenmiş oturum verilerini al
                    sessionData = chatSessionService.getSession(sessionId);
                    System.out.println("DEBUG: Session güncellendi, yeni veriler: " + sessionData);
                }
            }
            
            // Oturum mesajlarını getir
            List<Map<String, Object>> messages = chatSessionService.getSessionMessages(sessionId);
            System.out.println("DEBUG: Session mesajları alındı, sayısı: " + messages.size());
            
            // Önemli verileri yanıta ekle
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessionId", sessionId);
            response.put("messages", messages);
            response.put("resumed", true);
            response.put("status", "active");
            
            // Diğer session verilerini ekle
            response.put("lastMessage", sessionData.get("lastMessage"));
            response.put("queryType", sessionData.get("queryType"));
            response.put("labelingResult", sessionData.get("labelingResult"));
            response.put("lastResponse", sessionData.get("lastResponse"));
            response.put("lastQuery", sessionData.get("lastQuery"));
            response.put("companyCode", sessionData.get("companyCode"));
            
            // Başarılı yanıt mesajı
            response.put("message", "Session bilgileri başarıyla alındı");
            
            System.out.println("DEBUG: Başarılı yanıt gönderiliyor: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Session getirme hatası: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Oturum bilgileri alınamadı: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
} 