package com.Destek.Support.API.exception;

import org.springframework.http.HttpStatus;

/**
 * API servisleri ile iletişimde oluşabilecek hatalar için özel exception sınıfı
 */
public class ApiServiceException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    
    private final HttpStatus status;
    private final String errorCode;
    
    public ApiServiceException(String message) {
        super(message);
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
        this.errorCode = "API_SERVICE_ERROR";
    }
    
    public ApiServiceException(String message, Throwable cause) {
        super(message, cause);
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
        this.errorCode = "API_SERVICE_ERROR";
    }
    
    public ApiServiceException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.errorCode = "API_SERVICE_ERROR";
    }
    
    public ApiServiceException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
    
    public HttpStatus getStatus() {
        return status;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
} 