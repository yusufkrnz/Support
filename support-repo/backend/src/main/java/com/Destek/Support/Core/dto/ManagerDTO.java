package com.Destek.Support.Core.dto;

import com.Destek.Support.Core.entity.Manager;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Müşteri temsilcisi bilgilerini taşıyan DTO sınıfı
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManagerDTO {
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
    
    // Manager'a özgü alanlar
    private String department;
    private String specialization;
    private Integer ticketCapacity;
    private Integer activeTickets; // Şu anda atanmış aktif destek bileti sayısı
    private Double responseRate; // Cevaplama oranı/hızı
    private String managerStatus; // Müsait, Meşgul, Çevrimdışı vb.
    
    /**
     * Manager entity'sini DTO'ya dönüştürür
     * @param manager Manager entity
     * @return ManagerDTO
     */
    public static ManagerDTO fromEntity(Manager manager) {
        ManagerDTO dto = new ManagerDTO();
        dto.setId(manager.getId());
        dto.setUsername(manager.getUsername());
        dto.setEmail(manager.getEmail());
        dto.setFullName(manager.getFullName());
        dto.setPhoneNumber(manager.getPhoneNumber());
        dto.setName(manager.getName());
        
        if (manager.getCompany() != null) {
            dto.setCompanyId(manager.getCompany().getId());
        }
        
        dto.setActive(manager.isActive());
        dto.setCreatedAt(manager.getCreatedAt());
        dto.setUpdatedAt(manager.getUpdatedAt());
        dto.setLastLogin(manager.getLastLogin());
        dto.setAddress(manager.getAddress());
        dto.setCity(manager.getCity());
        dto.setCountry(manager.getCountry());
        dto.setPostalCode(manager.getPostalCode());
        
        // Manager'a özgü alanlar
        dto.setDepartment(manager.getDepartment());
        dto.setSpecialization(manager.getSpecialization());
        dto.setTicketCapacity(manager.getTicketCapacity());
        
        // Şimdilik gerçek değerler yok, bu alanlar entity'ye eklenebilir
        dto.setActiveTickets(0);
        dto.setResponseRate(0.0);
        dto.setManagerStatus("Çevrimiçi");
        
        return dto;
    }
    
    /**
     * DTO'dan Manager entity'si oluşturur
     * @param dto ManagerDTO
     * @return Manager
     */
    public static Manager toEntity(ManagerDTO dto) {
        Manager manager = new Manager();
        manager.setId(dto.getId());
        manager.setUsername(dto.getUsername());
        manager.setEmail(dto.getEmail());
        
        // Şifre sadece değiştirme işlemlerinde doldurulur
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            manager.setPassword(dto.getPassword());
        }
        
        manager.setFullName(dto.getFullName());
        manager.setPhoneNumber(dto.getPhoneNumber());
        manager.setName(dto.getName());
        manager.setActive(dto.isActive());
        manager.setAddress(dto.getAddress());
        manager.setCity(dto.getCity());
        manager.setCountry(dto.getCountry());
        manager.setPostalCode(dto.getPostalCode());
        
        // Manager'a özgü alanlar
        manager.setDepartment(dto.getDepartment());
        manager.setSpecialization(dto.getSpecialization());
        manager.setTicketCapacity(dto.getTicketCapacity());
        
        return manager;
    }
} 