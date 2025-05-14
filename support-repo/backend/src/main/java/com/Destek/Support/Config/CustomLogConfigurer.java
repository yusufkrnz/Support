package com.Destek.Support.Config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * Özel log yapılandırması için sınıf.
 * Uygulama hata mesajlarını basitleştirmek ve daha anlaşılır hale getirmek için kullanılır.
 */
@Configuration
public class CustomLogConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(CustomLogConfigurer.class);

    @Bean
    public CommandLineRunner customLogInitializer(Environment env) {
        return args -> {
            System.setProperty("spring.main.banner-mode", "off");
            logger.info("Özel log yapılandırması başlatıldı");
            
            // Uygulama başlangıcında özel hata işleyicisini tanıt
            Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
                logger.error("İşlenmeyen hata tespit edildi: {}", throwable.getMessage());
                ErrorLogFormatter.printSimplifiedError(throwable);
            });
            
            // Log seviyelerini göster
            logger.debug("Log düzeyi yapılandırması:");
            logger.debug("Root log düzeyi: {}", env.getProperty("logging.level.root", "WARN"));
            logger.debug("Com.Destek log düzeyi: {}", env.getProperty("logging.level.com.Destek", "INFO"));
            logger.debug("Spring Web log düzeyi: {}", env.getProperty("logging.level.org.springframework.web", "WARN"));
            logger.debug("Hibernate log düzeyi: {}", env.getProperty("logging.level.org.hibernate", "WARN"));
        };
    }
    
    /**
     * Sistemde yakalanan RuntimeException tipindeki hataları basitleştirilmiş bir formatta yazdırır.
     * Bu bean, hatalar yakalandığında ErrorLogFormatter sınıfını kullanarak hata mesajını biçimlendirir.
     */
    @Bean
    public Thread.UncaughtExceptionHandler globalUncaughtExceptionHandler() {
        return (thread, throwable) -> {
            logger.error("İşlenmeyen hata tespit edildi: Thread={}, Hata={}", thread.getName(), throwable.getMessage());
            ErrorLogFormatter.printSimplifiedError(throwable);
        };
    }
} 