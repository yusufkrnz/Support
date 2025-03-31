package com.Destek.Support.controller;

import com.Destek.Support.model.Feedback;
import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.model.User;
import com.Destek.Support.service.FeedbackService;
import com.Destek.Support.service.SupportRequestService;
import com.Destek.Support.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private SupportRequestService supportRequestService;

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/requests")
    public ResponseEntity<List<SupportRequest>> getAllRequests() {
        return ResponseEntity.ok(supportRequestService.findAll());
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.findAll());
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        List<SupportRequest> requests = supportRequestService.findAll();
        List<Feedback> feedbacks = feedbackService.findAll();
        List<User> users = userService.findAll();

        Map<String, Object> statistics = Map.of(
            "totalRequests", requests.size(),
            "totalFeedbacks", feedbacks.size(),
            "totalUsers", users.size(),
            "averageRating", feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0)
        );

        return ResponseEntity.ok(statistics);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/requests/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        supportRequestService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/feedbacks/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 