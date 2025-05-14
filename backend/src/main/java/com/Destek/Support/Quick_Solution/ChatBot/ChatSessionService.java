package com.Destek.Support.Quick_Solution.ChatBot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

/**
 * Redis kullanarak chatbot oturumlarını yöneten servis
 */
@Service("quickChatSessionService")
public class ChatSessionService {

    private static final Logger logger = Logger.getLogger(ChatSessionService.class.getName());
    
    @Autowired
    @Qualifier("quickRedisTemplate")
    private RedisTemplate<String, Object> redisTemplate;
    
    @Value("${chatbot.session.expiration:3600}") // Varsayılan 1 saat
    private long sessionExpirationSeconds;
    
    // Redis anahtar prefixleri
    private static final String SESSION_PREFIX = "chatbot:session:";
    private static final String USER_SESSION_PREFIX = "chatbot:user:";
    
    /**
     * Yeni bir chatbot oturumu oluşturur
     * @param companyCode Şirket kodu (isteğe bağlı)
     * @return Oluşturulan oturum ID'si
     */
    public String createSession(String companyCode) {
        // Benzersiz bir oturum ID'si oluştur
        String sessionId = UUID.randomUUID().toString();
        
        // Oturum verilerini hazırla
        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("id", sessionId);
        sessionData.put("createdAt", System.currentTimeMillis());
        sessionData.put("lastActivity", System.currentTimeMillis());
        sessionData.put("queryCount", 0);
        
        if (companyCode != null && !companyCode.isEmpty()) {
            sessionData.put("companyCode", companyCode);
        }
        
        // Oturumu kaydet
        saveSession(sessionId, sessionData);
        
        return sessionId;
    }
    
    /**
     * Oturum sorgu sayacını arttırır
     * @param sessionId Oturum ID
     * @return Yeni sorgu sayısı
     */
    public int incrementQueryCount(String sessionId) {
        String redisKey = SESSION_PREFIX + sessionId;
        
        try {
            Long count = redisTemplate.opsForHash().increment(redisKey, "queryCount", 1);
            redisTemplate.expire(redisKey, sessionExpirationSeconds, TimeUnit.SECONDS);
            
            return count.intValue();
        } catch (Exception e) {
            logger.severe("Error incrementing query count: " + e.getMessage());
            return 0;
        }
    }
    
    /**
     * Yeni oturum başlatır
     * @param sessionId Oturum ID
     * @param sessionData Oturum verileri
     */
    public void saveSession(String sessionId, Map<String, Object> sessionData) {
        String redisKey = SESSION_PREFIX + sessionId;
        
        try {
            // Oturum verilerini Redis'e kaydet
            redisTemplate.opsForHash().putAll(redisKey, sessionData);
            
            // Oturum süresini ayarla
            redisTemplate.expire(redisKey, sessionExpirationSeconds, TimeUnit.SECONDS);
            
            // Kullanıcı ID'si varsa kullanıcı ile oturum ilişkisini kaydet
            Object userId = sessionData.get("userId");
            if (userId != null && userId.toString().trim().length() > 0) {
                String userKey = USER_SESSION_PREFIX + userId.toString();
                redisTemplate.opsForValue().set(userKey, sessionId);
                redisTemplate.expire(userKey, sessionExpirationSeconds, TimeUnit.SECONDS);
            }
            
            logger.info("Chatbot session saved: " + sessionId);
            
        } catch (Exception e) {
            logger.severe("Error saving session to Redis: " + e.getMessage());
        }
    }
    
    /**
     * Oturum verilerini günceller
     * @param sessionId Oturum ID
     * @param updateData Güncellenecek veriler
     */
    public void updateSession(String sessionId, Map<String, Object> updateData) {
        String redisKey = SESSION_PREFIX + sessionId;
        
        try {
            // Mevcut oturum verilerini kontrol et
            if (Boolean.TRUE.equals(redisTemplate.hasKey(redisKey))) {
                // Güncelleme verileri içinde userId varsa ve değişmişse ilişkileri güncelle
                Object oldUserId = redisTemplate.opsForHash().get(redisKey, "userId");
                Object newUserId = updateData.get("userId");
                
                if (newUserId != null && !newUserId.equals(oldUserId)) {
                    // Eski kullanıcı ilişkisini temizle
                    if (oldUserId != null) {
                        String oldUserKey = USER_SESSION_PREFIX + oldUserId.toString();
                        redisTemplate.delete(oldUserKey);
                    }
                    
                    // Yeni kullanıcı ilişkisini oluştur
                    String newUserKey = USER_SESSION_PREFIX + newUserId.toString();
                    redisTemplate.opsForValue().set(newUserKey, sessionId);
                    redisTemplate.expire(newUserKey, sessionExpirationSeconds, TimeUnit.SECONDS);
                }
                
                // Oturumu güncelle
                for (Map.Entry<String, Object> entry : updateData.entrySet()) {
                    redisTemplate.opsForHash().put(redisKey, entry.getKey(), entry.getValue());
                }
                
                // Son aktivite zamanını güncelle
                redisTemplate.opsForHash().put(redisKey, "lastActivity", System.currentTimeMillis());
                
                // Oturum süresini yenile
                redisTemplate.expire(redisKey, sessionExpirationSeconds, TimeUnit.SECONDS);
                
                logger.info("Session updated: " + sessionId);
            } else {
                logger.warning("Session not found for update: " + sessionId);
            }
        } catch (Exception e) {
            logger.severe("Error updating session: " + e.getMessage());
        }
    }
    
