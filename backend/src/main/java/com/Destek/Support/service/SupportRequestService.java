package com.Destek.Support.service;

import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.repository.SupportRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupportRequestService {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    public List<SupportRequest> findAll() {
        return supportRequestRepository.findAll();
    }

    public SupportRequest save(SupportRequest request) {
        return supportRequestRepository.save(request);
    }

    public Optional<SupportRequest> findById(Long id) {
        return supportRequestRepository.findById(id);
    }

    public List<SupportRequest> findByCustomerId(Long customerId) {
        return supportRequestRepository.findByCustomerId(customerId);
    }

    public List<SupportRequest> findByAssignedToId(Long assignedToId) {
        return supportRequestRepository.findByAssignedToId(assignedToId);
    }

    public void deleteById(Long id) {
        supportRequestRepository.deleteById(id);
    }
} 