package com.Destek.Support.Core.service.impl;

import com.Destek.Support.Core.entity.SupportTicket;
import com.Destek.Support.Core.repository.SupportTicketRepository;
import com.Destek.Support.Core.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Override
    public SupportTicket findById(Long id) {
        return supportTicketRepository.findById(id).orElse(null);
    }

    @Override
    public List<SupportTicket> findByUserId(Long userId) {
        return supportTicketRepository.findByCustomerId(userId);
    }

    @Override
    public SupportTicket createTicket(SupportTicket ticket) {
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return supportTicketRepository.save(ticket);
    }

    @Override
    public SupportTicket updateTicket(SupportTicket ticket) {
        SupportTicket existingTicket = findById(ticket.getId());
        if (existingTicket == null) {
            throw new RuntimeException("Ticket not found");
        }
        
        // Update fields
        existingTicket.setTitle(ticket.getTitle());
        existingTicket.setDescription(ticket.getDescription());
        existingTicket.setStatus(ticket.getStatus());
        existingTicket.setPriority(ticket.getPriority());
        existingTicket.setUpdatedAt(LocalDateTime.now());
        
        return supportTicketRepository.save(existingTicket);
    }

    @Override
    public void deleteTicket(Long id) {
        SupportTicket ticket = findById(id);
        if (ticket == null) {
            throw new RuntimeException("Ticket not found");
        }
        supportTicketRepository.delete(ticket);
    }
} 