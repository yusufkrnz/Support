package com.Destek.Support.Core.dto;

import com.Destek.Support.Core.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Müşteri bilgilerini taşıyan DTO sınıfı
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private Long id;
    private String username;
    private String email;
    private String password; // Şifre değiştirme işlemlerinde kullanılır
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
    
    // Müşteriye özgü alanlar burada eklenebilir
    private Integer loyaltyPoints; // Sadakat puanları
    private String customerType; // Bireysel, Kurumsal, vb.
    private LocalDate registrationDate; // Kayıt tarihi
    private String preferredContactMethod; // Tercih edilen iletişim yöntemi
    private Boolean newsletterSubscription; // Bülten aboneliği
    
    /**
     * Customer entity'sini DTO'ya dönüştürür
     * @param customer Customer entity
     * @return CustomerDTO
     */
    public static CustomerDTO fromEntity(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setUsername(customer.getUsername());
        dto.setEmail(customer.getEmail());
        dto.setFullName(customer.getFullName());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setName(customer.getName());
        
        if (customer.getCompany() != null) {
            dto.setCompanyId(customer.getCompany().getId());
        }
        
        dto.setActive(customer.isActive());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());
        dto.setLastLogin(customer.getLastLogin());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setCountry(customer.getCountry());
        dto.setPostalCode(customer.getPostalCode());
        
        // Müşteriye özgü alanlar
        dto.setLoyaltyPoints(customer.getLoyaltyPoints());
        dto.setCustomerType(customer.getCustomerType());
        dto.setRegistrationDate(customer.getRegistrationDate());
        dto.setPreferredContactMethod(customer.getPreferredContactMethod());
        dto.setNewsletterSubscription(customer.getNewsletterSubscription());
        
        return dto;
    }
    
    /**
     * DTO'dan Customer entity'si oluşturur
     * @param dto CustomerDTO
     * @return Customer
     */
    public static Customer toEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setUsername(dto.getUsername());
        customer.setEmail(dto.getEmail());
        
        // Şifre sadece değiştirme işlemlerinde doldurulur
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            customer.setPassword(dto.getPassword());
        }
        
        customer.setFullName(dto.getFullName());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setName(dto.getName());
        customer.setActive(dto.isActive());
        customer.setAddress(dto.getAddress());
        customer.setCity(dto.getCity());
        customer.setCountry(dto.getCountry());
        customer.setPostalCode(dto.getPostalCode());
        
        // Müşteriye özgü alanlar
        customer.setLoyaltyPoints(dto.getLoyaltyPoints());
        customer.setCustomerType(dto.getCustomerType());
        customer.setRegistrationDate(dto.getRegistrationDate());
        customer.setPreferredContactMethod(dto.getPreferredContactMethod());
        customer.setNewsletterSubscription(dto.getNewsletterSubscription());
        
        return customer;
    }
} 