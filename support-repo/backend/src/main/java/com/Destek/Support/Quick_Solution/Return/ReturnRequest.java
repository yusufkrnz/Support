package com.Destek.Support.Quick_Solution.Return;

import lombok.Data;

@Data
public class ReturnRequest {
    private String userId;
    private String productId;
    private String returnReason;
    private String explanation;
    private String imageBase64;
    private String imageUrl;
    
    // Constructors
    public ReturnRequest() {
    }
    
    public ReturnRequest(String userId, String productId, String returnReason, String explanation, String imageBase64) {
        this.userId = userId;
        this.productId = productId;
        this.returnReason = returnReason;
        this.explanation = explanation;
        this.imageBase64 = imageBase64;
    }
    
    public ReturnRequest(String userId, String productId, String returnReason, String explanation, String imageBase64, String imageUrl) {
        this.userId = userId;
        this.productId = productId;
        this.returnReason = returnReason;
        this.explanation = explanation;
        this.imageBase64 = imageBase64;
        this.imageUrl = imageUrl;
    }
    
    // Getters and Setters
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getProductId() {
        return productId;
    }
    
    public void setProductId(String productId) {
        this.productId = productId;
    }
    
    public String getReturnReason() {
        return returnReason;
    }
    
    public void setReturnReason(String returnReason) {
        this.returnReason = returnReason;
    }
    
    public String getExplanation() {
        return explanation;
    }
    
    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
    
    public String getImageBase64() {
        return imageBase64;
    }
    
    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
} 