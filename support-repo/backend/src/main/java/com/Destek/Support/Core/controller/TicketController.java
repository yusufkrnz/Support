package com.Destek.Support.Core.controller;

import com.Destek.Support.Core.entity.SupportTicket;
import com.Destek.Support.Core.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping("/{ticketId}")
    public ResponseEntity<?> getTicketById(@PathVariable Long ticketId) {
        try {
            SupportTicket ticket = ticketService.findById(ticketId);
            if (ticket == null) {
                return new ResponseEntity<>("Ticket not found", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(ticket, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving ticket: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTicketsByUserId(@PathVariable Long userId) {
        try {
            List<SupportTicket> tickets = ticketService.findByUserId(userId);
            return new ResponseEntity<>(tickets, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving tickets: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTicket(@RequestBody SupportTicket ticket) {
        try {
            SupportTicket createdTicket = ticketService.createTicket(ticket);
            return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating ticket: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{ticketId}")
    public ResponseEntity<?> updateTicket(@PathVariable Long ticketId, @RequestBody SupportTicket ticket) {
        try {
            ticket.setId(ticketId);
            SupportTicket updatedTicket = ticketService.updateTicket(ticket);
            return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating ticket: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{ticketId}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long ticketId) {
        try {
            ticketService.deleteTicket(ticketId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Ticket deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting ticket: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 