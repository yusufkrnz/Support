package com.Destek.Support.repository;

import com.Destek.Support.model.Feedback;
import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findBySupportRequest(SupportRequest supportRequest);
    List<Feedback> findByUser(User user);
    Optional<Feedback> findBySupportRequestAndUser(SupportRequest supportRequest, User user);
} 