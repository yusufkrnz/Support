package com.Destek.Support.Core.entity;

import com.Destek.Support.Core.entity.enums.UserRole;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("4") // SUPER_ADMIN rolünün ID'si
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class SuperAdmin extends User {
    
    // SuperAdmin'e özgü alanlar
    private Boolean hasFullAccess;
    private String securityLevel;
    
    @Override
    public Integer getRoleId() {
        return UserRole.SUPER_ADMIN.getId();
    }
} 