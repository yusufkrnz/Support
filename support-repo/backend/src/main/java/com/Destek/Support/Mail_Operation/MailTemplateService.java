package com.Destek.Support.Mail_Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Locale;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class MailTemplateService {
    private static final Logger logger = Logger.getLogger(MailTemplateService.class.getName());
    
    @Autowired
    private TemplateEngine templateEngine;
    
    /**
     * Thymeleaf şablonunu verilen değişken değerleriyle işleyerek HTML çıktısı oluşturur
     * 
     * @param templateName Thymeleaf şablon adı (örn: "email-password-reset")
     * @param variables Şablondaki değişkenlere atanacak değerler
     * @return İşlenmiş HTML içeriği
     */
    public String processTemplate(String templateName, Map<String, Object> variables) {
        try {
            final Context context = new Context(Locale.getDefault());
            
            // Değişkenleri context'e ekle
            if (variables != null) {
                variables.forEach(context::setVariable);
            }
            
            // Şablonu işle
            return templateEngine.process(templateName, context);
        } catch (Exception e) {
            logger.severe("Şablon işleme hatası (" + templateName + "): " + e.getMessage());
            return "Şablon işleme hatası oluştu.";
        }
    }
} 