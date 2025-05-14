package com.Destek.Support.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * Spring Security yapılandırma sınıfı.
 * Rol tabanlı erişim kontrolünü yapılandırır.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    /**
     * Şifre şifreleme aracı
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * Security Filter Chain yapılandırması
     * Endpoint bazlı yetkilendirme burada tanımlanır
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS yapılandırmasını etkinleştir
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // CSRF korumasını devre dışı bırak
            .csrf(csrf -> csrf.disable())
            // HTTP isteklerini yetkilendir
            .authorizeHttpRequests(authorize -> authorize
                // OPTIONS istekleri için tam izin
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Auth API için tüm metodlara özel izinler
                .requestMatchers(HttpMethod.GET, "/auth/**", "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/**", "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/auth/**", "/api/auth/**").permitAll()
                .requestMatchers("/auth/**", "/api/auth/**").permitAll() // Catch-all
                
                // Chatbot API'leri için açık erişim - tüm HTTP metodları
                .requestMatchers(HttpMethod.GET, "/chatbot/**", "/api/chatbot/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/chatbot/**", "/api/chatbot/**").permitAll()
                .requestMatchers("/chatbot/**", "/api/chatbot/**").permitAll()
                .requestMatchers("/quicksolution/chatbot/**", "/api/quicksolution/chatbot/**").permitAll() 
                .requestMatchers("/chat/**", "/api/chat/**").permitAll()
                
                // Public endpoint'lere açık erişim
                .requestMatchers("/public/**", "/api/public/**").permitAll()
                
                // Admin API'leri için rol bazlı kontrol
                .requestMatchers("/admin/**", "/api/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers("/role-ops/**", "/api/role-ops/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                
                // Diğer tüm API'ler için genel erişim
                .anyRequest().permitAll()
            )
            // Oturum yönetimi
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
    
    /**
     * CORS yapılandırması
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Specific origins for credentials
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000", 
            "http://localhost:5173",
            "http://127.0.0.1:3000", 
            "http://127.0.0.1:5173",
            "http://localhost:8080", 
            "http://localhost:8081",
            "http://127.0.0.1:8080", 
            "http://127.0.0.1:8081"
        ));
        // Tüm HTTP metodlarına izin ver
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // Tüm headerlara izin ver
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Kullanıcı kimlik bilgilerini kabul et
        configuration.setAllowCredentials(true);
        // Tüm exposed headerlara izin ver
        configuration.setExposedHeaders(Arrays.asList("*"));
        // CORS önbellek süresi
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 