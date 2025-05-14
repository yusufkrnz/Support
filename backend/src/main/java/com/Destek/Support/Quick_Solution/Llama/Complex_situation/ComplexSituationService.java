package com.Destek.Support.Quick_Solution.Llama.Complex_situation;

import com.Destek.Support.Quick_Solution.ChatBot.LlamaConnector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * Karmaşık durumları işleyen servis.
 * Not: Bu şu anda sadece derleme için gerekli olan bir taslak (stub) sınıftır.
 */
@Service
public class ComplexSituationService {
    
    private final LlamaConnector llamaConnector;
    
    @Autowired
    public ComplexSituationService(LlamaConnector llamaConnector) {
        this.llamaConnector = llamaConnector;
    }
    
    /**
     * Karmaşık durumları analiz eder.
     * @param query Kullanıcı sorgusu
     * @param userId Kullanıcı ID
     * @return Analiz sonucu
     */
    public Map<String, Object> analyzeComplexSituation(String query, String userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Task parametresi ekleyerek, özel bir analiz endpointi kullanabiliriz
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("query", query);
            requestData.put("userId", userId);
            
            Map<String, Object> llamaResponse = llamaConnector.sendTaskRequest("analyze", requestData);
            
            // Hata kontrolü
            if (llamaResponse.containsKey("error") && (boolean) llamaResponse.get("error")) {
                response.put("success", false);
                response.put("message", llamaResponse.get("message"));
                return response;
            }
            
            response.put("success", true);
            response.put("message", llamaResponse.getOrDefault("message", "Analiz tamamlandı."));
            response.put("redirectToAgent", llamaResponse.getOrDefault("redirectToAgent", false));
            response.put("queryType", "COMPLEX_SITUATION");
            
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Analiz sırasında bir hata oluştu: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * Kullanıcının karmaşık sorgu sayısını döndürür.
     * @param userId Kullanıcı ID
     * @return Karmaşık sorgu sayısı
     */
    public int getComplexQueryCount(String userId) {
        // Şu an için sabit bir değer döndürüyoruz
        // Gerçek uygulamada bir veritabanından ya da Redis'ten bu bilgi alınabilir
        return 0;
    }
} 