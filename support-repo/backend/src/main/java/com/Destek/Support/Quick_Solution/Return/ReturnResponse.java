package com.Destek.Support.Quick_Solution.Return;

import lombok.Data;
import java.util.Map;

@Data
public class ReturnResponse {
    private boolean success;
    private boolean isValid;
    private boolean acceptable;
    private String message;
    private double score;
    private String returnId;
    private Map<String, Object> additionalInfo;
    
    // Constructors
    public ReturnResponse() {
    }
    
    public ReturnResponse(boolean isValid, String message, double score) {
        this.isValid = isValid;
        this.message = message;
        this.score = score;
    }
    
    public ReturnResponse(boolean success, boolean isValid, boolean acceptable, String message) {
        this.success = success;
        this.isValid = isValid;
        this.acceptable = acceptable;
        this.message = message;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public boolean isValid() {
        return isValid;
    }
    
    public void setValid(boolean valid) {
        this.isValid = valid;
    }
    
    public boolean isAcceptable() {
        return acceptable;
    }
    
    public void setAcceptable(boolean acceptable) {
        this.acceptable = acceptable;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public double getScore() {
        return score;
    }
    
    public void setScore(double score) {
        this.score = score;
    }
    
    public String getReturnId() {
        return returnId;
    }
    
    public void setReturnId(String returnId) {
        this.returnId = returnId;
    }
    
    public Map<String, Object> getAdditionalInfo() {
        return additionalInfo;
    }
    
    public void setAdditionalInfo(Map<String, Object> additionalInfo) {
        this.additionalInfo = additionalInfo;
    }
} 