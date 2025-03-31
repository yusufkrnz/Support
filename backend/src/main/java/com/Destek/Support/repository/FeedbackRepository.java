package com.Destek.Support.repository;

import com.Destek.Support.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByRequestId(Long requestId);
    List<Feedback> findByCustomerId(Long customerId);
} 