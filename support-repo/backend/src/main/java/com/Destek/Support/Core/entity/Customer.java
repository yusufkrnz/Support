package com.Destek.Support.Core.entity;

import com.Destek.Support.Core.entity.enums.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@DiscriminatorValue("2") // CUSTOMER rolünün ID'si
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Customer extends User {
    
    // Customer'a özgü alanlar
    @Column(name = "customer_type")
    private String customerType; // Bireysel, Kurumsal, vb.
    
    @Column(name = "loyalty_points")
    private Integer loyaltyPoints; // Sadakat puanları
    
    @Column(name = "registration_date")
    private LocalDate registrationDate; // Kayıt tarihi
    
    @Column(name = "preferred_contact_method")
    private String preferredContactMethod; // Tercih edilen iletişim yöntemi
    
    @Column(name = "newsletter_subscription")
    private Boolean newsletterSubscription; // Bülten aboneliği
    
    @Override
    public Integer getRoleId() {
        return UserRole.CUSTOMER.getId();
    }
} 