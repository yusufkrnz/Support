package com.Destek.Support.Core.controller;

import com.Destek.Support.Core.entity.User;
import com.Destek.Support.Core.entity.enums.UserRole;
import com.Destek.Support.Core.service.RoleBasedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Rol tabanlı işlemleri yöneten controller sınıfı
 */
@RestController
@RequestMapping("/api/role-ops")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RoleBasedController {

    @Autowired
    private RoleBasedService roleBasedService;
    
    /**
     * Kullanıcının hesabını devre dışı bırakır
     */
    @PostMapping("/deactivate-user/{userId}")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        try {
            roleBasedService.deactivateUser(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Kullanıcı başarıyla devre dışı bırakıldı");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("Kullanıcı devre dışı bırakılırken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Destek talebini bir müşteri temsilcisine atar
     */
    @PostMapping("/assign-ticket")
    public ResponseEntity<?> assignTicket(@RequestBody Map<String, Object> requestData) {
        try {
            Long ticketId = Long.valueOf(requestData.get("ticketId").toString());
            Long managerId = Long.valueOf(requestData.get("managerId").toString());
            
            roleBasedService.assignTicketToManager(ticketId, managerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Destek talebi müşteri temsilcisine başarıyla atandı");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("Destek talebi atanırken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Müşteri temsilcisini başka bir departmana transfer eder
     */
    @PostMapping("/transfer-manager")
    public ResponseEntity<?> transferManager(@RequestBody Map<String, Object> requestData) {
        try {
            Long managerId = Long.valueOf(requestData.get("managerId").toString());
            String newDepartment = (String) requestData.get("newDepartment");
            
            roleBasedService.transferManagerToDepartment(managerId, newDepartment);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Müşteri temsilcisi yeni departmana başarıyla transfer edildi");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("Müşteri temsilcisi transfer edilirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Sistem yapılandırma bilgilerini döndürür (Sadece SuperAdmin)
     */
    @GetMapping("/system-config")
    public ResponseEntity<?> getSystemConfiguration() {
        try {
            Object config = roleBasedService.getSystemConfiguration();
            return new ResponseEntity<>(config, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("Sistem yapılandırması alınırken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Kullanıcı rolünü değiştirir (Sadece SuperAdmin)
     */
    @PostMapping("/change-role")
    public ResponseEntity<?> changeUserRole(@RequestBody Map<String, Object> requestData) {
        try {
            Long userId = Long.valueOf(requestData.get("userId").toString());
            String roleName = (String) requestData.get("role");
            UserRole newRole = UserRole.valueOf(roleName);
            
            roleBasedService.changeUserRole(userId, newRole);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Kullanıcı rolü başarıyla değiştirildi");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("Kullanıcı rolü değiştirilirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Müşteri temsilcisinin uzmanlık alanını günceller
     */
    @PostMapping("/update-specialization")
    public ResponseEntity<?> updateSpecialization(@RequestBody Map<String, Object> requestData) {
        try {
            Long managerId = Long.valueOf(requestData.get("managerId").toString());
            String specialization = (String) requestData.get("specialization");
            
            roleBasedService.updateManagerSpecialization(managerId, specialization);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Uzmanlık alanı başarıyla güncellendi");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("Uzmanlık alanı güncellenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Tüm kullanıcıları listeler (Sadece Admin ve SuperAdmin)
     */
    @GetMapping("/list-all-users")
    public ResponseEntity<?> listAllUsers() {
        try {
            return new ResponseEntity<>(roleBasedService.listAllUsers(), HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("Kullanıcılar listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Kullanıcının kendi rol bilgilerini döndürür
     */
    @GetMapping("/my-role-info")
    public ResponseEntity<?> getMyRoleInfo() {
        try {
            User currentUser = roleBasedService.getCurrentUser();
            if (currentUser == null) {
                return new ResponseEntity<>("Oturum açılmamış", HttpStatus.UNAUTHORIZED);
            }
            
            Map<String, Object> roleInfo = new HashMap<>();
            roleInfo.put("userId", currentUser.getId());
            roleInfo.put("username", currentUser.getUsername());
            roleInfo.put("role", currentUser.getRole().name());
            roleInfo.put("permissions", currentUser.getPermissions());
            
            return new ResponseEntity<>(roleInfo, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Rol bilgileri alınırken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 