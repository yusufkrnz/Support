package com.Destek.Support.Core.repository;

import com.Destek.Support.Core.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    // Rol tipine göre sorgu metotları
    @Query("SELECT u FROM Customer u")
    List<Customer> findAllCustomers();
    
    @Query("SELECT u FROM Manager u")
    List<Manager> findAllManagers();
    
    @Query("SELECT u FROM Admin u")
    List<Admin> findAllAdmins();
    
    @Query("SELECT u FROM SuperAdmin u")
    List<SuperAdmin> findAllSuperAdmins();
    
    // Rol tipine göre ID ile sorgular
    Optional<Customer> findCustomerById(Long id);
    Optional<Manager> findManagerById(Long id);
    Optional<Admin> findAdminById(Long id);
    Optional<SuperAdmin> findSuperAdminById(Long id);
    
    // Departmana göre Müşteri Temsilcilerini bulma
    List<Manager> findByDepartment(String department);
    
    // Aktif duruma göre kullanıcı bulma
    List<User> findByActiveTrue();
    List<User> findByActiveFalse();
    
    // Şirkete göre kullanıcıları bulma
    List<User> findByCompanyId(Long companyId);
} 