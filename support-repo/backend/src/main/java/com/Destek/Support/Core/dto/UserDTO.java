package com.Destek.Support.Core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String password;
    private String companyCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Added missing fields
    private String username;
    private String fullName;
} 