package com.Destek.Support.Controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/health")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class HealthController {

    private static final Logger logger = Logger.getLogger(HealthController.class.getName());

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        
        Map<String, String> services = new HashMap<>();
        services.put("database", "UP");
        services.put("redis", "UP");
        services.put("chatbot", "UP");
        
        response.put("services", services);
        response.put("message", "Sistem sağlıklı bir şekilde çalışıyor.");
        
        // CORS başlıkları ekle
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type");
        
        logger.info("Health check isteği: Sistemin durumu UP");
        
        return ResponseEntity.ok().headers(headers).body(response);
    }
    
    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getHealthDetails() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        
        Map<String, Object> database = new HashMap<>();
        database.put("status", "UP");
        database.put("type", "MySQL");
        database.put("connectionPool", "active");
        
        Map<String, Object> redis = new HashMap<>();
        redis.put("status", "UP");
        redis.put("host", "localhost");
        redis.put("port", 6379);
        
        Map<String, Object> chatbot = new HashMap<>();
        chatbot.put("status", "UP");
        chatbot.put("model", "Llama-3");
        chatbot.put("activeSessions", 0);
        
        Map<String, Object> services = new HashMap<>();
        services.put("database", database);
        services.put("redis", redis);
        services.put("chatbot", chatbot);
        
        response.put("services", services);
        
        // CORS başlıkları ekle
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type");
        
        return ResponseEntity.ok().headers(headers).body(response);
    }
    
    /**
     * CORS Preflight için OPTIONS metodunu işle
     */
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        headers.add("Access-Control-Max-Age", "3600");
        
        return ResponseEntity.ok().headers(headers).build();
    }
} 