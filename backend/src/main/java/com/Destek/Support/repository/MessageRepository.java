package com.Destek.Support.repository;

import com.Destek.Support.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRequestId(Long requestId);
    List<Message> findBySenderId(Long senderId);
} 