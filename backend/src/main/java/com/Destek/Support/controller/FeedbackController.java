package com.Destek.Support.controller;

import com.Destek.Support.model.Feedback;
import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.model.User;
import com.Destek.Support.repository.FeedbackRepository;
import com.Destek.Support.repository.SupportRequestRepository;
import com.Destek.Support.repository.UserRepository;
import com.Destek.Support.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportRequest supportRequest = supportRequestRepository.findById(request.getSupportRequestId())
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        // Check if user has access to this request
        if (!supportRequest.getCustomer().getId().equals(currentUser.getId()) &&
            (supportRequest.getRepresentative() == null || !supportRequest.getRepresentative().getId().equals(currentUser.getId()))) {
            return ResponseEntity.status(403).body("Access denied");
        }

        // Check if feedback already exists
        Optional<Feedback> existingFeedback = feedbackRepository.findBySupportRequestAndUser(supportRequest, currentUser);
        if (existingFeedback.isPresent()) {
            return ResponseEntity.badRequest().body("Feedback already submitted");
        }

        Feedback feedback = new Feedback();
        feedback.setSupportRequest(supportRequest);
        feedback.setUser(currentUser);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());

        // If comment is provided, analyze sentiment
        if (request.getComment() != null && !request.getComment().isEmpty()) {
            // This would be replaced with actual AI service call
            // Map<String, String> aiRequest = new HashMap<>();
            // aiRequest.put("text", request.getComment());
            // SentimentResponse aiResponse = restTemplate.postForObject("http://localhost:8000/analyze", aiRequest, SentimentResponse.class);
            // feedback.setSentimentAnalysis(aiResponse.getResult());
            
            // For now, just set a placeholder
            feedback.setSentimentAnalysis("POSITIVE");
        }

        feedbackRepository.save(feedback);

        return ResponseEntity.ok("Feedback submitted successfully");
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<?> getFeedbackByRequest(@PathVariable Long requestId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportRequest supportRequest = supportRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Support request not found"));

        // Check if user has access to this request
        if (currentUser.getRole() != User.UserRole.ADMIN &&
            !supportRequest.getCustomer().getId().equals(currentUser.getId()) &&
            (supportRequest.getRepresentative() == null || !supportRequest.getRepresentative().getId().equals(currentUser.getId()))) {
            return ResponseEntity.status(403).body("Access denied");
        }

        List<Feedback> feedbacks = feedbackRepository.findBySupportRequest(supportRequest);
        return ResponseEntity.ok(feedbacks);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllFeedback() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        return ResponseEntity.ok(feedbacks);
    }

    // Request/Response classes
    public static class FeedbackRequest {
        private Long supportRequestId;
        private Feedback.Rating rating;
        private String comment;

        public Long getSupportRequestId() {
            return supportRequestId;
        }

        public void setSupportRequestId(Long supportRequestId) {
            this.supportRequestId = supportRequestId;
        }

        public Feedback.Rating getRating() {
            return rating;
        }

        public void setRating(Feedback.Rating rating) {
            this.rating = rating;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }
    }

    public static class SentimentResponse {
        private String result;

        public String getResult() {
            return result;
        }

        public void setResult(String result) {
            this.result = result;
        }
    }
} 