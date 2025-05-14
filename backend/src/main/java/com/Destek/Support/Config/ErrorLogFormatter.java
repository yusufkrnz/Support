package com.Destek.Support.Config;

import org.springframework.boot.context.event.ApplicationFailedEvent;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Uygulama başlatma ve çalışma zamanı hatalarını daha anlaşılır şekilde biçimlendiren sınıf.
 * Bu sınıf yığın izlemesini analiz eder ve daha kısa, özetlenmiş bir hata mesajı oluşturur.
 */
@Component
@ControllerAdvice
public class ErrorLogFormatter extends ResponseEntityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(ErrorLogFormatter.class);

    private static final Pattern BEAN_DEFINITION_EXCEPTION = Pattern.compile("BeanDefinitionStoreException.*conflicts with existing.*");
    private static final Pattern UNSATISFIED_DEPENDENCY = Pattern.compile("UnsatisfiedDependencyException.*Error creating bean with name '([^']+)'.*Unsatisfied dependency.*'([^']+)'");
    private static final Pattern PROPERTY_NOT_FOUND = Pattern.compile("No property '([^']+)' found for type '([^']+)'");
    private static final Pattern AMBIGUOUS_MAPPING = Pattern.compile("Ambiguous mapping.*Cannot map '([^']+)' method.*to \\{([^\\}]+)\\}.*'([^']+)' bean method");
    private static final Pattern VALIDATION_ERROR = Pattern.compile("MethodArgumentNotValidException.*field error.*: \\[([^\\]]+)\\]");
    
    /**
     * Uygulama başlatılırken oluşan hataları yakalar
     */
    @EventListener
    public void handleApplicationFailedEvent(ApplicationFailedEvent event) {
        Throwable exception = event.getException();
        if (exception != null) {
            printSimplifiedError(exception);
        }
    }
    
    /**
     * Çalışma zamanı hatalarını yakalar ve formatlar
     */
    @ExceptionHandler(Exception.class)
    public ModelAndView handleRuntimeException(Exception ex, HttpServletRequest request, HttpServletResponse response) {
        printSimplifiedError(ex);
        
        // Normal hata işleme zincirini devam ettir
        return null;
    }
    
    /**
     * Uygulamada oluşan hataları konsola basitleştirilmiş şekilde yazdırır
     */
    public static void printSimplifiedError(Throwable exception) {
        String errorMessage = getErrorMessage(exception);
        
        System.out.println("\n\n");
        System.out.println("╔═════════════════════════════════════════════════════════════════════════╗");
        System.out.println("║                        HATA RAPORU - ÖZETLENMİŞ                         ║");
        System.out.println("╚═════════════════════════════════════════════════════════════════════════╝");
        System.out.println();
        System.out.println(errorMessage);
        System.out.println();
        System.out.println("╔═════════════════════════════════════════════════════════════════════════╗");
        System.out.println("║                          DETAYLI ÇÖZÜM                                  ║");
        System.out.println("╚═════════════════════════════════════════════════════════════════════════╝");
        System.out.println();
        
        // Hataya göre çözüm önerileri sunma
        printSolutionSuggestions(exception);
    }
    
    /**
     * Hataları analiz edip kısa ve net bir mesaj döndürür
     */
    private static String getErrorMessage(Throwable exception) {
        StringBuilder sb = new StringBuilder();
        
        // İstisnanın yığın izinin ilk kaç satırı alınacak
        int stackTraceLines = 3;
        
        // Hata tipini belirleme
        if (exception.getMessage() != null) {
            // Bean çakışması durumu
            Matcher beanMatcher = BEAN_DEFINITION_EXCEPTION.matcher(exception.toString());
            if (beanMatcher.find()) {
                sb.append("HATA TİPİ: Bean Tanımı Çakışması\n\n");
                
                // Çakışan bean'leri bul
                Pattern conflictPattern = Pattern.compile("\\[(.*?)\\] conflicts with");
                Matcher conflictMatcher = conflictPattern.matcher(exception.toString());
                
                if (conflictMatcher.find()) {
                    sb.append("ÇAKIŞAN BEAN: ").append(conflictMatcher.group(1)).append("\n\n");
                    sb.append("ÇÖZÜM: Bu sınıfı yeniden adlandırın veya @Component/@Service gibi annotasyonları kaldırın.");
                }
                return sb.toString();
            }
            
            // Bağımlılık hatası
            Matcher dependencyMatcher = UNSATISFIED_DEPENDENCY.matcher(exception.toString());
            if (dependencyMatcher.find()) {
                sb.append("HATA TİPİ: Çözülemeyen Bağımlılık\n\n");
                sb.append("HATALI BEAN: ").append(dependencyMatcher.group(1)).append("\n");
                sb.append("BAĞIMLI OLDUĞU: ").append(dependencyMatcher.group(2)).append("\n\n");
                
                // Özellik bulunamadı hatası
                Matcher propertyMatcher = PROPERTY_NOT_FOUND.matcher(exception.toString());
                if (propertyMatcher.find()) {
                    sb.append("EKSİK ÖZELLİK: ").append(propertyMatcher.group(1)).append("\n");
                    sb.append("SINIF: ").append(propertyMatcher.group(2));
                }
                return sb.toString();
            }
            
            // Çakışan endpoint hatası
            Matcher mappingMatcher = AMBIGUOUS_MAPPING.matcher(exception.toString());
            if (mappingMatcher.find()) {
                sb.append("HATA TİPİ: Çakışan URL Mapping\n\n");
                sb.append("CONTROLLER BEAN: ").append(mappingMatcher.group(1)).append("\n");
                sb.append("URL MAPPING: ").append(mappingMatcher.group(2)).append("\n");
                sb.append("ÇAKIŞAN CONTROLLER: ").append(mappingMatcher.group(3));
                return sb.toString();
            }
            
            // Doğrulama hatası
            Matcher validationMatcher = VALIDATION_ERROR.matcher(exception.toString());
            if (validationMatcher.find()) {
                sb.append("HATA TİPİ: Veri Doğrulama Hatası\n\n");
                sb.append("HATALI ALAN: ").append(validationMatcher.group(1));
                return sb.toString();
            }
        }
        
        // Genel hata durumu
        sb.append("HATA TİPİ: ").append(exception.getClass().getSimpleName()).append("\n\n");
        sb.append("HATA MESAJI: ").append(exception.getMessage() != null ? exception.getMessage() : "Hata mesajı yok").append("\n\n");
        
        // Hatanın oluştuğu sınıfı ve satır numarasını bul
        StackTraceElement[] stackTraceElements = exception.getStackTrace();
        if (stackTraceElements.length > 0) {
            sb.append("HATA KONUMU:\n");
            
            for (int i = 0; i < Math.min(stackTraceElements.length, stackTraceLines); i++) {
                StackTraceElement element = stackTraceElements[i];
                if (element.getClassName().startsWith("com.Destek")) {  // Sadece projemize ait sınıfları göster
                    sb.append("-> ").append(element.getClassName()).append(".").append(element.getMethodName())
                      .append(" (satır: ").append(element.getLineNumber()).append(")\n");
                }
            }
        }
        
        // İlk hatanın nedenini bul
        Throwable rootCause = findRootCause(exception);
        if (rootCause != exception) {
            sb.append("\nKÖK NEDEN: ").append(rootCause.getClass().getSimpleName()).append(" - ")
              .append(rootCause.getMessage() != null ? rootCause.getMessage() : "Hata mesajı yok");
        }
        
        return sb.toString();
    }
    
    private static Throwable findRootCause(Throwable throwable) {
        Throwable cause = throwable.getCause();
        if (cause == null) {
            return throwable;
        }
        return findRootCause(cause);
    }
    
    private static void printSolutionSuggestions(Throwable exception) {
        // Hata tipine göre çözüm önerileri
        if (exception.toString().contains("BeanDefinitionStoreException") || 
            exception.toString().contains("conflicts with existing")) {
            printBeanConflictSolution();
        } else if (exception.toString().contains("UnsatisfiedDependencyException")) {
            if (exception.toString().contains("No property") && exception.toString().contains("found for type")) {
                printPropertyNotFoundSolution();
            } else {
                printDependencySolution();
            }
        } else if (exception.toString().contains("Ambiguous mapping")) {
            printAmbiguousMappingSolution();
        } else if (exception.toString().contains("MethodArgumentNotValidException")) {
            printValidationErrorSolution();
        } else if (exception.toString().contains("DataIntegrityViolationException")) {
            printDataIntegrityViolationSolution();
        } else if (exception.toString().contains("AccessDeniedException")) {
            printAccessDeniedSolution();
        } else {
            printGeneralSolution();
        }
    }
    
    private static void printBeanConflictSolution() {
        System.out.println("Bean isim çakışması tespit edildi. Bu hatanın çözümü için:");
        System.out.println("1. Çakışan sınıflardan birini yeniden adlandırın");
        System.out.println("2. Veya @Component, @Service, @Controller gibi bean oluşturan anotasyonları kaldırın");
        System.out.println("3. Veya bean tanımına özel isim verin: @Service(\"customBeanName\")");
        System.out.println("4. Veya application.properties dosyasına ekleyin: spring.main.allow-bean-definition-overriding=true");
    }
    
    private static void printPropertyNotFoundSolution() {
        System.out.println("Entity sınıfında olmayan bir özellik kullanılıyor. Bu hatanın çözümü için:");
        System.out.println("1. Repository metod adını entity'deki mevcut alan adına göre düzeltin");
        System.out.println("2. Veya entity sınıfına eksik özelliği ekleyin");
        System.out.println("3. Hata mesajında belirtilen alanların veri tabanında doğru şekilde eşleştirildiğinden emin olun");
    }
    
    private static void printDependencySolution() {
        System.out.println("Bağımlılık çözülemedi. Bu hatanın çözümü için:");
        System.out.println("1. Gerekli bean'in doğru şekilde tanımlandığından emin olun");
        System.out.println("2. Bean'in yaşam döngüsünü (scope) kontrol edin");
        System.out.println("3. Döngüsel bağımlılıkları kontrol edin");
        System.out.println("4. (required=false) kullanarak isteğe bağlı enjeksiyonu düşünün");
    }
    
    private static void printAmbiguousMappingSolution() {
        System.out.println("Aynı URL mapping'i için birden fazla handler metodu tanımlı. Bu hatanın çözümü için:");
        System.out.println("1. Çakışan controller sınıflarından birini farklı bir URL ile eşleştirin");
        System.out.println("2. Eski controller'ı @Deprecated ile işaretleyin ve URL'yi değiştirin");
        System.out.println("3. Controller metod adlarını benzersiz yapın");
        System.out.println("4. Eski controller dosyasının adını değiştirin (örneğin ChatBotController.java -> LegacyChatBotController.java)");
    }
    
    private static void printValidationErrorSolution() {
        System.out.println("Veri doğrulama hatası tespit edildi. Bu hatanın çözümü için:");
        System.out.println("1. Gönderilen verilerin doğrulama kurallarına uygun olduğundan emin olun");
        System.out.println("2. Gerekli alanların doğru formatta olduğunu kontrol edin");
        System.out.println("3. İstemci tarafında da doğrulama ekleyin");
    }
    
    private static void printDataIntegrityViolationSolution() {
        System.out.println("Veri bütünlüğü ihlali tespit edildi. Bu hatanın çözümü için:");
        System.out.println("1. Benzersiz kısıtlama ihlalini kontrol edin (unique constraint)");
        System.out.println("2. Foreign key ilişkilerini kontrol edin");
        System.out.println("3. Veri uzunluğunun izin verilen sınırlar içinde olduğundan emin olun");
    }
    
    private static void printAccessDeniedSolution() {
        System.out.println("Erişim reddedildi hatası tespit edildi. Bu hatanın çözümü için:");
        System.out.println("1. Kullanıcının gerekli yetkilere sahip olduğundan emin olun");
        System.out.println("2. SecurityConfig'deki izin ayarlarını kontrol edin");
        System.out.println("3. JWT veya oturum tokeninin geçerli olduğundan emin olun");
    }
    
    private static void printGeneralSolution() {
        System.out.println("Genel hata çözüm önerileri:");
        System.out.println("1. Günlük (log) dosyalarını kontrol edin");
        System.out.println("2. Bağımlılıkların doğru sürümde olduğundan emin olun");
        System.out.println("3. Konfigurasyon dosyalarını kontrol edin");
        System.out.println("4. Spring Boot uygulamasını DEBUG modunda başlatın: mvn spring-boot:run -Dspring-boot.run.arguments=--debug");
    }
} 