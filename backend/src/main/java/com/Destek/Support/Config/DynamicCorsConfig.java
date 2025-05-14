package com.Destek.Support.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

@Configuration
public class DynamicCorsConfig {

    private static final Logger logger = Logger.getLogger(DynamicCorsConfig.class.getName());
    
    // Frontend için olası portlar
    private static final int[] FRONTEND_PORTS = {3000, 5173, 5500, 8080, 8081, 8082, 8083, 8084, 8085};
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Tüm olası domain ve portları ekle
        config.setAllowedOrigins(getAllPossibleOrigins());
        
        // HTTP metodlarını ekle
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        
        // Tüm başlıklara izin ver
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Credentials kullanımını devre dışı bırak (CORS sorunlarını önlemek için)
        config.setAllowCredentials(false);
        
        // Preflight cache süresi
        config.setMaxAge(3600L);
        
        // Tüm yollara uygula
        source.registerCorsConfiguration("/**", config);
        
        logger.info("Dinamik CORS yapılandırması oluşturuldu: " + config.getAllowedOrigins().size() + " origin eklendi");
        return new CorsFilter(source);
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
        
        logger.info("Oluşturulan origins: " + origins);
        return origins;
    }
} 