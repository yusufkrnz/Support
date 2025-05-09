package com.Destek.Support.repository;

import com.Destek.Support.model.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
    List<SupportRequest> findByCustomerId(Long customerId);
    List<SupportRequest> findByAssignedToId(Long assignedToId);
} 