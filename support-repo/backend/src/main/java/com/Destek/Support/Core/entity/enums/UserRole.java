package com.Destek.Support.Core.entity.enums;

/**
 * Kullanıcı rollerini tanımlayan enum
 */
public enum UserRole {
    ADMIN(1, "Yönetici"),
    CUSTOMER(2, "Müşteri"),
    MANAGER(3, "Müşteri Temsilcisi"),
    SUPER_ADMIN(4, "Süper Yönetici");
    
    private final int id;
    private final String displayName;
    
    UserRole(int id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }
    
    public int getId() {
        return id;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    /**
     * ID değerine göre UserRole enum değerini döndürür
     * @param id UserRole ID'si
     * @return UserRole enum değeri, eğer bulunamazsa null
     */
    public static UserRole getById(int id) {
        for (UserRole role : values()) {
            if (role.getId() == id) {
                return role;
            }
        }
        return null;
    }
} 