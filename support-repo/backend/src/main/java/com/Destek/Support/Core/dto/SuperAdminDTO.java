package com.Destek.Support.Core.dto;

import com.Destek.Support.Core.entity.SuperAdmin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * SuperAdmin bilgilerini taşıyan DTO sınıfı
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private String name;
    private Long companyId;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
    private String address;
    private String city;
    private String country;
    private String postalCode;
    
    // SuperAdmin'e özgü alanlar
    private Boolean hasFullAccess;
    private String securityLevel;
    private String systemPermissions; // Sistem seviyesi izinler
    private LocalDateTime lastSystemConfigUpdate; // Son sistem konfigürasyonu güncelleme zamanı
    
    /**
     * SuperAdmin entity'sini DTO'ya dönüştürür
     * @param superAdmin SuperAdmin entity
     * @return SuperAdminDTO
     */
    public static SuperAdminDTO fromEntity(SuperAdmin superAdmin) {
        SuperAdminDTO dto = new SuperAdminDTO();
        dto.setId(superAdmin.getId());
        dto.setUsername(superAdmin.getUsername());
        dto.setEmail(superAdmin.getEmail());
        dto.setFullName(superAdmin.getFullName());
        dto.setPhoneNumber(superAdmin.getPhoneNumber());
        dto.setName(superAdmin.getName());
        
        if (superAdmin.getCompany() != null) {
            dto.setCompanyId(superAdmin.getCompany().getId());
        }
        
        dto.setActive(superAdmin.isActive());
        dto.setCreatedAt(superAdmin.getCreatedAt());
        dto.setUpdatedAt(superAdmin.getUpdatedAt());
        dto.setLastLogin(superAdmin.getLastLogin());
        dto.setAddress(superAdmin.getAddress());
        dto.setCity(superAdmin.getCity());
        dto.setCountry(superAdmin.getCountry());
        dto.setPostalCode(superAdmin.getPostalCode());
        
        // SuperAdmin'e özgü alanlar
        dto.setHasFullAccess(superAdmin.getHasFullAccess());
        dto.setSecurityLevel(superAdmin.getSecurityLevel());
        
        // Şimdilik gerçek değerler yok, bu alanlar entity'ye eklenebilir
        dto.setSystemPermissions(superAdmin.getPermissions());
        dto.setLastSystemConfigUpdate(LocalDateTime.now());
        
        return dto;
    }
    
    /**
     * DTO'dan SuperAdmin entity'si oluşturur
     * @param dto SuperAdminDTO
     * @return SuperAdmin
     */
    public static SuperAdmin toEntity(SuperAdminDTO dto) {
        SuperAdmin superAdmin = new SuperAdmin();
        superAdmin.setId(dto.getId());
        superAdmin.setUsername(dto.getUsername());
        superAdmin.setEmail(dto.getEmail());
        
        // Şifre sadece değiştirme işlemlerinde doldurulur
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            superAdmin.setPassword(dto.getPassword());
        }
        
        superAdmin.setFullName(dto.getFullName());
        superAdmin.setPhoneNumber(dto.getPhoneNumber());
        superAdmin.setName(dto.getName());
        superAdmin.setActive(dto.isActive());
        superAdmin.setAddress(dto.getAddress());
        superAdmin.setCity(dto.getCity());
        superAdmin.setCountry(dto.getCountry());
        superAdmin.setPostalCode(dto.getPostalCode());
        
        // SuperAdmin'e özgü alanlar
        superAdmin.setHasFullAccess(dto.getHasFullAccess());
        superAdmin.setSecurityLevel(dto.getSecurityLevel());
        superAdmin.setPermissions(dto.getSystemPermissions());
        
        return superAdmin;
    }
} 