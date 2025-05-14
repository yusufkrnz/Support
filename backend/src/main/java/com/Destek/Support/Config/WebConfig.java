package com.Destek.Support.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = Logger.getLogger(WebConfig.class.getName());
    private static final int[] FRONTEND_PORTS = {3000, 5173, 5500, 8080, 8081, 8082, 8083, 8084, 8085};

    @Autowired
    private Environment env;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(getAllPossibleOrigins().toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
        
        logger.info("WebConfig CORS yapılandırması güncellendi");
    }
    
    private List<String> getAllPossibleOrigins() {
        List<String> origins = new ArrayList<>();
        List<String> hosts = Arrays.asList("localhost", "127.0.0.1");
        List<String> protocols = Arrays.asList("http", "https");
        
        // Localhost/127.0.0.1 için farklı protokol ve portlarda origins oluştur
        for (String protocol : protocols) {
            for (String host : hosts) {
                for (int port : FRONTEND_PORTS) {
                    origins.add(String.format("%s://%s:%d", protocol, host, port));
                }
            }
        }
        
        // Ek olarak port olmadan da ekleyelim
        origins.add("http://localhost");
        origins.add("http://127.0.0.1");
        origins.add("https://localhost");
        origins.add("https://127.0.0.1");
        
        // Varsa production URL'leri de ekle
        origins.add("https://atasun.com");
        origins.add("https://www.atasun.com");
        
        logger.info("WebConfig origins: " + origins);
        return origins;
    }
} 