    /**
     * Oturum verilerini getirir
     * @param sessionId Oturum ID
     * @return Oturum verileri
     */
    public Map<String, Object> getSession(String sessionId) {
        String redisKey = SESSION_PREFIX + sessionId;
        Map<String, Object> result = new HashMap<>();
        
        try {
            Map<Object, Object> redisData = redisTemplate.opsForHash().entries(redisKey);
            
            if (redisData != null && !redisData.isEmpty()) {
                // Redis'ten gelen verileri Map<String, Object> formatına dönüştür
                for (Map.Entry<Object, Object> entry : redisData.entrySet()) {
                    result.put(entry.getKey().toString(), entry.getValue());
                }
                
                // Oturum süresini yenile
                redisTemplate.expire(redisKey, sessionExpirationSeconds, TimeUnit.SECONDS);
                
                logger.info("Retrieved session: " + sessionId);
            } else {
                logger.warning("Session not found: " + sessionId);
            }
            
        } catch (Exception e) {
            logger.severe("Error retrieving session from Redis: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Kullanıcı ID'sine göre aktif oturum ID'sini getirir
     * @param userId Kullanıcı ID
     * @return Oturum ID
     */
    public String getUserSession(String userId) {
        String userKey = USER_SESSION_PREFIX + userId;
        
        try {
            Object sessionId = redisTemplate.opsForValue().get(userKey);
            
            if (sessionId != null) {
                return sessionId.toString();
            }
            
        } catch (Exception e) {
            logger.severe("Error retrieving user session from Redis: " + e.getMessage());
        }
        
        return null;
    }
    
    /**
     * Oturumu siler
     * @param sessionId Oturum ID
     */
    public void deleteSession(String sessionId) {
        String redisKey = SESSION_PREFIX + sessionId;
        
        try {
            // Kullanıcı ID'sini kontrol et
            Object userId = redisTemplate.opsForHash().get(redisKey, "userId");
            
            // Kullanıcı ilişkisini temizle
            if (userId != null) {
                String userKey = USER_SESSION_PREFIX + userId.toString();
                redisTemplate.delete(userKey);
            }
            
            // Oturumu sil
            redisTemplate.delete(redisKey);
            
            logger.info("Session deleted: " + sessionId);
            
        } catch (Exception e) {
            logger.severe("Error deleting session: " + e.getMessage());
        }
    }
    
    /**
     * Oturum mesajlarını getirir
     * @param sessionId Oturum ID
     * @return Mesaj listesi
     */
    public List<Map<String, Object>> getSessionMessages(String sessionId) {
        String messagesKey = SESSION_PREFIX + sessionId + ":messages";
        List<Map<String, Object>> messages = new ArrayList<>();
        
        try {
            // Redis'ten mesajları getir
            List<Object> redisMessages = redisTemplate.opsForList().range(messagesKey, 0, -1);
            
            if (redisMessages != null && !redisMessages.isEmpty()) {
                for (Object msgObj : redisMessages) {
                    if (msgObj instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> msg = (Map<String, Object>) msgObj;
                        messages.add(msg);
                    } else if (msgObj instanceof String) {
                        // Direk string mesajları da destekle
                        Map<String, Object> msg = new HashMap<>();
                        msg.put("content", msgObj.toString());
                        msg.put("isUserMessage", false);
                        msg.put("timestamp", System.currentTimeMillis());
                        messages.add(msg);
                    }
                }
            }
            
            logger.info("Retrieved " + messages.size() + " messages for session: " + sessionId);
            
        } catch (Exception e) {
            logger.severe("Error retrieving messages from Redis: " + e.getMessage());
        }
        
        return messages;
    }
    
    /**
     * Oturuma mesaj ekler
     * @param sessionId Oturum ID
     * @param message Mesaj içeriği
     * @param isUserMessage Kullanıcıdan gelen mesaj mı?
     */
    public void addSessionMessage(String sessionId, String message, boolean isUserMessage) {
        String messagesKey = SESSION_PREFIX + sessionId + ":messages";
        
        try {
            Map<String, Object> messageMap = new HashMap<>();
            messageMap.put("content", message);
            messageMap.put("isUserMessage", isUserMessage);
            messageMap.put("timestamp", System.currentTimeMillis());
            
            // Mesajı listeye ekle
            redisTemplate.opsForList().rightPush(messagesKey, messageMap);
            
            // Mesaj listesinin süresini oturum süresiyle aynı tut
            redisTemplate.expire(messagesKey, sessionExpirationSeconds, TimeUnit.SECONDS);
            
            // Son mesajı oturum verisine de ekle
            Map<String, Object> sessionUpdate = new HashMap<>();
            sessionUpdate.put("lastMessage", message);
            sessionUpdate.put("lastMessageTimestamp", System.currentTimeMillis());
            sessionUpdate.put("lastMessageIsUser", isUserMessage);
            updateSession(sessionId, sessionUpdate);
            
            logger.info("Added message to session " + sessionId + ": " + message.substring(0, Math.min(50, message.length())) + "...");
            
        } catch (Exception e) {
            logger.severe("Error adding message to Redis: " + e.getMessage());
        }
    }
} 