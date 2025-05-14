package com.Destek.Support.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Ana CORS yapılandırması - tüm origin'ler için
                registry.addMapping("/**")
                        .allowedOrigins(
                            "http://localhost:3000", 
                            "http://localhost:5173",
                            "http://127.0.0.1:3000", 
                            "http://127.0.0.1:5173",
                            "http://localhost:8080", 
                            "http://localhost:8081",
                            "http://127.0.0.1:8080", 
                            "http://127.0.0.1:8081"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
                
                // Auth endpoint'leri için özel yapılandırma - kimlik doğrulama, her zaman credentials gerektirir
                registry.addMapping("/auth/**")
                        .allowedOrigins(
                            "http://localhost:3000", 
                            "http://localhost:5173",
                            "http://127.0.0.1:3000", 
                            "http://127.0.0.1:5173",
                            "http://localhost:8080", 
                            "http://localhost:8081",
                            "http://127.0.0.1:8080", 
                            "http://127.0.0.1:8081"
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
                
                registry.addMapping("/api/auth/**")
                        .allowedOrigins(
                            "http://localhost:3000", 
                            "http://localhost:5173",
                            "http://127.0.0.1:3000", 
                            "http://127.0.0.1:5173",
                            "http://localhost:8080", 
                            "http://localhost:8081",
                            "http://127.0.0.1:8080", 
                            "http://127.0.0.1:8081"
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
                
                // Chatbot endpoint'leri için özel yapılandırma
                registry.addMapping("/chatbot/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(false) // Credential gerektirmediği için false
                        .maxAge(3600);
                
                registry.addMapping("/api/chatbot/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(false) // Credential gerektirmediği için false
                        .maxAge(3600);
                
                registry.addMapping("/quicksolution/chatbot/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(false)
                        .maxAge(3600);
                
                registry.addMapping("/api/quicksolution/chatbot/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(false)
                        .maxAge(3600);
                
                registry.addMapping("/chat/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(false)
                        .maxAge(3600);
                
                registry.addMapping("/api/chat/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(false)
                        .maxAge(3600);
            }
        };
    }
} 