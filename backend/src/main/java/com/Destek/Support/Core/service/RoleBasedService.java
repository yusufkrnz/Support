package com.Destek.Support.Core.service;

import com.Destek.Support.Core.entity.*;
import com.Destek.Support.Core.entity.enums.UserRole;
import com.Destek.Support.Core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Rol tabanlı işlemleri yöneten servis sınıfı.
 * Her rol için özel operasyonları içerir.
 */
@Service
public class RoleBasedService {

    @Autowired
    private UserRepository userRepository;
    
    /**
     * Oturum açan kullanıcıyı döndürür
     * @return Oturum açan kullanıcı
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        
        return null;
    }
    
    /**
     * Mevcut kullanıcının belirtilen rolde olup olmadığını kontrol eder
     * @param role Kontrol edilecek rol
     * @return true: kullanıcı belirtilen role sahip, false: sahip değil
     */
    public boolean currentUserHasRole(UserRole role) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return false;
        }
        
        return currentUser.getRole() == role;
    }
    
    /**
     * Belirtilen rolden daha yüksek yetkiye sahip mi kontrol eder
     * @param minimumRole Minimum gerekli rol
     * @return true: yeterli yetkiye sahip, false: yetkisi yetersiz
     */
    public boolean hasRoleAuthorityAtLeast(UserRole minimumRole) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return false;
        }
        
        // Rol hiyerarşisi: SUPER_ADMIN > ADMIN > MANAGER > CUSTOMER
        UserRole userRole = currentUser.getRole();
        
        if (userRole == UserRole.SUPER_ADMIN) {
            return true; // En yüksek yetki
        }
        
        if (userRole == UserRole.ADMIN) {
            return minimumRole != UserRole.SUPER_ADMIN;
        }
        
        if (userRole == UserRole.MANAGER) {
            return minimumRole != UserRole.SUPER_ADMIN && minimumRole != UserRole.ADMIN;
        }
        
        if (userRole == UserRole.CUSTOMER) {
            return minimumRole == UserRole.CUSTOMER;
        }
        
        return false;
    }
    
    /**
     * Kullanıcının hesabını devre dışı bırakır (yalnızca Admin ve SuperAdmin)
     * @param userId Devre dışı bırakılacak kullanıcı ID'si
     * @throws AccessDeniedException Yetki hatası durumunda
     */
    @Transactional
    public void deactivateUser(Long userId) {
        if (!hasRoleAuthorityAtLeast(UserRole.ADMIN)) {
            throw new AccessDeniedException("Bu işlem için admin yetkisi gereklidir");
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // SuperAdmin sadece başka bir SuperAdmin tarafından devre dışı bırakılabilir
            if (user.getRole() == UserRole.SUPER_ADMIN && getCurrentUser().getRole() != UserRole.SUPER_ADMIN) {
                throw new AccessDeniedException("Süper admin kullanıcılar yalnızca başka bir süper admin tarafından devre dışı bırakılabilir");
            }
            
            user.setActive(false);
            userRepository.save(user);
        }
    }
    
    /**
     * Müşteri temsilcilerine destek talepleri atar
     * Yalnızca Admin ve SuperAdmin yetkisi ile yapılabilir
     * @param ticketId Destek talebi ID'si
     * @param managerId Müşteri temsilcisi ID'si
     * @throws AccessDeniedException Yetki hatası durumunda
     */
    @Transactional
    public void assignTicketToManager(Long ticketId, Long managerId) {
        if (!hasRoleAuthorityAtLeast(UserRole.ADMIN)) {
            throw new AccessDeniedException("Bu işlem için admin yetkisi gereklidir");
        }
        
        // Manager kontrolü
        Optional<Manager> managerOpt = userRepository.findManagerById(managerId);
        if (!managerOpt.isPresent()) {
            throw new IllegalArgumentException("Belirtilen ID'ye sahip müşteri temsilcisi bulunamadı");
        }
        
        // Burada SupportTicket servisine talep atama işlemi yapılacak
        // Şimdilik stub olarak bırakıyoruz
    }
    
    /**
     * Departmanlar arası müşteri temsilcisi transferi yapar
     * Yalnızca Admin yetkisi ile yapılabilir
     * @param managerId Müşteri temsilcisi ID'si
     * @param newDepartment Yeni departman
     * @throws AccessDeniedException Yetki hatası durumunda
     */
    @Transactional
    public void transferManagerToDepartment(Long managerId, String newDepartment) {
        if (!hasRoleAuthorityAtLeast(UserRole.ADMIN)) {
            throw new AccessDeniedException("Bu işlem için admin yetkisi gereklidir");
        }
        
        Optional<Manager> managerOpt = userRepository.findManagerById(managerId);
        if (managerOpt.isPresent()) {
            Manager manager = managerOpt.get();
            manager.setDepartment(newDepartment);
            userRepository.save(manager);
        }
    }
    
    /**
     * SuperAdmin için sistem yapılandırması erişimi sağlar
     * @return Sistem yapılandırma bilgileri
     * @throws AccessDeniedException Yetki hatası durumunda
     */
    public Object getSystemConfiguration() {
        if (!hasRoleAuthorityAtLeast(UserRole.SUPER_ADMIN)) {
            throw new AccessDeniedException("Bu işlem için süper admin yetkisi gereklidir");
        }
        
        // Sistem yapılandırmasını döndür (şimdilik stub olarak boş bir nesne)
        return new Object();
    }
    
    /**
     * Bir kullanıcının rolünü değiştirir
     * Yalnızca SuperAdmin bu işlemi yapabilir
     * @param userId Kullanıcı ID'si
     * @param newRole Yeni rol
     * @throws AccessDeniedException Yetki hatası durumunda
     */
    @Transactional
    public void changeUserRole(Long userId, UserRole newRole) {
        if (!hasRoleAuthorityAtLeast(UserRole.SUPER_ADMIN)) {
            throw new AccessDeniedException("Bu işlem için süper admin yetkisi gereklidir");
        }
        
        // Bu işlem karmaşık olduğu için ve veritabanı şemasında değişiklik gerektirebileceği için
        // burada bir stub implementasyonu olarak bırakıyoruz.
        // Gerçek uygulamada, varolan kullanıcıyı silip, yeni rol ile tekrar oluşturmak gerekebilir.
    }
    
    /**
     * Müşteri temsilcisinin uzmanlık alanını günceller
     * @param managerId Müşteri temsilcisi ID'si
     * @param specialization Yeni uzmanlık alanı
     */
    @Transactional
    public void updateManagerSpecialization(Long managerId, String specialization) {
        // Sadece Admin veya kendisi güncelleyebilir
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new AccessDeniedException("Oturum açılmamış");
        }
        
        boolean isAdmin = currentUser.getRole() == UserRole.ADMIN || 
                         currentUser.getRole() == UserRole.SUPER_ADMIN;
        boolean isSelf = currentUser.getId().equals(managerId);
        
        if (!isAdmin && !isSelf) {
            throw new AccessDeniedException("Bu işlem için yetkiniz bulunmamaktadır");
        }
        
        Optional<Manager> managerOpt = userRepository.findManagerById(managerId);
        if (managerOpt.isPresent()) {
            Manager manager = managerOpt.get();
            manager.setSpecialization(specialization);
            userRepository.save(manager);
        }
    }
    
    /**
     * Tüm kullanıcı tiplerini listeler
     * Sadece Admin ve SuperAdmin yetkisi ile çalışır
     * @return Kullanıcı listesi
     */
    public List<User> listAllUsers() {
        if (!hasRoleAuthorityAtLeast(UserRole.ADMIN)) {
            throw new AccessDeniedException("Bu işlem için admin yetkisi gereklidir");
        }
        
        return userRepository.findAll();
    }
} 