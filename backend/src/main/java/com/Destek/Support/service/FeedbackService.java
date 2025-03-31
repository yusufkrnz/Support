package com.Destek.Support.service;

import com.Destek.Support.model.Feedback;
import com.Destek.Support.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public List<Feedback> findAll() {
        return feedbackRepository.findAll();
    }

    public Feedback save(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> findByRequestId(Long requestId) {
        return feedbackRepository.findByRequestId(requestId);
    }

    public List<Feedback> findByCustomerId(Long customerId) {
        return feedbackRepository.findByCustomerId(customerId);
    }

    public void deleteById(Long id) {
        feedbackRepository.deleteById(id);
    }
} 