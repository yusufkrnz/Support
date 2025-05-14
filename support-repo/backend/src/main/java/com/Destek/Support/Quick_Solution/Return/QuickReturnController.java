package com.Destek.Support.Quick_Solution.Return;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/quick-return")
public class QuickReturnController {

    private final QuickReturnService returnService;

    @Autowired
    public QuickReturnController(QuickReturnService returnService) {
        this.returnService = returnService;
    }

    /**
     * AI kullanarak iade talebini doğrular
     * @param request İade talebi bilgileri
     * @return Doğrulama sonucu
     */
    @PostMapping("/validate")
    public ResponseEntity<ReturnResponse> validateReturnRequest(@RequestBody ReturnRequest request) {
        ReturnResponse response = returnService.validateReturnRequest(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * İade talebini kaydeder ve işleme alır
     * @param request İade talebi form bilgileri
     * @return İşlem sonucu
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processReturnRequest(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String returnReason = request.get("returnReason");
        String explanation = request.get("explanation");
        String imageBase64 = request.get("imageBase64");
        
        if (userId == null || returnReason == null || explanation == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Eksik bilgi");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<String, Object> response = returnService.processReturnRequest(userId, returnReason, explanation, imageBase64);
        return ResponseEntity.ok(response);
    }
    
    /**
     * İade formu için gerekli bilgileri getirir
     * @param userId Kullanıcı ID
     * @return Form bilgileri
     */
    @GetMapping("/form")
    public ResponseEntity<Map<String, Object>> getReturnForm(@RequestParam String userId) {
        Map<String, Object> formData = new HashMap<>();
        
        // İade nedenleri
        formData.put("returnReasons", new String[]{
            "Ürün hasarlı geldi",
            "Yanlış ürün geldi",
            "Ürün beklentileri karşılamadı",
            "Fikir değişikliği",
            "Diğer"
        });
        
        // Form alanları
        formData.put("fields", new Object[]{
            Map.of("name", "returnReason", "type", "select", "label", "İade Nedeni", "required", true),
            Map.of("name", "explanation", "type", "textarea", "label", "Açıklama", "required", true),
            Map.of("name", "image", "type", "file", "label", "Ürün Fotoğrafı", "accept", "image/*", "required", true)
        });
        
        return ResponseEntity.ok(formData);
    }
} 