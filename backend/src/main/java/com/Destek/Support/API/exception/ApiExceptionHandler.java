package com.Destek.Support.API.exception;

import com.Destek.Support.Core.exception.ApiError;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * API servisleri için özel exception handler
 */
@ControllerAdvice(basePackages = "com.Destek.Support.API")
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    /**
     * API servis hatalarını yakalar ve uygun yanıt döndürür
     * @param ex Yakalanan exception
     * @return Hata içeren response entity
     */
    @ExceptionHandler(ApiServiceException.class)
    public ResponseEntity<ApiError> handleApiServiceException(ApiServiceException ex) {
        log.error("API servisi hatası", ex);
        
        ApiError apiError = new ApiError(
                ex.getStatus(),
                "API servisi hatası",
                ex);
        
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }
} 