package com.Destek.Support.Core.controller;

import com.Destek.Support.Core.dto.ReturnRequestDTO;
import com.Destek.Support.Core.entity.ReturnRequest;
import com.Destek.Support.Core.entity.User;
import com.Destek.Support.Core.service.ReturnService;
import com.Destek.Support.Core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * İade talepleri için controller sınıfı
 */
@RestController
@RequestMapping("/api/returns")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReturnController {

    private static final Logger logger = Logger.getLogger(ReturnController.class.getName());

    @Autowired
    private ReturnService returnService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Yeni iade talebi oluşturur
     */
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReturnRequest(
            @RequestPart("orderNumber") String orderNumber,
            @RequestPart("productId") String productId,
            @RequestPart("productName") String productName,
            @RequestPart("returnReason") String returnReason,
            @RequestPart("description") String description,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        
        logger.info("İade talebi oluşturma isteği alındı - Sipariş: " + orderNumber + ", Ürün: " + productName);
        try {
            // Kullanıcı bilgilerini al
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warning("İade talebi oluşturma başarısız - Kullanıcı oturumu açık değil");
                return new ResponseEntity<>("Oturum açık değil", HttpStatus.UNAUTHORIZED);
            }
            
            User user = (User) authentication.getPrincipal();
            logger.info("İade talebi oluşturuluyor - Kullanıcı: " + user.getUsername());
            
            // İade talebi oluştur
            ReturnRequest returnRequest = returnService.createReturnRequest(
                    user, orderNumber, productId, productName, returnReason, description, image);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", ReturnRequestDTO.fromEntity(returnRequest));
            
            // AI skoru düşükse uyarı ekle
            if (returnRequest.getAiScore() <= 3) {
                logger.info("İade talebi düşük AI skoru aldı: " + returnRequest.getAiScore() + " - Uyarı eklenecek");
                response.put("warning", "İade talebiniz düşük puan aldı. İnceleme sonrası işleme alınacaktır.");
            }
            
            logger.info("İade talebi başarıyla oluşturuldu - ID: " + returnRequest.getId() + ", AI Skor: " + returnRequest.getAiScore());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "İade talebi oluşturulurken hata: " + e.getMessage(), e);
            return new ResponseEntity<>("İade talebi oluşturulurken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Kullanıcının iade taleplerini listeler
     */
    @GetMapping("/my-returns")
    public ResponseEntity<?> getMyReturnRequests() {
        logger.info("Kullanıcı iade talepleri listesi istendi");
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warning("İade talepleri listeleme başarısız - Kullanıcı oturumu açık değil");
                return new ResponseEntity<>("Oturum açık değil", HttpStatus.UNAUTHORIZED);
            }
            
            User user = (User) authentication.getPrincipal();
            logger.info("Kullanıcının iade talepleri getiriliyor - Kullanıcı: " + user.getUsername());
            List<ReturnRequest> returnRequests = returnService.getUserReturnRequests(user);
            
            List<ReturnRequestDTO> returnRequestDTOs = returnRequests.stream()
                    .map(ReturnRequestDTO::fromEntity)
                    .collect(Collectors.toList());
            
            logger.info(user.getUsername() + " kullanıcısı için " + returnRequestDTOs.size() + " iade talebi döndürülüyor");
            return new ResponseEntity<>(returnRequestDTOs, HttpStatus.OK);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "İade talepleri listelenirken hata: " + e.getMessage(), e);
            return new ResponseEntity<>("İade talepleri listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * İade talebini ID ile getirir
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReturnRequestById(@PathVariable Long id) {
        logger.info("İade talebi detayları istendi - ID: " + id);
        try {
            Optional<ReturnRequest> returnRequestOpt = returnService.getReturnRequestById(id);
            if (returnRequestOpt.isPresent()) {
                logger.info("İade talebi bulundu ve döndürülüyor - ID: " + id);
                return new ResponseEntity<>(ReturnRequestDTO.fromEntity(returnRequestOpt.get()), HttpStatus.OK);
            } else {
                logger.warning("İstenilen iade talebi bulunamadı - ID: " + id);
                return new ResponseEntity<>("İade talebi bulunamadı: " + id, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "İade talebi alınırken hata: " + e.getMessage(), e);
            return new ResponseEntity<>("İade talebi alınırken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * İade talebini bypass et (AI skoru düşük olsa bile işleme al)
     */
    @PostMapping("/bypass")
    public ResponseEntity<?> bypassReturnRequest(@RequestBody ReturnRequestDTO.BypassDTO bypassDTO) {
        logger.info("İade talebi bypass isteği alındı - ID: " + bypassDTO.getId() + ", İşleyen: " + bypassDTO.getProcessedBy());
        try {
            ReturnRequest returnRequest = returnService.bypassReturnRequest(bypassDTO.getId(), bypassDTO.getProcessedBy());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "İade talebi başarıyla bypass edildi");
            response.put("data", ReturnRequestDTO.fromEntity(returnRequest));
            
            logger.info("İade talebi başarıyla bypass edildi - ID: " + bypassDTO.getId() + ", AI Skoru: " + returnRequest.getAiScore());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "İade talebi bypass edilirken hata: " + e.getMessage(), e);
            return new ResponseEntity<>("İade talebi bypass edilirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * İade talebi durumunu günceller
     */
    @PostMapping("/update-status")
    public ResponseEntity<?> updateReturnRequestStatus(@RequestBody ReturnRequestDTO.UpdateStatusDTO updateDTO) {
        logger.info("İade talebi durum güncelleme isteği alındı - ID: " + updateDTO.getId() + 
                  ", Durum: " + updateDTO.getStatus() + ", İşleyen: " + updateDTO.getProcessedBy());
        try {
            ReturnRequest.ReturnStatus status = ReturnRequest.ReturnStatus.valueOf(updateDTO.getStatus());
            
            ReturnRequest returnRequest = returnService.updateReturnRequestStatus(
                    updateDTO.getId(), status, updateDTO.getProcessedBy());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "İade talebi durumu başarıyla güncellendi");
            response.put("data", ReturnRequestDTO.fromEntity(returnRequest));
            
            logger.info("İade talebi durumu başarıyla güncellendi - ID: " + updateDTO.getId() + 
                       ", Yeni Durum: " + status);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "İade talebi durumu güncellenirken hata: " + e.getMessage(), e);
            return new ResponseEntity<>("İade talebi durumu güncellenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * İnceleme bekleyen (AI skoru düşük) iade taleplerini listeler (yöneticiler için)
     */
    @GetMapping("/pending-review")
    public ResponseEntity<?> getPendingReviewReturnRequests() {
        logger.info("İnceleme bekleyen iade talepleri listesi istendi");
        try {
            List<ReturnRequest> pendingReviewRequests = returnService.getReturnRequestsByStatus(ReturnRequest.ReturnStatus.PENDING_REVIEW);
            
            List<ReturnRequestDTO> returnRequestDTOs = pendingReviewRequests.stream()
                    .map(ReturnRequestDTO::fromEntity)
                    .collect(Collectors.toList());
            
            logger.info("İnceleme bekleyen " + returnRequestDTOs.size() + " iade talebi döndürülüyor");
            return new ResponseEntity<>(returnRequestDTOs, HttpStatus.OK);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "İnceleme bekleyen iade talepleri listelenirken hata: " + e.getMessage(), e);
            return new ResponseEntity<>("İade talepleri listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Düşük AI skorlu iade taleplerini listeler
     */
    @GetMapping("/low-score")
    public ResponseEntity<?> getLowScoreReturnRequests() {
        logger.info("Düşük AI skorlu iade talepleri listesi istendi");
        try {
            List<ReturnRequest> lowScoreRequests = returnService.getLowScoreReturnRequests();
            
            List<ReturnRequestDTO> returnRequestDTOs = lowScoreRequests.stream()
                    .map(ReturnRequestDTO::fromEntity)
                    .collect(Collectors.toList());
            
            logger.info("Düşük AI skorlu " + returnRequestDTOs.size() + " iade talebi döndürülüyor");
            return new ResponseEntity<>(returnRequestDTOs, HttpStatus.OK);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Düşük skorlu iade talepleri listelenirken hata: " + e.getMessage(), e);
            return new ResponseEntity<>("İade talepleri listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Bypass edilen iade taleplerini listeler
     */
    @GetMapping("/bypassed")
    public ResponseEntity<?> getBypassedReturnRequests() {
        logger.info("Bypass edilen iade talepleri listesi istendi");
        try {
            List<ReturnRequest> bypassedRequests = returnService.getBypassedReturnRequests();
            
            List<ReturnRequestDTO> returnRequestDTOs = bypassedRequests.stream()
                    .map(ReturnRequestDTO::fromEntity)
                    .collect(Collectors.toList());
            
            logger.info("Bypass edilmiş " + returnRequestDTOs.size() + " iade talebi döndürülüyor");
            return new ResponseEntity<>(returnRequestDTOs, HttpStatus.OK);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Bypass edilmiş iade talepleri listelenirken hata: " + e.getMessage(), e);
            return new ResponseEntity<>("İade talepleri listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 