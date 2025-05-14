package com.Destek.Support.API;

import com.Destek.Support.Core.ChatSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/redis")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5500", "http://127.0.0.1:5500"}, allowCredentials = "false", allowedHeaders = "*")
public class RedisController {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private ChatSessionService chatSessionService;
    
    /**
     * Check Redis connectivity
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String pingResult = redisTemplate.getConnectionFactory().getConnection().ping();
            response.put("status", "success");
            response.put("ping", pingResult);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Redis connection failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Get all chat sessions for a user
     */
    @GetMapping("/sessions/{userId}")
    public ResponseEntity<Map<String, Object>> getUserSessions(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<String> sessions = chatSessionService.getUserSessions(userId);
            response.put("userId", userId);
            response.put("sessions", sessions);
            response.put("count", sessions.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error retrieving sessions: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Get details of a specific session
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, Object>> getSessionDetails(@PathVariable String sessionId) {
        try {
            Map<Object, Object> sessionData = chatSessionService.getSession(sessionId);
            
            if (sessionData == null || sessionData.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "Session not found");
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            // Convert to String keys for JSON serialization
            Map<String, Object> stringKeyMap = new HashMap<>();
            sessionData.forEach((key, value) -> stringKeyMap.put(key.toString(), value));
            
            return ResponseEntity.ok(stringKeyMap);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Error retrieving session: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Delete a session
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, Object>> deleteSession(@PathVariable String sessionId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            chatSessionService.deleteSession(sessionId);
            response.put("status", "success");
            response.put("message", "Session deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error deleting session: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Get all keys in Redis (for debugging)
     */
    @GetMapping("/keys")
    public ResponseEntity<Map<String, Object>> getAllKeys() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Set<String> keys = redisTemplate.keys("*");
            response.put("keys", keys);
            response.put("count", keys.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error retrieving keys: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
} 