package com.Destek.Support.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeoutException;
import java.time.Duration;

@Service
public class LlamaService {

    private final WebClient webClient;
    
    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;
    
    @Value("${ai.service.timeout:30}")
    private Integer aiServiceTimeout;

    @Autowired
    public LlamaService(@Value("${ai.service.url:http://localhost:8000}") String aiServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(aiServiceUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        
        System.out.println("AI Service URL: " + aiServiceUrl);
    }

    /**
     * Process a user query with the Llama AI service
     * 
     * @param query The user's message
     * @param queryType The type of query (from classification)
     * @return Response from AI service
     */
    public Map<String, Object> processQuery(String query, String queryType) {
        try {
            // Prepare request payload
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("query", query);
            requestPayload.put("queryType", queryType);
            
            // Call AI service
            Map<String, Object> response = webClient.post()
                    .uri("/generate")
                    .bodyValue(requestPayload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(aiServiceTimeout))
                    .onErrorResume(TimeoutException.class, e -> {
                        // Handle timeout with a fallback response
                        Map<String, Object> fallbackResponse = new HashMap<>();
                        fallbackResponse.put("message", "AI servisi şu anda yanıt vermiyor. Lütfen daha sonra tekrar deneyin.");
                        fallbackResponse.put("error", "timeout");
                        return Mono.just(fallbackResponse);
                    })
                    .onErrorResume(e -> {
                        // General error handler
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("message", "AI servisi ile iletişim kurulurken bir hata oluştu: " + e.getMessage());
                        errorResponse.put("error", e.getClass().getSimpleName());
                        return Mono.just(errorResponse);
                    })
                    .block();
            
            // Check if response contains an error
            if (response.containsKey("error")) {
                return getFallbackResponse(query, queryType);
            }
            
            return response;
            
        } catch (Exception e) {
            e.printStackTrace();
            // Return a fallback response if AI service is unavailable
            return getFallbackResponse(query, queryType);
        }
    }
    
    /**
     * Get form fields based on category
     */
    public List<Map<String, Object>> getFormFieldsForCategory(String category) {
        try {
            // Try to get from AI service
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("category", category);
            
            Map<String, Object> response = webClient.post()
                    .uri("/form-fields")
                    .bodyValue(requestPayload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(aiServiceTimeout))
                    .onErrorResume(e -> Mono.just(new HashMap<String, Object>()))
                    .block();
            
            if (response != null && response.containsKey("fields")) {
                return (List<Map<String, Object>>) response.get("fields");
            }
            
            // Fall back to default fields if service fails
            return getDefaultFormFields(category);
            
        } catch (Exception e) {
            e.printStackTrace();
            // Return default fields
            return getDefaultFormFields(category);
        }
    }
    
    /**
     * Generate default form fields for each category
     */
    private List<Map<String, Object>> getDefaultFormFields(String category) {
        List<Map<String, Object>> fields = new ArrayList<>();
        
        if ("RETURN".equals(category)) {
            // Return form fields
            Map<String, Object> returnReason = new HashMap<>();
            returnReason.put("name", "returnReason");
            returnReason.put("type", "select");
            returnReason.put("label", "İade Nedeni");
            returnReason.put("options", List.of("Ürün hasarlı geldi", "Yanlış ürün geldi", 
                    "Ürün beklentileri karşılamadı", "Fikir değişikliği", "Diğer"));
            
            Map<String, Object> orderNo = new HashMap<>();
            orderNo.put("name", "orderNo");
            orderNo.put("type", "text");
            orderNo.put("label", "Sipariş Numarası");
            
            Map<String, Object> explanation = new HashMap<>();
            explanation.put("name", "explanation");
            explanation.put("type", "textarea");
            explanation.put("label", "Açıklama");
            
            fields.add(returnReason);
            fields.add(orderNo);
            fields.add(explanation);
        } 
        else if ("COMPLAINT".equals(category)) {
            // Complaint form fields
            Map<String, Object> title = new HashMap<>();
            title.put("name", "title");
            title.put("type", "text");
            title.put("label", "Şikayet Başlığı");
            
            Map<String, Object> unit = new HashMap<>();
            unit.put("name", "unit");
            unit.put("type", "select");
            unit.put("label", "İlgili Birim");
            unit.put("options", List.of("Ürün Kalitesi", "Kargo/Teslimat", 
                    "Müşteri Hizmetleri", "Web Sitesi/Uygulama", "Diğer"));
            
            Map<String, Object> description = new HashMap<>();
            description.put("name", "description");
            description.put("type", "textarea");
            description.put("label", "Detaylı Açıklama");
            
            fields.add(title);
            fields.add(unit);
            fields.add(description);
        }
        
        return fields;
    }
    
    /**
     * Generate a fallback response when AI service is unavailable
     */
    private Map<String, Object> getFallbackResponse(String query, String queryType) {
        Map<String, Object> fallbackResponse = new HashMap<>();
        
        // Basic response for different query types
        switch (queryType) {
            case "RETURN":
                fallbackResponse.put("message", "İade talebi oluşturmak için lütfen formu doldurun.");
                fallbackResponse.put("nextStep", "RETURN_FORM");
                fallbackResponse.put("formFields", getDefaultFormFields("RETURN"));
                break;
                
            case "COMPLAINT":
                fallbackResponse.put("message", "Şikayetinizi almak için lütfen formu doldurun.");
                fallbackResponse.put("nextStep", "COMPLAINT_FORM");
                fallbackResponse.put("formFields", getDefaultFormFields("COMPLAINT"));
                break;
                
            case "CLASSIC_QUERY":
                // For classic queries, give a generic response
                fallbackResponse.put("message", "Bu konuda yardımcı olabilmek için daha fazla bilgiye ihtiyacım var. Lütfen sorgunuzu daha detaylı açıklayabilir misiniz?");
                break;
                
            case "GENERAL_QUERY":
            default:
                // For general queries, use simple pattern matching for common queries
                String lowerQuery = query.toLowerCase();
                
                if (lowerQuery.contains("merhaba") || lowerQuery.contains("selam")) {
                    fallbackResponse.put("message", "Merhaba! Size nasıl yardımcı olabilirim?");
                } 
                else if (lowerQuery.contains("teşekkür")) {
                    fallbackResponse.put("message", "Rica ederim! Başka bir konuda yardımcı olabilir miyim?");
                }
                else if (lowerQuery.contains("sipariş") && lowerQuery.contains("takip")) {
                    fallbackResponse.put("message", "Siparişinizi takip etmek için lütfen sipariş numaranızı paylaşır mısınız?");
                }
                else {
                    fallbackResponse.put("message", "Üzgünüm, şu anda sorunuza yanıt veremiyorum. Müşteri hizmetlerimize bağlanmak için lütfen formu doldurun.");
                }
                break;
        }
        
        return fallbackResponse;
    }
} 