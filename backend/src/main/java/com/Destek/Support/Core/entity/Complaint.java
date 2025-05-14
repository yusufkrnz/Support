package com.Destek.Support.Core.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String unit; // Şikayet birimi (kasiyer, hizmet, ürün, vb.)

    @Column(length = 2000, nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private String status;

    @Column
    private String trackingId;

    @Column
    private Integer estimatedResponseHours;

    @ElementCollection
    @CollectionTable(name = "complaint_tags", joinColumns = @JoinColumn(name = "complaint_id"))
    @Column(name = "tag")
    private Set<String> aiTags = new HashSet<>();

    @Column
    private Integer aiPriority; // 1-Düşük, 2-Orta, 3-Yüksek

    @Column
    private Boolean isResolved;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = "RECEIVED"; // Varsayılan durum: Alındı
        isResolved = false;
        
        // Takip numarası oluştur
        if (trackingId == null) {
            String companyPrefix = companyName.substring(0, Math.min(3, companyName.length())).toUpperCase();
            trackingId = companyPrefix + "-" + System.currentTimeMillis() % 100000;
        }
    }

    // Akıcı arayüz (Fluent API) metotları
    public Complaint withTitle(String title) {
        this.title = title;
        return this;
    }

    public Complaint withUnit(String unit) {
        this.unit = unit;
        return this;
    }

    public Complaint withDescription(String description) {
        this.description = description;
        return this;
    }

    public Complaint withUser(User user) {
        this.user = user;
        return this;
    }

    public Complaint withCompany(String companyName) {
        this.companyName = companyName;
        return this;
    }

    public Complaint withStatus(String status) {
        this.status = status;
        return this;
    }

    public Complaint withAiPriority(Integer priority) {
        this.aiPriority = priority;
        return this;
    }

    public Complaint withEstimatedResponseTime(Integer hours) {
        this.estimatedResponseHours = hours;
        return this;
    }

    public Complaint addAiTag(String tag) {
        if (aiTags == null) {
            aiTags = new HashSet<>();
        }
        aiTags.add(tag);
        return this;
    }

    public Complaint setResolved(Boolean resolved) {
        this.isResolved = resolved;
        if (resolved) {
            this.status = "RESOLVED";
        }
        return this;
    }
} 