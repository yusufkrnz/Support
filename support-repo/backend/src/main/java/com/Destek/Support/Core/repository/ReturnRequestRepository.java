package com.Destek.Support.Core.repository;

import com.Destek.Support.Core.entity.ReturnRequest;
import com.Destek.Support.Core.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    
    List<ReturnRequest> findByUserOrderByCreatedAtDesc(User user);
    
    List<ReturnRequest> findByStatus(ReturnRequest.ReturnStatus status);
    
    List<ReturnRequest> findByUserAndStatus(User user, ReturnRequest.ReturnStatus status);
    
    @Query("SELECT r FROM ReturnRequest r WHERE r.aiScore <= 3 AND r.isBypassed = false")
    List<ReturnRequest> findLowScoreRequests();
    
    @Query("SELECT r FROM ReturnRequest r WHERE r.isBypassed = true ORDER BY r.updatedAt DESC")
    List<ReturnRequest> findBypassedRequests();
    
    List<ReturnRequest> findByOrderNumber(String orderNumber);
    
    List<ReturnRequest> findByProductId(String productId);
} 