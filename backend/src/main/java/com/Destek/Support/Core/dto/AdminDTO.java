package com.Destek.Support.Core.dto;

import com.Destek.Support.Core.entity.Admin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Admin bilgilerini taşıyan DTO sınıfı
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {
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
    
    // Admin'e özgü alanlar
    private String adminLevel;
    private String adminArea;
    private String adminPermissions; // Özel izinler
    private String managedDepartments; // Yönettiği departmanlar
    
    /**
     * Admin entity'sini DTO'ya dönüştürür
     * @param admin Admin entity
     * @return AdminDTO
     */
    public static AdminDTO fromEntity(Admin admin) {
        AdminDTO dto = new AdminDTO();
        dto.setId(admin.getId());
        dto.setUsername(admin.getUsername());
        dto.setEmail(admin.getEmail());
        dto.setFullName(admin.getFullName());
        dto.setPhoneNumber(admin.getPhoneNumber());
        dto.setName(admin.getName());
        
        if (admin.getCompany() != null) {
            dto.setCompanyId(admin.getCompany().getId());
        }
        
        dto.setActive(admin.isActive());
        dto.setCreatedAt(admin.getCreatedAt());
        dto.setUpdatedAt(admin.getUpdatedAt());
        dto.setLastLogin(admin.getLastLogin());
        dto.setAddress(admin.getAddress());
        dto.setCity(admin.getCity());
        dto.setCountry(admin.getCountry());
        dto.setPostalCode(admin.getPostalCode());
        
        // Admin'e özgü alanlar
        dto.setAdminLevel(admin.getAdminLevel());
        dto.setAdminArea(admin.getAdminArea());
        
        // Şimdilik gerçek değerler yok, bu alanlar entity'ye eklenebilir
        dto.setAdminPermissions(admin.getPermissions());
        dto.setManagedDepartments("Tüm Departmanlar");
        
        return dto;
    }
    
    /**
     * DTO'dan Admin entity'si oluşturur
     * @param dto AdminDTO
     * @return Admin
     */
    public static Admin toEntity(AdminDTO dto) {
        Admin admin = new Admin();
        admin.setId(dto.getId());
        admin.setUsername(dto.getUsername());
        admin.setEmail(dto.getEmail());
        
        // Şifre sadece değiştirme işlemlerinde doldurulur
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            admin.setPassword(dto.getPassword());
        }
        
        admin.setFullName(dto.getFullName());
        admin.setPhoneNumber(dto.getPhoneNumber());
        admin.setName(dto.getName());
        admin.setActive(dto.isActive());
        admin.setAddress(dto.getAddress());
        admin.setCity(dto.getCity());
        admin.setCountry(dto.getCountry());
        admin.setPostalCode(dto.getPostalCode());
        
        // Admin'e özgü alanlar
        admin.setAdminLevel(dto.getAdminLevel());
        admin.setAdminArea(dto.getAdminArea());
        admin.setPermissions(dto.getAdminPermissions());
        
        return admin;
    }
} 