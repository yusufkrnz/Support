package com.Destek.Support.Core.entity;

import com.Destek.Support.Core.entity.enums.UserRole;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("3") // MANAGER rolünün ID'si
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Manager extends User {
    
    // Manager'a özgü alanlar
    private String department;
    private String specialization;
    private Integer ticketCapacity; // Aynı anda kaç destek bileti alabileceği
    
    @Override
    public Integer getRoleId() {
        return UserRole.MANAGER.getId();
    }
} 