package com.Destek.Support.Mail_Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.logging.Logger;

/**
 * Bu sınıf mail servisinin nasıl kullanılacağını gösteren 
 * demo amaçlı bir kontrolcüdür. Gerçek uygulamada bu sınıf
 * yerine ResetPasswordController kullanılacaktır.
 */
@RestController
@RequestMapping("/demo/mail")
public class PasswordResetMailDemo {
    private static final Logger logger = Logger.getLogger(PasswordResetMailDemo.class.getName());
    
    @Autowired
    private MailService mailService;
    
    @PostMapping("/password-reset")
    public ResponseEntity<Map<String, Object>> sendPasswordResetDemo(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || email.isEmpty()) {
            response.put("success", false);
            response.put("message", "E-posta adresi gereklidir");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // 6 haneli rastgele kod oluştur
            String resetCode = generateResetCode();
            
            // HTML şablonlu mail gönder
            boolean sent = mailService.sendPasswordResetHtmlEmail(email, resetCode);
            
            if (sent) {
                response.put("success", true);
                response.put("message", "Şifre sıfırlama kodu e-posta adresinize gönderildi");
                logger.info("Demo: Şifre sıfırlama kodu gönderildi: " + email);
            } else {
                response.put("success", false);
                response.put("message", "E-posta gönderilirken bir hata oluştu");
                logger.warning("Demo: E-posta gönderimi başarısız: " + email);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "İşlem sırasında bir hata oluştu: " + e.getMessage());
            logger.severe("Demo: E-posta gönderimi hatası: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/support-ticket")
    public ResponseEntity<Map<String, Object>> sendSupportTicketDemo(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || email.isEmpty()) {
            response.put("success", false);
            response.put("message", "E-posta adresi gereklidir");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Örnek bilgiler
            String ticketId = "TK" + (10000 + new Random().nextInt(90000));
            String userName = "Örnek Kullanıcı";
            String subject = "Ürün iade talebi";
            String details = "Ürün hasarlı geldi, iade etmek istiyorum.";
            
            // HTML şablonlu mail gönder
            boolean sent = mailService.sendSupportTicketCreationHtmlEmail(
                email, userName, ticketId, subject, details);
            
            if (sent) {
                response.put("success", true);
                response.put("message", "Destek talebi e-postası gönderildi");
                logger.info("Demo: Destek talebi e-postası gönderildi: " + email);
            } else {
                response.put("success", false);
                response.put("message", "E-posta gönderilirken bir hata oluştu");
                logger.warning("Demo: E-posta gönderimi başarısız: " + email);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "İşlem sırasında bir hata oluştu: " + e.getMessage());
            logger.severe("Demo: E-posta gönderimi hatası: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    // 6 haneli rastgele kod oluştur
    private String generateResetCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 100000-999999 arası
        return String.valueOf(code);
    }
} 