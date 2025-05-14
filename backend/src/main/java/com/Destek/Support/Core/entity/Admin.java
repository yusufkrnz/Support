package com.Destek.Support.Core.entity;

import com.Destek.Support.Core.entity.enums.UserRole;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("1") // ADMIN rolünün ID'si
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Admin extends User {
    
    // Admin'e özgü alanlar
    private String adminLevel;
    private String adminArea;
    
    @Override
    public Integer getRoleId() {
        return UserRole.ADMIN.getId();
    }
} 