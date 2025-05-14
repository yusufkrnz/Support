package com.Destek.Support.Core.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * İade talebi entity sınıfı
 */
@Entity
@Table(name = "return_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "order_number", nullable = false)
    private String orderNumber;
    
    @Column(name = "product_id", nullable = false)
    private String productId;
    
    @Column(name = "product_name", nullable = false)
    private String productName;
    
    @Column(name = "return_reason", nullable = false)
    private String returnReason;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ReturnStatus status;
    
    @Column(name = "ai_score")
    private Integer aiScore;
    
    @Column(name = "ai_evaluation", columnDefinition = "TEXT")
    private String aiEvaluation;
    
    @Column(name = "is_bypassed")
    private Boolean isBypassed = false;
    
    @Column(name = "processed_by")
    private String processedBy;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    /**
     * İade talebi durumu
     */
    public enum ReturnStatus {
        PENDING("Beklemede"),
        APPROVED("Onaylandı"),
        REJECTED("Reddedildi"),
        PENDING_REVIEW("İnceleme Bekliyor"), // AI skoru düşük olduğunda
        IN_PROCESS("İşlemde");
        
        private final String displayValue;
        
        ReturnStatus(String displayValue) {
            this.displayValue = displayValue;
        }
        
        public String getDisplayValue() {
            return displayValue;
        }
    }
    
    // Manuel getter ve setter metodları
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getReturnReason() {
        return returnReason;
    }

    public void setReturnReason(String returnReason) {
        this.returnReason = returnReason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public ReturnStatus getStatus() {
        return status;
    }

    public void setStatus(ReturnStatus status) {
        this.status = status;
    }

    public Integer getAiScore() {
        return aiScore;
    }

    public void setAiScore(Integer aiScore) {
        this.aiScore = aiScore;
    }

    public String getAiEvaluation() {
        return aiEvaluation;
    }

    public void setAiEvaluation(String aiEvaluation) {
        this.aiEvaluation = aiEvaluation;
    }

    public Boolean getIsBypassed() {
        return isBypassed;
    }

    public void setIsBypassed(Boolean isBypassed) {
        this.isBypassed = isBypassed;
    }

    public String getProcessedBy() {
        return processedBy;
    }

    public void setProcessedBy(String processedBy) {
        this.processedBy = processedBy;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
} 