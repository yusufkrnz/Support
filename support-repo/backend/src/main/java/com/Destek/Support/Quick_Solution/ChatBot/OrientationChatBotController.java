package com.Destek.Support.Quick_Solution.ChatBot;

import com.Destek.Support.Quick_Solution.Q_S_Orientation.QueryLabeling;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/orientation")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5500", "http://127.0.0.1:5500"}, allowCredentials = "false", allowedHeaders = "*")
public class OrientationChatBotController {

    private static final Logger logger = Logger.getLogger(OrientationChatBotController.class.getName());
    
    private final ChatBotService chatBotService;
    private final QueryLabeling queryLabeling;

    @Autowired
    public OrientationChatBotController(ChatBotService chatBotService, QueryLabeling queryLabeling) {
        this.chatBotService = chatBotService;
        this.queryLabeling = queryLabeling;
    }

    /**
     * Kullanıcı mesajını alıp uygun servise yönlendirir
     * @param requestBody Kullanıcı sorgusu ve bilgileri
     * @return API yanıtı
     */
    @PostMapping("/route")
    public ResponseEntity<?> routeQuery(@RequestBody Map<String, Object> requestBody) {
        try {
            String query = (String) requestBody.get("query");
            String userId = requestBody.get("userId") != null ? (String) requestBody.get("userId") : null;
            
            logger.info("Received query: " + query + " from user: " + userId);
            
            // Sorguyu etiketle ve yönlendir
            Map<String, Object> response = chatBotService.processMessage(query, userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.severe("Error routing query: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Mesaj işlenirken hata oluştu");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Oturum bilgisi kullanarak işleme devam eder
     * @param requestBody Oturum bilgileri
     * @return API yanıtı
     */
    @PostMapping("/resume")
    public ResponseEntity<?> resumeSession(@RequestBody Map<String, Object> requestBody) {
        try {
            String sessionId = (String) requestBody.get("sessionId");
            String userId = (String) requestBody.get("userId");
            
            logger.info("Resuming session: " + sessionId + " for user: " + userId);
            
            Map<String, Object> response = chatBotService.resumeSession(sessionId, userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.severe("Error resuming session: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Oturum devam ettirilemedi");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 