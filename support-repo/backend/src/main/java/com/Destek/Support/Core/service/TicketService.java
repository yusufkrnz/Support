package com.Destek.Support.Core.service;

import com.Destek.Support.Core.entity.SupportTicket;

import java.util.List;

public interface TicketService {
    SupportTicket findById(Long id);
    List<SupportTicket> findByUserId(Long userId);
    SupportTicket createTicket(SupportTicket ticket);
    SupportTicket updateTicket(SupportTicket ticket);
    void deleteTicket(Long id);
} 