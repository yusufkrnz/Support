package com.Destek.Support.model;

public enum ChatbotOption {
    PRODUCT_DETAILS(1, "Ürün Detayları"),
    ORDER_CANCEL(2, "Sipariş İptali"),
    SHIPPING_TRACK(3, "Kargo Takibi"),
    RETURN_PROCESS(4, "İade İşlemleri"),
    TECHNICAL_SUPPORT(5, "Teknik Destek"),
    PRODUCT_COMPLAINT(6, "Ürün Şikayeti"),
    SPEAK_REPRESENTATIVE(7, "Temsilci ile Görüşme");

    private final int code;
    private final String description;

    ChatbotOption(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static ChatbotOption fromCode(int code) {
        for (ChatbotOption option : ChatbotOption.values()) {
            if (option.getCode() == code) {
                return option;
            }
        }
        throw new IllegalArgumentException("Invalid option code: " + code);
    }
} 