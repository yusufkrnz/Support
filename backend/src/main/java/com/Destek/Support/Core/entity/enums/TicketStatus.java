package com.Destek.Support.Core.entity.enums;

/**
 * Destek talep durumlarını tanımlayan enum
 */
public enum TicketStatus {
    OPEN("Açık"),
    IN_PROGRESS("İşlemde"),
    WAITING("Beklemede"),
    RESOLVED("Çözüldü"),
    CLOSED("Kapatıldı");



    private final String displayName;
    
    TicketStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
} 