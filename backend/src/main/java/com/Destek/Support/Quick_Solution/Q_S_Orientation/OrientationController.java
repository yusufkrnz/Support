package com.Destek.Support.Quick_Solution.Q_S_Orientation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/orientation")
public class OrientationController {

    private final OrientationService orientationService;

    @Autowired
    public OrientationController(OrientationService orientationService) {
        this.orientationService = orientationService;
    }

    /**
     * Kullanıcı sorgusunu yönlendir
     * @param request Sorgu ve kullanıcı bilgileri
     * @return Yönlendirme sonucu
     */
    @PostMapping("/route")
    public ResponseEntity<Map<String, Object>> routeQuery(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        String userId = request.get("userId");
        
        if (query == null || query.trim().isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Sorgu boş olamaz");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<String, Object> response = orientationService.routeQuery(query, userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Kullanıcı giriş yaptıktan sonra kaldığı yerden devam et
     * @param request Session ID ve kullanıcı bilgileri
     * @return Yönlendirme sonucu
     */
    @PostMapping("/resume")
    public ResponseEntity<Map<String, Object>> resumeAfterLogin(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");
        String userId = request.get("userId");
        
        if (sessionId == null || sessionId.trim().isEmpty() || userId == null || userId.trim().isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Session ID ve Kullanıcı ID gereklidir");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<String, Object> response = orientationService.resumeAfterLogin(sessionId, userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * İade talebi işleme
     * @param request İade talebi bilgileri
     * @return İşlem sonucu
     */
    @PostMapping("/process-return")
    public ResponseEntity<Map<String, Object>> processReturnRequest(@RequestBody Map<String, String> request) {
        String returnReason = request.get("returnReason");
        String explanation = request.get("explanation");
        String imageBase64 = request.get("imageBase64");
        String userId = request.get("userId");
        
        if (returnReason == null || explanation == null || userId == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Tüm alanlar doldurulmalıdır");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<String, Object> response = orientationService.processReturnRequest(returnReason, explanation, imageBase64, userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Şikayet talebi işleme
     * @param request Şikayet talebi bilgileri
     * @return İşlem sonucu
     */
    @PostMapping("/process-complaint")
    public ResponseEntity<Map<String, Object>> processComplaintRequest(@RequestBody Map<String, String> request) {
        String complaintType = request.get("complaintType");
        String explanation = request.get("explanation");
        String userId = request.get("userId");
        
        if (complaintType == null || explanation == null || userId == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Tüm zorunlu alanlar doldurulmalıdır");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<String, Object> response = orientationService.processComplaintRequest(complaintType, explanation, userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Genel sorgu işleme (Llama AI)
     * @param request Sorgu bilgileri
     * @return İşlem sonucu
     */
    @PostMapping("/process-general-query")
    public ResponseEntity<Map<String, Object>> processGeneralQuery(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        String userId = request.get("userId"); // Opsiyonel
        
        if (query == null || query.trim().isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Sorgu boş olamaz");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<String, Object> response = orientationService.processGeneralQuery(query, userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Klasik sorgu işleme (CRUD)
     * @param request İşlem bilgileri
     * @return İşlem sonucu
     */
    @PostMapping("/process-classic-query")
    public ResponseEntity<Map<String, Object>> processClassicQuery(@RequestBody Map<String, String> request) {
        String operation = request.get("operation");
        String userId = request.get("userId");
        
        if (operation == null || operation.trim().isEmpty() || userId == null || userId.trim().isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "İşlem tipi ve Kullanıcı ID gereklidir");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // İşlem dışındaki tüm parametreleri yeni bir map'e aktar
        Map<String, String> params = new HashMap<>(request);
        params.remove("operation");
        params.remove("userId");
        
        Map<String, Object> response = orientationService.processClassicQuery(operation, userId, params);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Şikayet tipleri listesi
     * @return Şikayet tipleri
     */
    @GetMapping("/complaint-types")
    public ResponseEntity<Map<String, Object>> getComplaintTypes() {
        Map<String, Object> response = new HashMap<>();
        response.put("complaintTypes", orientationService.getComplaintTypes());
        return ResponseEntity.ok(response);
    }
} 