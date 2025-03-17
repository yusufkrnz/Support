package com.Destek.Support.repository;

import com.Destek.Support.model.SupportRequest;
import com.Destek.Support.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
    List<SupportRequest> findByCustomer(User customer);
    List<SupportRequest> findByRepresentative(User representative);
    List<SupportRequest> findByStatus(SupportRequest.RequestStatus status);
    List<SupportRequest> findByCustomerAndStatus(User customer, SupportRequest.RequestStatus status);
    List<SupportRequest> findByRepresentativeAndStatus(User representative, SupportRequest.RequestStatus status);
} 