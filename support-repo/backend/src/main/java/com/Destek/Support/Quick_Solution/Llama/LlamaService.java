package com.Destek.Support.Quick_Solution.Llama;

import com.Destek.Support.Quick_Solution.ChatBot.LlamaConnector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * Llama AI ile genel sorguları işleyen servis.
 * Not: Bu şu anda sadece derleme için gerekli olan bir taslak (stub) sınıftır.
 */
@Service("quickLlamaService")
public class LlamaService {

    private final LlamaConnector llamaConnector;

    @Autowired
    public LlamaService(LlamaConnector llamaConnector) {
        this.llamaConnector = llamaConnector;
    }

    /**
     * Genel sorguları işler.
     * @param query Kullanıcı sorgusu
     * @param userId Kullanıcı ID
     * @return İşlem sonucu
     */
    public Map<String, Object> processGeneralQuery(String query, String userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Mevcut LlamaConnector'ı kullan
            Map<String, Object> llamaResponse = llamaConnector.sendQuery(query);
            
            // Hata kontrolü
            if (llamaResponse.containsKey("error") && (boolean) llamaResponse.get("error")) {
                response.put("success", false);
                response.put("message", llamaResponse.get("message"));
                return response;
            }
            
            response.put("success", true);
            response.put("message", llamaResponse.getOrDefault("message", "Yanıt alınamadı."));
            response.put("queryType", "GENERAL_QUERY");
            
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Sorgu işlenirken bir hata oluştu: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * Llama AI'nın sağlık durumunu kontrol eder
     * @return Sağlık durumu
     */
    public Map<String, Object> checkLlamaHealth() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Basit bir sağlık kontrolü sorgusu
            Map<String, Object> healthResponse = llamaConnector.sendQuery("health_check");
            boolean isHealthy = !healthResponse.containsKey("error");
            
            response.put("service", "Llama API");
            response.put("status", isHealthy ? "UP" : "DOWN");
            response.put("timestamp", System.currentTimeMillis());
            
            return response;
        } catch (Exception e) {
            response.put("service", "Llama API");
            response.put("status", "DOWN");
            response.put("timestamp", System.currentTimeMillis());
            response.put("error", e.getMessage());
            
            return response;
        }
    }
} 