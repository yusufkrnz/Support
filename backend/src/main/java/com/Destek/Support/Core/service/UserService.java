package com.Destek.Support.Core.service;

import com.Destek.Support.Core.dto.UserDTO;
import com.Destek.Support.Core.entity.SupportTicket;
import com.Destek.Support.Core.entity.User;
import com.Destek.Support.Core.entity.UserOrder;
import com.Destek.Support.Core.entity.enums.UserRole;
import com.Destek.Support.Core.repository.SupportTicketRepository;
import com.Destek.Support.Core.repository.UserOrderRepository;
import com.Destek.Support.Core.repository.UserRepository;
import com.Destek.Support.Login.Prelogin.Auth.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * Kullanıcı işlemlerini ve oturum yönetimini sağlayan servis.
 */
@Service
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    private SupportTicketRepository supportTicketRepository;
    
    @Autowired
    private UserOrderRepository userOrderRepository;
    
    @Autowired
    public UserService(UserRepository userRepository, 
                      RedisTemplate<String, Object> redisTemplate,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Autowired(required = false)
    public void setJwtService(JwtService jwtService) {
        this.jwtService = jwtService;
    }
    
    /**
     * Kullanıcının destek biletlerini getirir
     * @param userId Kullanıcı ID'si
     * @return Kullanıcının destek biletleri
     */
    public List<SupportTicket> getUserSupportTickets(Long userId) {
        return supportTicketRepository.findByCustomerIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Kullanıcının siparişlerini getirir
     * @param userId Kullanıcı ID'si
     * @return Kullanıcının siparişleri
     */
    public List<UserOrder> getUserOrders(Long userId) {
        return userOrderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Kullanıcı bilgilerini ID ile getirir
     * @param userId Kullanıcı ID'si
     * @return Kullanıcı bilgileri
     */
    public User findById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }
    
    /**
     * Kullanıcı profil bilgilerini günceller
     * @param userDTO Kullanıcı bilgileri
     * @return Güncellenmiş kullanıcı bilgileri
     */
    @Transactional
    public User updateUserProfile(UserDTO userDTO) {
        User user = findById(userDTO.getId());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Update fields
        if (userDTO.getName() != null) {
            user.setName(userDTO.getName());
        }
        
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }
        
        if (userDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(userDTO.getPhoneNumber());
        }
        
        // Only update password if it's provided
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + username));
    }
    
    /**
     * Kullanıcının giriş yapmış olup olmadığını kontrol eder.
     * @param userId Kullanıcı ID
     * @return true: kullanıcı giriş yapmış, false: kullanıcı giriş yapmamış
     */
    public boolean isUserLoggedIn(String userId) {
        if (userId == null || userId.isEmpty()) {
            return false;
        }
        
        // Redis'ten aktif oturum kontrolü
        String sessionKey = "user:active_session:" + userId;
        Boolean hasActiveSession = redisTemplate.hasKey(sessionKey);
        
        if (Boolean.TRUE.equals(hasActiveSession)) {
            return true;
        }
        
        try {
            Long id = Long.parseLong(userId);
            // Veritabanından kullanıcı varlığı kontrolü
            return userRepository.findById(id).isPresent();
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    /**
     * Kullanıcıya e-posta gönderir.
     * @param userId Kullanıcı ID
     * @param subject Konu
     * @param message Mesaj
     * @return true: e-posta gönderildi, false: e-posta gönderilemedi
     */
    public boolean sendEmail(String userId, String subject, String message) {
        // Şu anda sadece stub implementasyon
        return true;
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Transactional
    public User createUser(User user) {
        // Şifreyi hashle
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    @Transactional
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    @Transactional
    public void updateLastLogin(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        });
    }
    
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }
    
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }
    
    /**
     * Kullanıcı bilgilerini ChatBot için hazırlar
     */
    public Map<String, Object> getUserInfoForChatBot(Long userId) {
        Map<String, Object> result = new HashMap<>();
        
        userRepository.findById(userId).ifPresent(user -> {
            result.put("success", true);
            result.put("userId", user.getId());
            result.put("username", user.getUsername());
            result.put("email", user.getEmail());
            result.put("fullName", user.getFullName());
            result.put("role", user.getRole().name());
            result.put("active", user.isActive());
            
            if (user.getCompany() != null) {
                Map<String, Object> company = new HashMap<>();
                company.put("id", user.getCompany().getId());
                company.put("name", user.getCompany().getName());
                result.put("company", company);
            }
        });
        
        if (result.isEmpty()) {
            result.put("success", false);
            result.put("message", "Kullanıcı bulunamadı: " + userId);
        }
        
        return result;
    }
    
    /**
     * Kullanıcı oturumunu Redis'e kaydeder
     * @param userId Kullanıcı ID'si
     * @param token JWT token
     * @param sessionDuration Oturum süresi (dakika)
     */
    public void saveUserSession(String userId, String token, int sessionDuration) {
        if (userId == null || userId.isEmpty() || token == null || token.isEmpty()) {
            return;
        }
        
        String sessionKey = "user:active_session:" + userId;
        redisTemplate.opsForValue().set(sessionKey, token);
        redisTemplate.expire(sessionKey, sessionDuration, TimeUnit.MINUTES);
    }
    
    /**
     * Chatbot oturumunu kullanıcı kimliği ile ilişkilendirir
     * @param chatbotSessionId Chatbot oturum ID'si
     * @param userId Kullanıcı ID'si
     * @param sessionDuration Oturum süresi (dakika)
     */
    public void associateChatbotSession(String chatbotSessionId, String userId, int sessionDuration) {
        if (chatbotSessionId == null || chatbotSessionId.isEmpty() || 
            userId == null || userId.isEmpty()) {
            return;
        }
        
        String chatbotUserKey = "chatbot:user:" + chatbotSessionId;
        redisTemplate.opsForValue().set(chatbotUserKey, userId);
        redisTemplate.expire(chatbotUserKey, sessionDuration, TimeUnit.MINUTES);
        
        String userChatbotKey = "user:chatbot:" + userId;
        redisTemplate.opsForValue().set(userChatbotKey, chatbotSessionId);
        redisTemplate.expire(userChatbotKey, sessionDuration, TimeUnit.MINUTES);
    }
    
    /**
     * Kullanıcının aktif chatbot oturumunu getirir
     * @param userId Kullanıcı ID'si
     * @return Chatbot oturum ID'si
     */
    public String getUserActiveChatbotSession(String userId) {
        if (userId == null || userId.isEmpty()) {
            return null;
        }
        
        String userChatbotKey = "user:chatbot:" + userId;
        Object sessionId = redisTemplate.opsForValue().get(userChatbotKey);
        
        return sessionId != null ? sessionId.toString() : null;
    }
    
    /**
     * Kullanıcı oturumunu sonlandırır
     * @param userId Kullanıcı ID'si
     */
    public void logoutUser(String userId) {
        if (userId == null || userId.isEmpty()) {
            return;
        }
        
        String sessionKey = "user:active_session:" + userId;
        String userChatbotKey = "user:chatbot:" + userId;
        
        // Aktif chatbot oturumunu al
        String chatbotSessionId = getUserActiveChatbotSession(userId);
        
        // Chatbot-kullanıcı ilişkisini kaldır
        if (chatbotSessionId != null && !chatbotSessionId.isEmpty()) {
            String chatbotUserKey = "chatbot:user:" + chatbotSessionId;
            redisTemplate.delete(chatbotUserKey);
        }
        
        // Kullanıcı oturum bilgilerini temizle
        redisTemplate.delete(sessionKey);
        redisTemplate.delete(userChatbotKey);
    }
    
    /**
     * UserRepository nesnesini döndürür
     * @return UserRepository
     */
    public UserRepository getUserRepository() {
        return userRepository;
    }
}
