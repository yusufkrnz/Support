package com.Destek.Support.Login.Prelogin.ResetPassword;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.Destek.Support.Core.entity.User;
import com.Destek.Support.Core.repository.UserRepository;
import com.Destek.Support.Login.Prelogin.Token.TokenService;
import com.Destek.Support.Mail_Operation.MailService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.logging.Logger;

@RestController
@RequestMapping("/reset-password")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true", allowedHeaders = "*")
public class ResetPasswordController {

    private static final Logger logger = Logger.getLogger(ResetPasswordController.class.getName());

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private ResetPasswordService resetPasswordService;
    
    @Autowired
    private TokenService tokenService;
    
    @Autowired
    private MailService mailService;
    
    // E-posta ile şifre sıfırlama kodu gönderen endpoint
    @PostMapping("/send-code")
    public ResponseEntity<Map<String, Object>> sendResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        logger.info("Password reset code request for email: " + email);
        
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || email.isEmpty()) {
            response.put("success", false);
            response.put("message", "E-posta adresi gereklidir");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Kullanıcıyı e-posta adresine göre ara
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (!userOpt.isPresent()) {
                // Güvenlik için kullanıcı bulunamadığında da başarılı yanıt dön
                response.put("success", true);
                response.put("message", "Şifre sıfırlama talimatları e-posta adresinize gönderildi");
                return ResponseEntity.ok(response);
            }
            
            User user = userOpt.get();
            
            // Yeni bir sıfırlama kodu oluştur
            String resetCode = generateResetCode();
            
            // Kodu veritabanına kaydet
            resetPasswordService.saveResetCode(user.getId(), resetCode);
            
            // E-posta gönderme servisi entegrasyonu (şu an simüle ediliyor)
            boolean emailSent = sendResetEmail(user.getEmail(), resetCode);
            
            if (emailSent) {
                response.put("success", true);
                response.put("message", "Şifre sıfırlama talimatları e-posta adresinize gönderildi");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "E-posta gönderilirken bir hata oluştu");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (Exception e) {
            logger.severe("Error in password reset: " + e.getMessage());
            
            response.put("success", false);
            response.put("message", "İşlem sırasında bir hata oluştu: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Şifre sıfırlama kodunu doğrulayan endpoint
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        
        logger.info("Verifying reset code for email: " + email);
        
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || email.isEmpty() || code == null || code.isEmpty()) {
            response.put("success", false);
            response.put("message", "E-posta ve doğrulama kodu gereklidir");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Kullanıcıyı e-posta adresine göre ara
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (!userOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Geçersiz e-posta adresi");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            User user = userOpt.get();
            
            // Doğrulama kodunu kontrol et
            boolean isValid = resetPasswordService.verifyResetCode(user.getId(), code);
            
            if (isValid) {
                // Geçerli bir kod ise, geçici token oluştur
                String resetToken = tokenService.generateTemporaryToken(user.getId(), "RESET_PASSWORD", 15); // 15 dakika geçerli
                
                response.put("success", true);
                response.put("message", "Doğrulama kodu onaylandı");
                response.put("resetToken", resetToken);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Geçersiz veya süresi dolmuş doğrulama kodu");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            logger.severe("Error in code verification: " + e.getMessage());
            
            response.put("success", false);
            response.put("message", "İşlem sırasında bir hata oluştu: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Şifreyi sıfırlayan endpoint
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String resetToken = request.get("resetToken");
        String newPassword = request.get("newPassword");
        
        logger.info("Password reset request for email: " + email);
        
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || email.isEmpty() || resetToken == null || resetToken.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            response.put("success", false);
            response.put("message", "E-posta, token ve yeni şifre gereklidir");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Kullanıcıyı e-posta adresine göre ara
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (!userOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Geçersiz e-posta adresi");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            User user = userOpt.get();
            
            // Token'ı doğrula
            boolean isTokenValid = tokenService.verifyToken(resetToken, user.getId(), "RESET_PASSWORD");
            
            if (!isTokenValid) {
                response.put("success", false);
                response.put("message", "Geçersiz veya süresi dolmuş token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // Şifreyi güncelle
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Kullanılan token'ı iptal et
            tokenService.invalidateToken(resetToken);
            
            // Sıfırlama kodlarını temizle
            resetPasswordService.clearResetCodes(user.getId());
            
            response.put("success", true);
            response.put("message", "Şifreniz başarıyla değiştirildi");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.severe("Error in password reset: " + e.getMessage());
            
            response.put("success", false);
            response.put("message", "İşlem sırasında bir hata oluştu: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 6 haneli rastgele kod oluştur
    private String generateResetCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 100000-999999 arası
        return String.valueOf(code);
    }
    
    // E-posta gönderimi (gerçek mail sistemi kullanılıyor)
    private boolean sendResetEmail(String email, String resetCode) {
        try {
            // HTML formatlı e-posta gönderme (daha profesyonel görünüm)
            boolean success = mailService.sendPasswordResetHtmlEmail(email, resetCode);
            
            if (success) {
                logger.info("Şifre sıfırlama kodu gönderildi: " + email);
            } else {
                logger.warning("E-posta gönderimi başarısız: " + email);
            }
            
            return success;
        } catch (Exception e) {
            logger.severe("E-posta gönderimi sırasında hata: " + e.getMessage());
            return false;
        }
    }
} 