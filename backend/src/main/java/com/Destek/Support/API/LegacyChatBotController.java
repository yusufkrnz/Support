package com.Destek.Support.API;

import com.Destek.Support.Core.ChatSessionService;
import com.Destek.Support.Services.LlamaService;
import com.Destek.Support.Services.QueryLabelingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
@Deprecated
@Component("apiLegacyChatBotController")
public class LegacyChatBotController {

    private static final Logger logger = Logger.getLogger(LegacyChatBotController.class.getName());

    @Autowired
    private ChatSessionService chatSessionService;
    
    @Autowired
    private LlamaService llamaService;
    
    @Autowired
    private QueryLabelingService queryLabelingService;
    
    /**
     * Handle user messages and process them with appropriate AI service
     * @deprecated Use /chatbot/sendMessage instead
     */
    @PostMapping
    @Deprecated
    public ResponseEntity<Map<String, Object>> processMessage(@RequestBody Map<String, String> request) {
        logger.warning("Bu endpoint artık kullanılmıyor. Lütfen /chatbot/sendMessage endpoint'ini kullanın.");
        
        // Yeni endpoint'e yönlendirme bilgisi
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Deprecated endpoint");
        response.put("message", "Bu endpoint artık kullanılmıyor. Lütfen /chatbot/sendMessage endpoint'ini kullanın.");
        
        return ResponseEntity
            .status(HttpStatus.MOVED_PERMANENTLY)
            .header("Location", "/chatbot/sendMessage")
            .body(response);
    }
    
    /**
     * CORS Preflight için OPTIONS metodunu işle
     */
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        headers.add("Access-Control-Max-Age", "3600");
        headers.add("Access-Control-Allow-Credentials", "false");
        
        logger.info("OPTIONS request handled by deprecated ChatBotController");
        
        return ResponseEntity.ok().headers(headers).build();
    }
} 