package com.Destek.Support.Core.entity.enums;

/**
 * Destek talebi öncelik seviyelerini tanımlayan enum
 */
public enum TicketPriority {
    LOW("Düşük"),
    MEDIUM("Orta"),
    HIGH("Yüksek"),
    URGENT("Acil");
    
    private final String displayName;
    
    TicketPriority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
} 