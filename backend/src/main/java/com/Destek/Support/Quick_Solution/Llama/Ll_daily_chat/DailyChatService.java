package com.Destek.Support.Quick_Solution.Llama.Ll_daily_chat;

import com.Destek.Support.Quick_Solution.ChatBot.LlamaConnector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * Günlük sohbet işlemlerini yöneten servis.
 * Not: Bu şu anda sadece derleme için gerekli olan bir taslak (stub) sınıftır.
 */
@Service
public class DailyChatService {
    
    private final LlamaConnector llamaConnector;
    
    @Autowired
    public DailyChatService(LlamaConnector llamaConnector) {
        this.llamaConnector = llamaConnector;
    }
    
    /**
     * Günlük sohbeti işler.
     * @param query Kullanıcı sorgusu
     * @param userId Kullanıcı ID
     * @return İşlem sonucu
     */
    public Map<String, Object> processDailyChat(String query, String userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Task parametresi ekleyerek, özel bir sohbet endpointi kullanabiliriz
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("query", query);
            requestData.put("userId", userId);
            requestData.put("mode", "chat");
            
            Map<String, Object> llamaResponse = llamaConnector.sendTaskRequest("chat", requestData);
            
            // Hata kontrolü
            if (llamaResponse.containsKey("error") && (boolean) llamaResponse.get("error")) {
                response.put("success", false);
                response.put("message", llamaResponse.get("message"));
                return response;
            }
            
            // Günlük sohbet limiti aşıldı mı kontrol et (gerçek uygulamada veritabanından)
            boolean limitExceeded = getDailyChatCount(userId) >= 5;
            
            response.put("success", !limitExceeded);
            response.put("message", limitExceeded ? 
                    "Günlük sohbet limitinize ulaştınız. Lütfen daha sonra tekrar deneyin." : 
                    llamaResponse.getOrDefault("message", "Merhaba! Size nasıl yardımcı olabilirim?"));
            response.put("queryType", "DAILY_CHAT");
            
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Yanıt oluşturulurken bir hata oluştu: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * Kullanıcının günlük sohbet sayısını döndürür.
     * @param userId Kullanıcı ID
     * @return Günlük sohbet sayısı
     */
    public int getDailyChatCount(String userId) {
        // Şu an için sabit bir değer döndürüyoruz
        // Gerçek uygulamada bir veritabanından ya da Redis'ten bu bilgi alınabilir
        return 0;
    }
} 