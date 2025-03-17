package com.Destek.Support.controller;

import com.Destek.Support.model.Message;
import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.model.User;
import com.Destek.Support.repository.MessageRepository;
import com.Destek.Support.repository.SupportRequestRepository;
import com.Destek.Support.repository.UserRepository;
import com.Destek.Support.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/support")
public class SupportRequestController {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/requests")
    public ResponseEntity<?> getSupportRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<SupportRequest> requests;
        
        // Different views based on user role
        if (currentUser.getRole() == User.UserRole.ADMIN) {
            requests = supportRequestRepository.findAll();
        } else if (currentUser.getRole() == User.UserRole.REPRESENTATIVE) {
            requests = supportRequestRepository.findByRepresentative(currentUser);
        } else {
            requests = supportRequestRepository.findByCustomer(currentUser);
        }

        return ResponseEntity.ok(requests);
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<?> getSupportRequestById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportRequest request = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        // Check if user has access to this request
        if (currentUser.getRole() != User.UserRole.ADMIN &&
            !request.getCustomer().getId().equals(currentUser.getId()) &&
            (request.getRepresentative() == null || !request.getRepresentative().getId().equals(currentUser.getId()))) {
            return ResponseEntity.status(403).body("Access denied");
        }

        return ResponseEntity.ok(request);
    }

    @GetMapping("/requests/{id}/messages")
    public ResponseEntity<?> getSupportRequestMessages(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportRequest request = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        // Check if user has access to this request
        if (currentUser.getRole() != User.UserRole.ADMIN &&
            !request.getCustomer().getId().equals(currentUser.getId()) &&
            (request.getRepresentative() == null || !request.getRepresentative().getId().equals(currentUser.getId()))) {
            return ResponseEntity.status(403).body("Access denied");
        }

        List<Message> messages = messageRepository.findBySupportRequestOrderByTimestampAsc(request);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/requests/{id}/messages")
    public ResponseEntity<?> addMessage(@PathVariable Long id, @RequestBody MessageRequest messageRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportRequest request = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        // Check if user has access to this request
        if (!request.getCustomer().getId().equals(currentUser.getId()) &&
            (request.getRepresentative() == null || !request.getRepresentative().getId().equals(currentUser.getId()))) {
            return ResponseEntity.status(403).body("Access denied");
        }

        Message message = new Message();
        message.setSupportRequest(request);
        message.setSender(currentUser);
        message.setContent(messageRequest.getContent());
        
        if (currentUser.getRole() == User.UserRole.REPRESENTATIVE) {
            message.setType(Message.MessageType.REPRESENTATIVE);
        } else {
            message.setType(Message.MessageType.USER);
        }
        
        messageRepository.save(message);
        
        return ResponseEntity.ok(message);
    }

    @PreAuthorize("hasRole('REPRESENTATIVE') or hasRole('ADMIN')")
    @PostMapping("/requests/{id}/assign")
    public ResponseEntity<?> assignRequest(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != User.UserRole.REPRESENTATIVE && currentUser.getRole() != User.UserRole.ADMIN) {
            return ResponseEntity.status(403).body("Access denied");
        }

        SupportRequest request = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        request.setRepresentative(currentUser);
        request.setStatus(SupportRequest.RequestStatus.ASSIGNED);
        supportRequestRepository.save(request);

        return ResponseEntity.ok("Support request assigned successfully");
    }

    @PreAuthorize("hasRole('REPRESENTATIVE') or hasRole('ADMIN')")
    @PostMapping("/requests/{id}/close")
    public ResponseEntity<?> closeRequest(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportRequest request = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        // Check if user has access to close this request
        if (currentUser.getRole() != User.UserRole.ADMIN &&
            (request.getRepresentative() == null || !request.getRepresentative().getId().equals(currentUser.getId()))) {
            return ResponseEntity.status(403).body("Access denied");
        }

        request.setStatus(SupportRequest.RequestStatus.CLOSED);
        request.setClosedAt(LocalDateTime.now());
        supportRequestRepository.save(request);

        return ResponseEntity.ok("Support request closed successfully");
    }

    // Request/Response classes
    public static class MessageRequest {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
} 