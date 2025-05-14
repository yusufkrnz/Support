package com.Destek.Support.Quick_Solution.ChatBot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * @deprecated Bu controller artık kullanılmıyor. Lütfen bunun yerine com.Destek.Support.Controller.ChatbotController sınıfını kullanın.
 * Tüm işlevler oraya taşınmıştır.
 */
@Deprecated
@RestController
@RequestMapping("/quicksolution/chatbot")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true", allowedHeaders = "*")
@Component("quickSolutionChatBotController")
public class QuickSolutionChatBotController {

    private static final Logger logger = Logger.getLogger(QuickSolutionChatBotController.class.getName());

    @Autowired
    private ChatBotService chatBotService;
    
    @Autowired
    private ChatSessionService chatSessionService;

    /**
     * Chatbot mesajı gönderme
     * @deprecated Bunun yerine /chatbot/sendMessage endpointini kullanın
     */
    @Deprecated
    @PostMapping("/sendMessage")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        String userId = (String) request.get("userId");
        String sessionId = (String) request.get("sessionId");
        String companyCode = (String) request.get("companyCode");
        
        logger.info("Gelen mesaj: " + message + " (SessionID: " + sessionId + ", UserID: " + userId + ")");
        
        try {
            // Mesajı işle
            Map<String, Object> response = chatBotService.processChatMessage(message, userId, sessionId, companyCode);
            
            // Mesajları kaydettikten sonra kullanıcının mesajını Redis'e ekle
            if (sessionId != null) {
                chatSessionService.addSessionMessage(sessionId, message, true);
            } else if (response.containsKey("sessionId")) {
                sessionId = (String) response.get("sessionId");
                chatSessionService.addSessionMessage(sessionId, message, true);
            }
            
            // Yanıt da ayrıca kaydedilsin
            if (sessionId != null && response.containsKey("answer")) {
                String botAnswer = (String) response.get("answer");
                chatSessionService.addSessionMessage(sessionId, botAnswer, false);
            }
            
            logger.info("İşlenen yanıt: " + response);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.severe("Mesaj işleme hatası: " + e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Mesaj işlenemedi: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 