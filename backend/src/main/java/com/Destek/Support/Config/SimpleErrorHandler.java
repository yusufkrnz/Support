package com.Destek.Support.Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Basitleştirilmiş hata işleme sağlayan sınıf.
 * Bu sınıf tüm uygulama hatalarını yakalayıp basitleştirerek gösterir.
 */
@Component
@ControllerAdvice
public class SimpleErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(SimpleErrorHandler.class);
    
    // Yaygın hata kalıplarını tanımak için regex
    private static final Pattern ENTITY_FIELD_PATTERN = Pattern.compile("No property '([^']+)' found for type '([^']+)'");
    private static final Pattern ID_NOT_FOUND_PATTERN = Pattern.compile("No (\\w+) entity with id (\\d+) exists");
    private static final Pattern METHOD_ARG_ERROR = Pattern.compile("Required request parameter '([^']+)' for method parameter type (\\w+) is not present");
    
    /**
     * Tüm çalışma zamanı hatalarını yakalar
     */
    @ExceptionHandler(Exception.class)
    public ModelAndView handleException(Exception ex, HttpServletRequest request, HttpServletResponse response) {
        // Basitleştirilmiş hata mesajını oluştur
        Map<String, Object> error = createSimplifiedError(ex);
        
        // Konsola düzenli bir format ile yazdır
        printFormattedError(error, ex);
        
        // MVC yanıtı oluştur
        ModelAndView mav = new ModelAndView(new MappingJackson2JsonView());
        mav.addAllObjects(error);
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        
        return mav;
    }
    
    /**
     * Hata bilgilerini ekrana basitleştirilmiş formatta yazdırır
     */
    private void printFormattedError(Map<String, Object> error, Exception ex) {
        System.out.println("\n╔═════════════════════════════════════════════════════╗");
        System.out.println("║                 HATA YAKALANDI                     ║");
        System.out.println("╚═════════════════════════════════════════════════════╝");
        System.out.println();
        System.out.println("📌 HATA TÜRÜ: " + error.get("errorType"));
        System.out.println("📌 MESAJ: " + error.get("message"));
        System.out.println("📌 KONUM: " + error.get("location"));
        
        if (error.containsKey("suggestion")) {
            System.out.println("\n📢 ÖNERİ: " + error.get("suggestion"));
        }
        
        // Hata türüne göre özel bilgiler
        if (error.containsKey("details")) {
            System.out.println("\n📋 DETAYLAR: ");
            System.out.println(error.get("details"));
        }
        
        System.out.println();
    }
    
    /**
     * Hatanın basitleştirilmiş açıklamasını oluşturur
     */
    private Map<String, Object> createSimplifiedError(Exception ex) {
        Map<String, Object> result = new HashMap<>();
        
        // Hata türü
        result.put("errorType", ex.getClass().getSimpleName());
        
        // Mesaj
        String message = ex.getMessage() != null ? ex.getMessage() : "Bilinmeyen hata";
        result.put("message", message);
        
        // İlk hata konumunu bul (bizim kodumuzdaki)
        String location = "Bilinmeyen konum";
        StackTraceElement[] stack = ex.getStackTrace();
        for (StackTraceElement element : stack) {
            if (element.getClassName().startsWith("com.Destek")) {
                location = element.getClassName() + "." + element.getMethodName() + " (satır: " + element.getLineNumber() + ")";
                break;
            }
        }
        result.put("location", location);
        
        // Hata tipine göre özel öneriler
        addSuggestionByErrorType(result, ex);
        
        return result;
    }
    
    /**
     * Hata tipine göre çözüm önerisi ekler
     */
    private void addSuggestionByErrorType(Map<String, Object> result, Exception ex) {
        String message = ex.getMessage() != null ? ex.getMessage() : "";
        
        // Entity ile ilgili property hatası
        Matcher entityMatcher = ENTITY_FIELD_PATTERN.matcher(message);
        if (entityMatcher.find()) {
            String property = entityMatcher.group(1);
            String entityType = entityMatcher.group(2);
            result.put("suggestion", entityType + " sınıfında '" + property + "' alanı bulunamadı. Entity sınıfını kontrol edin veya Lombok'un doğru çalıştığından emin olun.");
            result.put("details", "Etkilenen Entity: " + entityType + "\nAranan Alan: " + property);
            return;
        }
        
        // ID ile ilgili hatalar
        Matcher idMatcher = ID_NOT_FOUND_PATTERN.matcher(message);
        if (idMatcher.find()) {
            String entityType = idMatcher.group(1);
            String id = idMatcher.group(2);
            result.put("suggestion", entityType + " veritabanında " + id + " ID'si ile kayıt bulunamadı. Veritabanı kayıtlarını kontrol edin.");
            return;
        }
        
        // Metod parametresi hatası
        Matcher methodArgMatcher = METHOD_ARG_ERROR.matcher(message);
        if (methodArgMatcher.find()) {
            String paramName = methodArgMatcher.group(1);
            String paramType = methodArgMatcher.group(2);
            result.put("suggestion", "İstek parametresi '" + paramName + "' (" + paramType + " türünde) eksik. İsteği kontrol edin.");
            return;
        }
        
        // Lombok ile ilgili hatalar
        if (message.contains("cannot find symbol") && message.contains("method get") || message.contains("method set")) {
            result.put("suggestion", "Getter/Setter metodları bulunamadı. Lombok'un doğru yapılandırıldığından emin olun. Entity sınıflarında @Data, @Getter, @Setter annotasyonları olmalı.");
            return;
        }
        
        // Bean çakışması
        if (message.contains("BeanDefinitionStoreException") || message.contains("conflicts with existing")) {
            result.put("suggestion", "Bean tanım çakışması var. Aynı bean adına sahip birden fazla component tanımlanmış olabilir. Sınıf adlarını değiştirin veya bean adlarını özelleştirin.");
            return;
        }
        
        // JPA Repository hatası 
        if (message.contains("No property") && message.contains("found for type")) {
            result.put("suggestion", "Repository metodunda kullanılan alan adı entity sınıfında bulunamadı. Repository metod adlarını entity alanlarıyla eşleşecek şekilde düzenleyin.");
            return;
        }
        
        // Genel Java hatası
        result.put("suggestion", "Kaynak kodunuzu kontrol edin. Lombok annotasyonlarının doğru çalıştığından emin olun ve eksik getter/setter metodları için entity sınıflarını güncelleyin.");
    }
} 