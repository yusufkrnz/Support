package com.Destek.Support.Quick_Solution.Return;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class QuickReturnService {

    private final GeminiConnector geminiConnector;
    
    @Value("${return.notification.email.subject:İade Talebiniz}")
    private String emailSubject;
    
    @Value("${return.notification.email.template:İade talebiniz alınmıştır. İade No: %s}")
    private String emailTemplate;

    @Autowired
    public QuickReturnService(GeminiConnector geminiConnector) {
        this.geminiConnector = geminiConnector;
    }
    
    /**
     * İade talebini doğrular
     * @param request İade talebi bilgileri
     * @return Doğrulama sonucu
     */
    public ReturnResponse validateReturnRequest(ReturnRequest request) {
        ReturnResponse response = new ReturnResponse();
        
        try {
            // Gerekli alanlar var mı kontrol et
            if (request.getUserId() == null || request.getUserId().isEmpty()) {
                response.setSuccess(false);
                response.setMessage("Kullanıcı ID boş olamaz");
                return response;
            }
            
            if (request.getReturnReason() == null || request.getReturnReason().isEmpty()) {
                response.setSuccess(false);
                response.setMessage("İade nedeni belirtilmelidir");
                return response;
            }
            
            if (request.getExplanation() == null || request.getExplanation().isEmpty()) {
                response.setSuccess(false);
                response.setMessage("Açıklama alanı boş olamaz");
                return response;
            }
            
            // Gemini API'yi kullanarak iade talebini değerlendir
            Map<String, Object> analysisResult = geminiConnector.analyzeReturnRequest(
                    request.getReturnReason(),
                    request.getExplanation(),
                    request.getImageUrl()
            );
            
            // Analiz sonucunu ReturnResponse'a dönüştür
            boolean isAcceptable = analysisResult.containsKey("isAcceptable") 
                    ? (boolean) analysisResult.get("isAcceptable") 
                    : false;
            
            String validationMessage = analysisResult.containsKey("validationMessage") 
                    ? (String) analysisResult.get("validationMessage") 
                    : "İade talebiniz analiz edildi.";
            
            response.setSuccess(true);
            response.setAcceptable(isAcceptable);
            response.setMessage(validationMessage);
            response.setAdditionalInfo(analysisResult);
            
            return response;
        } catch (IOException e) {
            response.setSuccess(false);
            response.setMessage("İade talebi doğrulaması sırasında bir hata oluştu: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * İade talebini işler ve Gemini API aracılığıyla doğrular
     * @param userId Kullanıcı ID
     * @param returnReason İade nedeni
     * @param explanation Açıklama
     * @param imageUrl Ürün görseli URL'i
     * @return İşlem sonucu
     */
    public Map<String, Object> processReturnRequest(String userId, String returnReason, String explanation, String imageUrl) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Gemini API'ye istek gönder
            Map<String, Object> analysisResult = geminiConnector.analyzeReturnRequest(
                    returnReason,
                    explanation,
                    imageUrl
            );
            
            // API yanıtını işle
            response.put("success", true);
            response.put("analysisResult", analysisResult);
            response.put("rawResponse", analysisResult.get("rawResponse"));
            
            return response;
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "İade talebi işlenirken bir hata oluştu: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * Gemini API'nin sağlık durumunu kontrol eder
     * @return API sağlık durumu
     */
    public Map<String, Object> checkGeminiHealth() {
        Map<String, Object> response = new HashMap<>();
        boolean isHealthy = geminiConnector.healthCheck();
        
        response.put("service", "Gemini API");
        response.put("status", isHealthy ? "UP" : "DOWN");
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }
} 