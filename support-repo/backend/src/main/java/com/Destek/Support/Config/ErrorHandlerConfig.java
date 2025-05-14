package com.Destek.Support.Config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global hata işleme yapılandırması.
 * Bu sınıf, uygulama genelinde oluşan hataları yakalayıp uygun şekilde formatlar.
 */
@Configuration
public class ErrorHandlerConfig {

    private static final Logger logger = LoggerFactory.getLogger(ErrorHandlerConfig.class);
    
    /**
     * Controller'lardan kaynaklanan hataları yakalar ve formatlar
     */
    @Bean
    public ResponseEntityExceptionHandler restExceptionHandler() {
        return new ResponseEntityExceptionHandler() {
            
            @ExceptionHandler(Exception.class)
            public ResponseEntity<Object> handleGlobalException(Exception ex, WebRequest request) {
                // Basitleştirilmiş hata mesajı hazırla
                ErrorLogFormatter.printSimplifiedError(ex);
                
                // İstemciye döndürülecek hata mesajı
                Map<String, Object> body = new LinkedHashMap<>();
                body.put("timestamp", LocalDateTime.now());
                body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
                body.put("error", "Bir hata oluştu");
                body.put("message", getSimplifiedErrorMessage(ex));
                body.put("path", request.getDescription(false).replace("uri=", ""));
                
                return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        };
    }
    
    /**
     * Hata mesajını basitleştirir.
     * Uzun yığın izini yerine, sadece önemli bilgileri içeren kısa bir mesaj döndürür.
     */
    private String getSimplifiedErrorMessage(Throwable ex) {
        // Kök nedeni bul
        Throwable rootCause = ex;
        while (rootCause.getCause() != null) {
            rootCause = rootCause.getCause();
        }
        
        // Hatanın en önemli kısmını al
        String errorMessage = rootCause.getMessage();
        if (errorMessage == null || errorMessage.trim().isEmpty()) {
            errorMessage = rootCause.getClass().getSimpleName();
        }
        
        // Bean çakışması hatası
        if (ex.toString().contains("BeanDefinitionStoreException") || 
            ex.toString().contains("conflicts with existing")) {
            return "Bean tanım çakışması. Çakışan sınıfların adlandırmasını kontrol edin.";
        }
        
        // Bağımlılık çözümleme hatası
        if (ex.toString().contains("UnsatisfiedDependencyException")) {
            return "Bağımlılık çözülemedi. Bean tanımlarını ve enjeksiyonları kontrol edin.";
        }
        
        // URL mapping çakışması 
        if (ex.toString().contains("Ambiguous mapping")) {
            return "URL mapping çakışması. Controller sınıflarındaki eşleştirmeleri kontrol edin.";
        }
        
        // Sütun veya özellik bulunamadı hatası
        if (ex.toString().contains("No property") && ex.toString().contains("found for type")) {
            return "Entity sınıfında olmayan bir özellik kullanılıyor. Repository metod adlarını ve entity alanlarını kontrol edin.";
        }
        
        return errorMessage;
    }
} 