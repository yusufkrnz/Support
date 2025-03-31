package com.Destek.Support.controller;

import com.Destek.Support.model.Message;
import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.model.User;
import com.Destek.Support.model.RequestStatus;
import com.Destek.Support.service.MessageService;
import com.Destek.Support.service.SupportRequestService;
import com.Destek.Support.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class SupportRequestController {

    @Autowired
    private SupportRequestService supportRequestService;

    @Autowired
    private UserService userService;

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<SupportRequest> createRequest(
            @RequestParam Long customerId,
            @RequestParam String title,
            @RequestParam String description) {
        
        User customer = userService.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        SupportRequest request = new SupportRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setCustomer(customer);
        request.setStatus(RequestStatus.OPEN);

        return ResponseEntity.ok(supportRequestService.save(request));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<SupportRequest>> getCustomerRequests(@PathVariable Long customerId) {
        return ResponseEntity.ok(supportRequestService.findByCustomerId(customerId));
    }

    @GetMapping("/assigned/{assignedToId}")
    public ResponseEntity<List<SupportRequest>> getAssignedRequests(@PathVariable Long assignedToId) {
        return ResponseEntity.ok(supportRequestService.findByAssignedToId(assignedToId));
    }

    @PostMapping("/{requestId}/message")
    public ResponseEntity<Message> addMessage(
            @PathVariable Long requestId,
            @RequestParam Long senderId,
            @RequestParam String content) {
        
        SupportRequest request = supportRequestService.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Support request not found"));
        
        User sender = userService.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = new Message();
        message.setContent(content);
        message.setRequest(request);
        message.setSender(sender);

        return ResponseEntity.ok(messageService.save(message));
    }

    @GetMapping("/{requestId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long requestId) {
        return ResponseEntity.ok(messageService.findByRequestId(requestId));
    }

    @PutMapping("/{requestId}/assign")
    public ResponseEntity<SupportRequest> assignRequest(
            @PathVariable Long requestId,
            @RequestParam Long assignedToId) {
        
        SupportRequest request = supportRequestService.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Support request not found"));
        
        User assignedTo = userService.findById(assignedToId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        request.setAssignedTo(assignedTo);
        request.setStatus(RequestStatus.IN_PROGRESS);

        return ResponseEntity.ok(supportRequestService.save(request));
    }

    @PutMapping("/{requestId}/close")
    public ResponseEntity<SupportRequest> closeRequest(@PathVariable Long requestId) {
        SupportRequest request = supportRequestService.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        request.setStatus(RequestStatus.CLOSED);
        request.setClosedAt(LocalDateTime.now());

        return ResponseEntity.ok(supportRequestService.save(request));
    }
} 