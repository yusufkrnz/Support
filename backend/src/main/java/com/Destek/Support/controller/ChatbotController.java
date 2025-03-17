package com.Destek.Support.controller;

import com.Destek.Support.model.Message;
import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.model.User;
import com.Destek.Support.repository.MessageRepository;
import com.Destek.Support.repository.SupportRequestRepository;
import com.Destek.Support.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessageRequest request) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find or create support request
        SupportRequest supportRequest;
        if (request.getSupportRequestId() != null) {
            supportRequest = supportRequestRepository.findById(request.getSupportRequestId())
                    .orElseThrow(() -> new RuntimeException("Support request not found"));
        } else {
            supportRequest = new SupportRequest();
            supportRequest.setCustomer(currentUser);
            supportRequest.setSubject(request.getSubject() != null ? request.getSubject() : "New Support Request");
            supportRequest.setDescription(request.getMessage());
            supportRequest.setStatus(SupportRequest.RequestStatus.OPEN);
            supportRequest = supportRequestRepository.save(supportRequest);
        }

        // Save user message
        Message userMessage = new Message();
        userMessage.setSupportRequest(supportRequest);
        userMessage.setSender(currentUser);
        userMessage.setContent(request.getMessage());
        userMessage.setType(Message.MessageType.USER);
        messageRepository.save(userMessage);

        // Process with AI service
        Map<String, String> aiRequest = new HashMap<>();
        aiRequest.put("text", request.getMessage());
        
        // This would be replaced with actual AI service call
        // ChatbotResponse aiResponse = restTemplate.postForObject("http://localhost:8000/analyze", aiRequest, ChatbotResponse.class);
        
        // For now, just return a mock response
        String botResponse = "Thank you for your message. How can I help you today?";
        
        // Save bot response
        Message botMessage = new Message();
        botMessage.setSupportRequest(supportRequest);
        botMessage.setContent(botResponse);
        botMessage.setType(Message.MessageType.CHATBOT);
        messageRepository.save(botMessage);

        Map<String, Object> response = new HashMap<>();
        response.put("supportRequestId", supportRequest.getId());
        response.put("message", botResponse);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/request-representative")
    public ResponseEntity<?> requestRepresentative(@RequestBody RepresentativeRequest request) {
        SupportRequest supportRequest = supportRequestRepository.findById(request.getSupportRequestId())
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        supportRequest.setStatus(SupportRequest.RequestStatus.ASSIGNED);
        // In a real application, you would assign a representative based on availability
        // For now, we'll just update the status
        supportRequestRepository.save(supportRequest);

        return ResponseEntity.ok("Your request has been received. A representative will be with you shortly.");
    }

    // Request/Response classes
    public static class ChatMessageRequest {
        private Long supportRequestId;
        private String subject;
        private String message;

        public Long getSupportRequestId() {
            return supportRequestId;
        }

        public void setSupportRequestId(Long supportRequestId) {
            this.supportRequestId = supportRequestId;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class RepresentativeRequest {
        private Long supportRequestId;

        public Long getSupportRequestId() {
            return supportRequestId;
        }

        public void setSupportRequestId(Long supportRequestId) {
            this.supportRequestId = supportRequestId;
        }
    }
} 