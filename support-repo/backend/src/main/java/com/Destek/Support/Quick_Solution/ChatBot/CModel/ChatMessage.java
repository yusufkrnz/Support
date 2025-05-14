package com.Destek.Support.Quick_Solution.ChatBot.CModel;

import java.time.LocalDateTime;

/**
 * Sohbet mesajı modeli
 */
public class ChatMessage {
    
    private Long id;
    private String sessionId;
    private String content;
    private String userId;
    private MessageSender sender;
    private LocalDateTime timestamp;
    private MessageStatus status;
    private String label;
    
    public enum MessageSender {
        USER,       // Kullanıcıdan gelen mesaj
        SYSTEM,     // Sistemden gelen yanıt
        BOT,        // Bot tarafından otomatik üretilen yanıt
        AGENT       // İnsan müşteri temsilcisi yanıtı
    }
    
    public enum MessageStatus {
        SENT,       // Gönderildi
        DELIVERED,  // İletildi
        READ,       // Okundu
        PROCESSED,  // İşlendi
        FAILED      // Başarısız
    }
    
    // Constructors
    
    public ChatMessage() {
        this.timestamp = LocalDateTime.now();
        this.status = MessageStatus.SENT;
    }
    
    public ChatMessage(String content, MessageSender sender) {
        this();
        this.content = content;
        this.sender = sender;
    }
    
    public ChatMessage(String sessionId, String content, String userId, MessageSender sender) {
        this(content, sender);
        this.sessionId = sessionId;
        this.userId = userId;
    }
    
    // Getters and Setters
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public MessageSender getSender() {
        return sender;
    }
    
    public void setSender(MessageSender sender) {
        this.sender = sender;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public MessageStatus getStatus() {
        return status;
    }
    
    public void setStatus(MessageStatus status) {
        this.status = status;
    }
    
    public String getLabel() {
        return label;
    }
    
    public void setLabel(String label) {
        this.label = label;
    }
    
    @Override
    public String toString() {
        return "ChatMessage{" +
                "id=" + id +
                ", sessionId='" + sessionId + '\'' +
                ", content='" + content + '\'' +
                ", userId='" + userId + '\'' +
                ", sender=" + sender +
                ", timestamp=" + timestamp +
                ", status=" + status +
                ", label='" + label + '\'' +
                '}';
    }
} 