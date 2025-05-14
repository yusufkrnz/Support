package com.Destek.Support.Mail_Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class MailService {
    private static final Logger logger = Logger.getLogger(MailService.class.getName());

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MailTemplateService templateService;

    @Value("${mail.from.address}")
    private String fromAddress;

    @Value("${mail.from.name}")
    private String fromName;

    @Value("${mail.template.password-reset}")
    private String passwordResetTemplate;

    @Value("${mail.template.support-ticket}")
    private String supportTicketTemplate;

    @Value("${mail.template.support-ticket-update}")
    private String supportTicketUpdateTemplate;

    /**
     * Basit metin içerikli e-posta gönderir
     * 
     * @param to Alıcı e-posta adresi
     * @param subject E-posta konusu
     * @param text E-posta metni
     * @return Gönderim başarılı ise true
     */
    public boolean sendSimpleEmail(String to, String subject, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, false);
            
            mailSender.send(message);
            logger.info("E-posta başarıyla gönderildi: " + to);
            return true;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "E-posta gönderilirken hata oluştu: " + e.getMessage(), e);
            return false;
        }
    }

    /**
     * HTML içerikli e-posta gönderir
     * 
     * @param to Alıcı e-posta adresi
     * @param subject E-posta konusu
     * @param htmlContent HTML içerik
     * @return Gönderim başarılı ise true
     */
    public boolean sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("HTML e-posta başarıyla gönderildi: " + to);
            return true;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "HTML e-posta gönderilirken hata oluştu: " + e.getMessage(), e);
            return false;
        }
    }

    /**
     * Şifre sıfırlama e-postası gönderir (Basit metin)
     * 
     * @param to Alıcı e-posta adresi
     * @param resetCode Sıfırlama kodu
     * @return Gönderim başarılı ise true
     */
    public boolean sendPasswordResetEmail(String to, String resetCode) {
        String subject = "Şifre Sıfırlama Talebi";
        String content = String.format(passwordResetTemplate, resetCode);
        return sendSimpleEmail(to, subject, content);
    }
    
    /**
     * Şifre sıfırlama e-postası gönderir (HTML şablonlu)
     * 
     * @param to Alıcı e-posta adresi
     * @param resetCode Sıfırlama kodu
     * @return Gönderim başarılı ise true
     */
    public boolean sendPasswordResetHtmlEmail(String to, String resetCode) {
        String subject = "Şifre Sıfırlama Talebi";
        
        Map<String, Object> templateVars = new HashMap<>();
        templateVars.put("resetCode", resetCode);
        
        String htmlContent = templateService.processTemplate("email-password-reset", templateVars);
        return sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * Destek talebi oluşturulduğuna dair bildirim e-postası gönderir (Basit metin)
     * 
     * @param to Alıcı e-posta adresi
     * @param ticketId Talep numarası
     * @param details Talep detayları
     * @return Gönderim başarılı ise true
     */
    public boolean sendSupportTicketCreationEmail(String to, String ticketId, String details) {
        String subject = "Destek Talebiniz Oluşturuldu";
        String content = String.format(supportTicketTemplate, ticketId);
        return sendSimpleEmail(to, subject, content + "\n\nDetaylar: " + details);
    }
    
    /**
     * Destek talebi oluşturulduğuna dair bildirim e-postası gönderir (HTML şablonlu)
     * 
     * @param to Alıcı e-posta adresi
     * @param userName Kullanıcı adı
     * @param ticketId Talep numarası
     * @param subject Konu
     * @param details Detaylar
     * @return Gönderim başarılı ise true
     */
    public boolean sendSupportTicketCreationHtmlEmail(String to, String userName, String ticketId, 
                                                    String subject, String details) {
        String emailSubject = "Destek Talebiniz Oluşturuldu";
        
        Map<String, Object> templateVars = new HashMap<>();
        templateVars.put("userName", userName);
        templateVars.put("ticketId", ticketId);
        templateVars.put("subject", subject);
        templateVars.put("createdDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));
        templateVars.put("status", "Açık");
        templateVars.put("details", details);
        
        String htmlContent = templateService.processTemplate("email-support-ticket", templateVars);
        return sendHtmlEmail(to, emailSubject, htmlContent);
    }

    /**
     * Destek talebi güncellendiğinde bildirim e-postası gönderir
     * 
     * @param to Alıcı e-posta adresi
     * @param ticketId Talep numarası
     * @param updateDetails Güncelleme detayları
     * @return Gönderim başarılı ise true
     */
    public boolean sendSupportTicketUpdateEmail(String to, String ticketId, String updateDetails) {
        String subject = "Destek Talebiniz Güncellendi";
        String content = String.format(supportTicketUpdateTemplate, ticketId);
        return sendSimpleEmail(to, subject, content + "\n\nGüncelleme: " + updateDetails);
    }
} 