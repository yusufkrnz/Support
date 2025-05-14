package com.Destek.Support.Core.repository;

import com.Destek.Support.Core.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByCustomerId(Long customerId);
    List<SupportTicket> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<SupportTicket> findByStatus(String status);
} 