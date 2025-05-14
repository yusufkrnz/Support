package com.Destek.Support.Core.repository;

import com.Destek.Support.Core.entity.User;
import com.Destek.Support.Core.entity.UserOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserOrderRepository extends JpaRepository<UserOrder, Long> {
    
    List<UserOrder> findByUserOrderByOrderDateDesc(User user);
    
    List<UserOrder> findByUserIdOrderByOrderDateDesc(Long userId);
    
    List<UserOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    UserOrder findByOrderNumber(String orderNumber);
    
    @Query("SELECT o FROM UserOrder o WHERE o.user.id = :userId AND o.status = :status ORDER BY o.orderDate DESC")
    List<UserOrder> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
    
    @Query("SELECT COUNT(o) FROM UserOrder o WHERE o.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    // Tarih aralığına göre siparişleri getir
    @Query("SELECT o FROM UserOrder o WHERE o.user.id = :userId AND o.orderDate BETWEEN :startDate AND :endDate ORDER BY o.orderDate DESC")
    List<UserOrder> findByUserIdAndDateRange(
            @Param("userId") Long userId, 
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    // Belirli bir ürünü içeren siparişleri getir
    @Query("SELECT o FROM UserOrder o JOIN o.orderItems i WHERE o.user.id = :userId AND i.productId = :productId ORDER BY o.orderDate DESC")
    List<UserOrder> findByUserIdAndProductId(
            @Param("userId") Long userId, 
            @Param("productId") String productId);
    
    // Belirli bir ürün adını içeren siparişleri getir
    @Query("SELECT o FROM UserOrder o JOIN o.orderItems i WHERE o.user.id = :userId AND LOWER(i.productName) LIKE LOWER(CONCAT('%', :productName, '%')) ORDER BY o.orderDate DESC")
    List<UserOrder> findByUserIdAndProductName(
            @Param("userId") Long userId, 
            @Param("productName") String productName);
} 