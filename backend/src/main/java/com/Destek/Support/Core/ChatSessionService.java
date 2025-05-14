package com.Destek.Support.Core;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class ChatSessionService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // Redis keys will have this prefix
    private static final String SESSION_PREFIX = "chat_session:";
    private static final String USER_SESSIONS_PREFIX = "user_sessions:";
    private static final long SESSION_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

    /**
     * Create a new chat session
     * @param initialMessage The first message from the user
     * @param userId Optional user ID if authenticated
     * @return Session ID
     */
    public String createSession(String initialMessage, String userId) {
        String sessionId = UUID.randomUUID().toString();
        String sessionKey = SESSION_PREFIX + sessionId;

        // Store basic session data
        redisTemplate.opsForHash().put(sessionKey, "initialMessage", initialMessage);
        redisTemplate.opsForHash().put(sessionKey, "created", System.currentTimeMillis());
        redisTemplate.opsForHash().put(sessionKey, "lastActivity", System.currentTimeMillis());
        redisTemplate.opsForHash().put(sessionKey, "messageCount", 1);
        
        // If user is authenticated, associate session with user
        if (userId != null && !userId.isEmpty()) {
            redisTemplate.opsForHash().put(sessionKey, "userId", userId);
            redisTemplate.opsForSet().add(USER_SESSIONS_PREFIX + userId, sessionId);
        }

        // Set session expiry
        redisTemplate.expire(sessionKey, SESSION_EXPIRY, TimeUnit.SECONDS);

        return sessionId;
    }

    /**
     * Retrieve session data
     * @param sessionId The session ID
     * @return Map containing session data
     */
    public Map<Object, Object> getSession(String sessionId) {
        String sessionKey = SESSION_PREFIX + sessionId;
        Map<Object, Object> sessionData = redisTemplate.opsForHash().entries(sessionKey);
        
        if (sessionData.isEmpty()) {
            return null;
        }
        
        // Update last activity time
        redisTemplate.opsForHash().put(sessionKey, "lastActivity", System.currentTimeMillis());
        redisTemplate.expire(sessionKey, SESSION_EXPIRY, TimeUnit.SECONDS);
        
        return sessionData;
    }

    /**
     * Associate a session with a user (for post-login scenarios)
     * @param sessionId The session ID
     * @param userId The user ID
     * @return Success status
     */
    public boolean attachSessionToUser(String sessionId, String userId) {
        String sessionKey = SESSION_PREFIX + sessionId;
        
        // Check if session exists
        if (Boolean.FALSE.equals(redisTemplate.hasKey(sessionKey))) {
            return false;
        }
        
        // Add user ID to session and update user's sessions list
        redisTemplate.opsForHash().put(sessionKey, "userId", userId);
        redisTemplate.opsForSet().add(USER_SESSIONS_PREFIX + userId, sessionId);
        redisTemplate.expire(sessionKey, SESSION_EXPIRY, TimeUnit.SECONDS);
        
        return true;
    }

    /**
     * Add a message to the session history
     * @param sessionId The session ID
     * @param message The message content
     * @param isFromUser Whether the message is from the user (true) or from the bot (false)
     * @return Success status
     */
    public boolean addMessageToSession(String sessionId, String message, boolean isFromUser) {
        String sessionKey = SESSION_PREFIX + sessionId;
        
        // Check if session exists
        if (Boolean.FALSE.equals(redisTemplate.hasKey(sessionKey))) {
            return false;
        }
        
        // Get current message count
        Integer messageCount = (Integer) redisTemplate.opsForHash().get(sessionKey, "messageCount");
        if (messageCount == null) {
            messageCount = 0;
        }
        
        // Add message to session
        String messageKey = isFromUser ? "user_msg:" : "bot_msg:";
        redisTemplate.opsForHash().put(sessionKey, messageKey + messageCount, message);
        
        // Update message count and last activity
        redisTemplate.opsForHash().put(sessionKey, "messageCount", messageCount + 1);
        redisTemplate.opsForHash().put(sessionKey, "lastActivity", System.currentTimeMillis());
        redisTemplate.expire(sessionKey, SESSION_EXPIRY, TimeUnit.SECONDS);
        
        return true;
    }

    /**
     * Get a user's active sessions
     * @param userId The user ID
     * @return List of session IDs
     */
    public List<String> getUserSessions(String userId) {
        String userSessionsKey = USER_SESSIONS_PREFIX + userId;
        return redisTemplate.opsForSet().members(userSessionsKey)
                .stream()
                .map(Object::toString)
                .toList();
    }

    /**
     * Delete a session
     * @param sessionId The session ID
     */
    public void deleteSession(String sessionId) {
        String sessionKey = SESSION_PREFIX + sessionId;
        
        // Get user ID to clean up user sessions set
        String userId = (String) redisTemplate.opsForHash().get(sessionKey, "userId");
        if (userId != null) {
            redisTemplate.opsForSet().remove(USER_SESSIONS_PREFIX + userId, sessionId);
        }
        
        // Delete session
        redisTemplate.delete(sessionKey);
    }

    /**
     * Store classification result in session
     * @param sessionId The session ID
     * @param category The classification category
     * @param confidence The classification confidence score
     * @return Success status
     */
    public boolean storeClassification(String sessionId, String category, double confidence) {
        String sessionKey = SESSION_PREFIX + sessionId;
        
        // Check if session exists
        if (Boolean.FALSE.equals(redisTemplate.hasKey(sessionKey))) {
            return false;
        }
        
        // Store classification data
        redisTemplate.opsForHash().put(sessionKey, "category", category);
        redisTemplate.opsForHash().put(sessionKey, "confidence", confidence);
        redisTemplate.expire(sessionKey, SESSION_EXPIRY, TimeUnit.SECONDS);
        
        return true;
    }
} 