package com.Destek.Support.Core.entity;

import com.Destek.Support.Core.entity.enums.TicketPriority;
import com.Destek.Support.Core.entity.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String status;

    private String priority;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
    
    // gemini puan title ı da eklenecek  ve bunun için diğer alt sistemleri kurgulamak lazım 

    // Enum dönüşüm metodları
    @Transient
    public TicketStatus getTicketStatus() {
        return TicketStatus.valueOf(status);
    }

    public void setTicketStatus(TicketStatus ticketStatus) {
        this.status = ticketStatus.name();
    }

    @Transient
    public TicketPriority getTicketPriority() {
        return priority != null ? TicketPriority.valueOf(priority) : null;
    }

    public void setTicketPriority(TicketPriority ticketPriority) {
        this.priority = ticketPriority != null ? ticketPriority.name() : null;
    }

    // Talep durumunu güncelleme metodu
    public void updateStatus(TicketStatus newStatus) {
        this.status = newStatus.name();
        this.updatedAt = LocalDateTime.now();
        
        if (newStatus == TicketStatus.CLOSED || newStatus == TicketStatus.RESOLVED) {
            this.closedAt = LocalDateTime.now();
        }
    }
} 