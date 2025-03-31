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

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private SupportRequestService supportRequestService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Feedback> createFeedback(
            @RequestParam Long requestId,
            @RequestParam Long customerId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment) {
        
        SupportRequest request = supportRequestService.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Support request not found"));
        
        User customer = userService.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Feedback feedback = new Feedback();
        feedback.setRequest(request);
        feedback.setCustomer(customer);
        feedback.setRating(rating);
        feedback.setComment(comment);

        return ResponseEntity.ok(feedbackService.save(feedback));
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByRequest(@PathVariable Long requestId) {
        return ResponseEntity.ok(feedbackService.findByRequestId(requestId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(feedbackService.findByCustomerId(customerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 