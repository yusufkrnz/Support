package com.Destek.Support.Login.Prelogin.ResetPassword;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

@Service
public class ResetPasswordService {

    private static final Logger logger = Logger.getLogger(ResetPasswordService.class.getName());
    
    // Redis kullanmadığımız için geçici in-memory storage
    private final Map<String, ResetCodeInfo> resetCodes = new HashMap<>();
    
    // Redis entegrasyonu için hazırlık
    // @Autowired
    // private RedisTemplate<String, Object> redisTemplate;
    
    private static final long CODE_EXPIRATION_MINUTES = 15; // Kodun geçerlilik süresi 15 dakika
    
    /**
     * Kullanıcıya verilen şifre sıfırlama kodunu kaydeder
     * 
     * @param userId Kullanıcı ID
     * @param resetCode Sıfırlama kodu
     */
    public void saveResetCode(Long userId, String resetCode) {
        String key = getResetCodeKey(userId);
        ResetCodeInfo codeInfo = new ResetCodeInfo(
            resetCode, 
            System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(CODE_EXPIRATION_MINUTES)
        );
        
        resetCodes.put(key, codeInfo);
        
        logger.info("Reset code saved for user: " + userId);
        
        // Redis versiyonu
        // redisTemplate.opsForValue().set(key, codeInfo);
        // redisTemplate.expire(key, Duration.ofMinutes(CODE_EXPIRATION_MINUTES));
    }
    
    /**
     * Kullanıcının şifre sıfırlama kodunu doğrular
     * 
     * @param userId Kullanıcı ID
     * @param code Doğrulanacak kod
     * @return Kodun geçerli olup olmadığı
     */
    public boolean verifyResetCode(Long userId, String code) {
        String key = getResetCodeKey(userId);
        
        // ResetCodeInfo codeInfo = (ResetCodeInfo) redisTemplate.opsForValue().get(key);
        ResetCodeInfo codeInfo = resetCodes.get(key);
        
        if (codeInfo == null) {
            logger.info("No reset code found for user: " + userId);
            return false;
        }
        
        // Süre dolmuş mu kontrol et
        if (System.currentTimeMillis() > codeInfo.getExpirationTime()) {
            logger.info("Reset code expired for user: " + userId);
            resetCodes.remove(key);
            return false;
        }
        
        // Kod doğru mu kontrol et
        if (!codeInfo.getCode().equals(code)) {
            logger.info("Invalid reset code for user: " + userId);
            return false;
        }
        
        logger.info("Reset code verified for user: " + userId);
        return true;
    }
    
    /**
     * Kullanıcının şifre sıfırlama kodlarını temizler
     * 
     * @param userId Kullanıcı ID
     */
    public void clearResetCodes(Long userId) {
        String key = getResetCodeKey(userId);
        resetCodes.remove(key);
        
        // Redis versiyonu
        // redisTemplate.delete(key);
        
        logger.info("Reset codes cleared for user: " + userId);
    }
    
    /**
     * Redis key oluştur
     */
    private String getResetCodeKey(Long userId) {
        return "reset_code:" + userId;
    }
    
    /**
     * Şifre sıfırlama kodu bilgisi
     */
    public static class ResetCodeInfo {
        private String code;
        private long expirationTime;
        
        public ResetCodeInfo(String code, long expirationTime) {
            this.code = code;
            this.expirationTime = expirationTime;
        }
        
        public String getCode() {
            return code;
        }
        
        public long getExpirationTime() {
            return expirationTime;
        }
    }
} 