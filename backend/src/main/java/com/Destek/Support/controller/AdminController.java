package com.Destek.Support.controller;

import com.Destek.Support.model.Feedback;
import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.model.User;
import com.Destek.Support.repository.FeedbackRepository;
import com.Destek.Support.repository.SupportRequestRepository;
import com.Destek.Support.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/representatives")
    public ResponseEntity<?> getAllRepresentatives() {
        List<User> representatives = userRepository.findByRole(User.UserRole.REPRESENTATIVE);
        return ResponseEntity.ok(representatives);
    }

    @GetMapping("/analytics/requests")
    public ResponseEntity<?> getRequestAnalytics() {
        List<SupportRequest> allRequests = supportRequestRepository.findAll();
        
        long totalRequests = allRequests.size();
        long openRequests = allRequests.stream()
                .filter(r -> r.getStatus() == SupportRequest.RequestStatus.OPEN)
                .count();
        long assignedRequests = allRequests.stream()
                .filter(r -> r.getStatus() == SupportRequest.RequestStatus.ASSIGNED)
                .count();
        long closedRequests = allRequests.stream()
                .filter(r -> r.getStatus() == SupportRequest.RequestStatus.CLOSED)
                .count();
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalRequests", totalRequests);
        analytics.put("openRequests", openRequests);
        analytics.put("assignedRequests", assignedRequests);
        analytics.put("closedRequests", closedRequests);
        
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/feedback")
    public ResponseEntity<?> getFeedbackAnalytics() {
        List<Feedback> allFeedback = feedbackRepository.findAll();
        
        long totalFeedback = allFeedback.size();
        
        Map<Feedback.Rating, Long> ratingCounts = allFeedback.stream()
                .collect(Collectors.groupingBy(Feedback::getRating, Collectors.counting()));
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalFeedback", totalFeedback);
        analytics.put("ratingCounts", ratingCounts);
        
        // Calculate average rating (assuming enum ordinal reflects rating value)
        double averageRating = allFeedback.stream()
                .mapToInt(f -> f.getRating().ordinal())
                .average()
                .orElse(0.0);
        analytics.put("averageRating", averageRating);
        
        // Sentiment analysis summary
        Map<String, Long> sentimentCounts = allFeedback.stream()
                .filter(f -> f.getSentimentAnalysis() != null)
                .collect(Collectors.groupingBy(Feedback::getSentimentAnalysis, Collectors.counting()));
        analytics.put("sentimentCounts", sentimentCounts);
        
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/representatives")
    public ResponseEntity<?> getRepresentativeAnalytics() {
        List<User> representatives = userRepository.findByRole(User.UserRole.REPRESENTATIVE);
        List<SupportRequest> allRequests = supportRequestRepository.findAll();
        
        Map<Long, Object> repAnalytics = new HashMap<>();
        
        for (User rep : representatives) {
            Map<String, Object> analytics = new HashMap<>();
            
            long assignedRequests = allRequests.stream()
                    .filter(r -> r.getRepresentative() != null && r.getRepresentative().getId().equals(rep.getId()))
                    .count();
            
            long closedRequests = allRequests.stream()
                    .filter(r -> r.getRepresentative() != null && 
                           r.getRepresentative().getId().equals(rep.getId()) && 
                           r.getStatus() == SupportRequest.RequestStatus.CLOSED)
                    .count();
            
            analytics.put("name", rep.getFullName());
            analytics.put("email", rep.getEmail());
            analytics.put("assignedRequests", assignedRequests);
            analytics.put("closedRequests", closedRequests);
            
            // Get feedback for this representative's requests
            List<Feedback> repFeedback = allRequests.stream()
                    .filter(r -> r.getRepresentative() != null && r.getRepresentative().getId().equals(rep.getId()))
                    .flatMap(r -> feedbackRepository.findBySupportRequest(r).stream())
                    .collect(Collectors.toList());
            
            if (!repFeedback.isEmpty()) {
                double avgRating = repFeedback.stream()
                        .mapToInt(f -> f.getRating().ordinal())
                        .average()
                        .orElse(0.0);
                analytics.put("averageRating", avgRating);
                
                Map<Feedback.Rating, Long> ratingCounts = repFeedback.stream()
                        .collect(Collectors.groupingBy(Feedback::getRating, Collectors.counting()));
                analytics.put("ratingCounts", ratingCounts);
            }
            
            repAnalytics.put(rep.getId(), analytics);
        }
        
        return ResponseEntity.ok(repAnalytics);
    }
} 