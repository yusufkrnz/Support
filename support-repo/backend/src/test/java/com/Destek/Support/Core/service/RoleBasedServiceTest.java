package com.Destek.Support.Core.service;

import com.Destek.Support.Core.entity.*;
import com.Destek.Support.Core.entity.enums.UserRole;
import com.Destek.Support.Core.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * RoleBasedService için test sınıfı
 */
public class RoleBasedServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private SecurityContext securityContext;
    
    @Mock
    private Authentication authentication;
    
    @InjectMocks
    private RoleBasedService roleBasedService;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
    }
    
    @Test
    public void testGetCurrentUser() {
        // Test kurulumu
        User mockUser = new Customer();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(authentication.isAuthenticated()).thenReturn(true);
        
        // Metodu çağır
        User user = roleBasedService.getCurrentUser();
        
        // Doğrulama
        assertNotNull(user);
        assertSame(mockUser, user);
    }
    
    @Test
    public void testCurrentUserHasRole() {
        // Test kurulumu
        Customer mockUser = new Customer();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(authentication.isAuthenticated()).thenReturn(true);
        
        // Metodu çağır
        boolean hasRole = roleBasedService.currentUserHasRole(UserRole.CUSTOMER);
        boolean hasWrongRole = roleBasedService.currentUserHasRole(UserRole.ADMIN);
        
        // Doğrulama
        assertTrue(hasRole);
        assertFalse(hasWrongRole);
    }
    
    @Test
    public void testHasRoleAuthorityAtLeast() {
        // SUPER_ADMIN rolü testi
        SuperAdmin superAdmin = new SuperAdmin();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(superAdmin);
        when(authentication.isAuthenticated()).thenReturn(true);
        
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.CUSTOMER));
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.MANAGER));
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.ADMIN));
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.SUPER_ADMIN));
        
        // ADMIN rolü testi
        Admin admin = new Admin();
        when(authentication.getPrincipal()).thenReturn(admin);
        
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.CUSTOMER));
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.MANAGER));
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.ADMIN));
        assertFalse(roleBasedService.hasRoleAuthorityAtLeast(UserRole.SUPER_ADMIN));
        
        // MANAGER rolü testi
        Manager manager = new Manager();
        when(authentication.getPrincipal()).thenReturn(manager);
        
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.CUSTOMER));
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.MANAGER));
        assertFalse(roleBasedService.hasRoleAuthorityAtLeast(UserRole.ADMIN));
        assertFalse(roleBasedService.hasRoleAuthorityAtLeast(UserRole.SUPER_ADMIN));
        
        // CUSTOMER rolü testi
        Customer customer = new Customer();
        when(authentication.getPrincipal()).thenReturn(customer);
        
        assertTrue(roleBasedService.hasRoleAuthorityAtLeast(UserRole.CUSTOMER));
        assertFalse(roleBasedService.hasRoleAuthorityAtLeast(UserRole.MANAGER));
        assertFalse(roleBasedService.hasRoleAuthorityAtLeast(UserRole.ADMIN));
        assertFalse(roleBasedService.hasRoleAuthorityAtLeast(UserRole.SUPER_ADMIN));
    }
    
    @Test
    public void testDeactivateUser_Admin() {
        // Test kurulumu
        Admin admin = new Admin();
        admin.setId(1L);
        
        Customer customer = new Customer();
        customer.setId(2L);
        customer.setActive(true);
        
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(admin);
        when(authentication.isAuthenticated()).thenReturn(true);
        
        when(userRepository.findById(2L)).thenReturn(Optional.of(customer));
        
        // Metodu çağır
        roleBasedService.deactivateUser(2L);
        
        // Doğrulama
        assertFalse(customer.isActive());
        verify(userRepository).save(customer);
    }
    
    @Test
    public void testDeactivateUser_CustomersCannotDeactivate() {
        // Test kurulumu
        Customer currentUser = new Customer();
        currentUser.setId(1L);
        
        User targetUser = new Customer();
        targetUser.setId(2L);
        
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(currentUser);
        when(authentication.isAuthenticated()).thenReturn(true);
        
        // Metodu çağır ve AccessDeniedException bekle
        assertThrows(AccessDeniedException.class, () -> {
            roleBasedService.deactivateUser(2L);
        });
        
        // save metodu çağrılmamalı
        verify(userRepository, never()).save(any());
    }
    
    @Test
    public void testDeactivateUser_AdminCannotDeactivateSuperAdmin() {
        // Test kurulumu
        Admin admin = new Admin();
        admin.setId(1L);
        
        SuperAdmin superAdmin = new SuperAdmin();
        superAdmin.setId(2L);
        
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(admin);
        when(authentication.isAuthenticated()).thenReturn(true);
        
        when(userRepository.findById(2L)).thenReturn(Optional.of(superAdmin));
        
        // Metodu çağır ve AccessDeniedException bekle
        assertThrows(AccessDeniedException.class, () -> {
            roleBasedService.deactivateUser(2L);
        });
        
        // save metodu çağrılmamalı
        verify(userRepository, never()).save(any());
    }
    
    @Test
    public void testTransferManagerToDepartment() {
        // Test kurulumu
        Admin admin = new Admin();
        
        Manager manager = new Manager();
        manager.setId(1L);
        manager.setDepartment("Eski Departman");
        
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(admin);
        when(authentication.isAuthenticated()).thenReturn(true);
        
        when(userRepository.findManagerById(1L)).thenReturn(Optional.of(manager));
        
        // Metodu çağır
        roleBasedService.transferManagerToDepartment(1L, "Yeni Departman");
        
        // Doğrulama
        assertEquals("Yeni Departman", manager.getDepartment());
        verify(userRepository).save(manager);
    }
    
    @Test
    public void testListAllUsers_OnlyAdminCanAccess() {
        // Test kurulumu - Admin
        Admin admin = new Admin();
        
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(admin);
        when(authentication.isAuthenticated()).thenReturn(true);
        
        // Admin için metodu çağır
        roleBasedService.listAllUsers();
        
        // findAll metodu çağrılmalı
        verify(userRepository).findAll();
        
        // Test kurulumu - Customer
        Customer customer = new Customer();
        when(authentication.getPrincipal()).thenReturn(customer);
        
        // Customer için metodu çağır ve AccessDeniedException bekle
        assertThrows(AccessDeniedException.class, () -> {
            roleBasedService.listAllUsers();
        });
    }
} 