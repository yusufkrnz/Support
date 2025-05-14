package com.Destek.Support.Core.dto;

import com.Destek.Support.Core.entity.ReturnRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * İade talebi için DTO sınıfı
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequestDTO {
    private Long id;
    private Long userId;
    private String username;
    private String orderNumber;
    private String productId;
    private String productName;
    private String returnReason;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;
    private String statusDisplayValue;
    private Integer aiScore;
    private String aiEvaluation;
    private Boolean isBypassed;
    private String processedBy;
    private LocalDateTime processedAt;
    
    /**
     * Entity'den DTO oluşturur
     * @param returnRequest İade talebi entity
     * @return DTO nesnesi
     */
    public static ReturnRequestDTO fromEntity(ReturnRequest returnRequest) {
        ReturnRequestDTO dto = new ReturnRequestDTO();
        dto.setId(returnRequest.getId());
        
        if (returnRequest.getUser() != null) {
            dto.setUserId(returnRequest.getUser().getId());
            dto.setUsername(returnRequest.getUser().getUsername());
        }
        
        dto.setOrderNumber(returnRequest.getOrderNumber());
        dto.setProductId(returnRequest.getProductId());
        dto.setProductName(returnRequest.getProductName());
        dto.setReturnReason(returnRequest.getReturnReason());
        dto.setDescription(returnRequest.getDescription());
        dto.setImageUrl(returnRequest.getImageUrl());
        dto.setCreatedAt(returnRequest.getCreatedAt());
        dto.setUpdatedAt(returnRequest.getUpdatedAt());
        
        if (returnRequest.getStatus() != null) {
            dto.setStatus(returnRequest.getStatus().name());
            dto.setStatusDisplayValue(returnRequest.getStatus().getDisplayValue());
        }
        
        dto.setAiScore(returnRequest.getAiScore());
        dto.setAiEvaluation(returnRequest.getAiEvaluation());
        dto.setIsBypassed(returnRequest.getIsBypassed());
        dto.setProcessedBy(returnRequest.getProcessedBy());
        dto.setProcessedAt(returnRequest.getProcessedAt());
        
        return dto;
    }
    
    /**
     * Yeni iade talebi oluşturmak için girdi DTO'su
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateReturnRequestDTO {
        private String orderNumber;
        private String productId;
        private String productName;
        private String returnReason;
        private String description;
        // Resim MultipartFile olarak controller seviyesinde alınır
    }
    
    /**
     * İade durumu güncelleme için DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusDTO {
        private Long id;
        private String status;
        private String processedBy;
    }
    
    /**
     * İade bypass için DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BypassDTO {
        private Long id;
        private String processedBy;
        private String bypassReason;
    }
} 