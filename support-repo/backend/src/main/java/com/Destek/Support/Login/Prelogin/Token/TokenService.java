package com.Destek.Support.Login.Prelogin.Token;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

@Service
public class TokenService {
    
    private static final Logger logger = Logger.getLogger(TokenService.class.getName());
    
    // Token için güvenlik anahtarı - gerçek uygulamada çevre değişkeninden alınmalıdır
    private static final String SECRET_KEY = "supportHubSecretKeyForTemporaryTokenAuthentication123";
    
    // Geçersiz kılınmış tokenlar için in-memory cache - gerçek uygulamada Redis kullanılabilir
    private final Set<String> invalidatedTokens = ConcurrentHashMap.newKeySet();
    
    /**
     * Belirli bir süre için geçerli olan geçici token oluşturur
     * 
     * @param userId Kullanıcı ID
     * @param purpose Token'ın kullanım amacı (örn. "RESET_PASSWORD")
     * @param expirationMinutes Dakika cinsinden geçerlilik süresi
     * @return Oluşturulan JWT token
     */
    public String generateTemporaryToken(Long userId, String purpose, int expirationMinutes) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + (expirationMinutes * 60 * 1000));
        
        String tokenId = UUID.randomUUID().toString();
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("purpose", purpose);
        claims.put("tid", tokenId);
        
        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
        
        logger.info("Generated temporary token for user: " + userId + ", purpose: " + purpose);
        
        return token;
    }
    
    /**
     * Token'ı doğrular
     * 
     * @param token Doğrulanacak token
     * @param userId Beklenen kullanıcı ID
     * @param purpose Beklenen kullanım amacı
     * @return Token'ın geçerli olup olmadığı
     */
    public boolean verifyToken(String token, Long userId, String purpose) {
        try {
            // Token iptal edilmiş mi kontrol et
            if (invalidatedTokens.contains(token)) {
                logger.info("Token has been invalidated");
                return false;
            }
            
            // Token'ı parse et
            Claims claims = extractAllClaims(token);
            
            // Token süresi dolmuş mu kontrol et
            if (claims.getExpiration().before(new Date())) {
                logger.info("Token has expired");
                return false;
            }
            
            // Kullanıcı ID'si doğru mu kontrol et
            Long tokenUserId = claims.get("userId", Long.class);
            if (!userId.equals(tokenUserId)) {
                logger.info("Token userId mismatch");
                return false;
            }
            
            // Kullanım amacı doğru mu kontrol et
            String tokenPurpose = claims.get("purpose", String.class);
            if (!purpose.equals(tokenPurpose)) {
                logger.info("Token purpose mismatch");
                return false;
            }
            
            return true;
        } catch (Exception e) {
            logger.warning("Error verifying token: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Token'ı geçersiz kılar
     * 
     * @param token Geçersiz kılınacak token
     */
    public void invalidateToken(String token) {
        invalidatedTokens.add(token);
        logger.info("Token invalidated");
        
        // Gerçek uygulamada, düzenli olarak süresi dolmuş tokenları temizleyen bir görev çalıştırılabilir
    }
    
    /**
     * Token içindeki tüm bilgileri çıkarır
     * 
     * @param token JWT token
     * @return Claims nesnesi
     */
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * İmzalama anahtarını alır
     * 
     * @return Key nesnesi
     */
    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
} 