package com.Destek.Support.Core.controller;

import com.Destek.Support.Core.dto.CustomerDTO;
import com.Destek.Support.Core.dto.UserDTO;
import com.Destek.Support.Core.entity.*;
import com.Destek.Support.Core.entity.enums.UserRole;
import com.Destek.Support.Core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userService.findById(userId);
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("phone", user.getPhoneNumber());
            response.put("createdAt", user.getCreatedAt());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving user profile: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/tickets/{userId}")
    public ResponseEntity<?> getUserTickets(@PathVariable Long userId) {
        try {
            List<SupportTicket> tickets = userService.getUserSupportTickets(userId);
            return new ResponseEntity<>(tickets, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving user tickets: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/orders/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        try {
            return new ResponseEntity<>(userService.getUserOrders(userId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving user orders: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/update-profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserDTO userDTO) {
        try {
            User updatedUser = userService.updateUserProfile(userDTO);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating user profile: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<?> getUserDashboardData(@PathVariable Long userId) {
        try {
            Map<String, Object> dashboardData = new HashMap<>();
            
            // Get user profile info
            User user = userService.findById(userId);
            Map<String, Object> userProfile = new HashMap<>();
            userProfile.put("id", user.getId());
            userProfile.put("name", user.getName());
            userProfile.put("email", user.getEmail());
            userProfile.put("phone", user.getPhoneNumber());
            
            // Get support tickets
            List<SupportTicket> tickets = userService.getUserSupportTickets(userId);
            
            // Get user orders 
            var orders = userService.getUserOrders(userId);
            
            dashboardData.put("userProfile", userProfile);
            dashboardData.put("supportTickets", tickets);
            dashboardData.put("orders", orders);
            
            return new ResponseEntity<>(dashboardData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving dashboard data: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Müşteri rolünde yeni kullanıcı oluşturur
     */
    @PostMapping("/create/customer")
    public ResponseEntity<?> createCustomer(@RequestBody UserDTO userDTO) {
        try {
            Customer customer = new Customer();
            customer.setUsername(userDTO.getUsername());
            customer.setEmail(userDTO.getEmail());
            customer.setPassword(userDTO.getPassword());
            customer.setFullName(userDTO.getFullName());
            customer.setPhoneNumber(userDTO.getPhoneNumber());
            customer.setName(userDTO.getName());
            
            customer = (Customer) userService.createUser(customer);
            return new ResponseEntity<>(customer, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Müşteri oluşturulurken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Müşteri temsilcisi rolünde yeni kullanıcı oluşturur
     */
    @PostMapping("/create/manager")
    public ResponseEntity<?> createManager(@RequestBody Map<String, Object> requestData) {
        try {
            Manager manager = new Manager();
            manager.setUsername((String) requestData.get("username"));
            manager.setEmail((String) requestData.get("email"));
            manager.setPassword((String) requestData.get("password"));
            manager.setFullName((String) requestData.get("fullName"));
            manager.setPhoneNumber((String) requestData.get("phoneNumber"));
            manager.setName((String) requestData.get("name"));
            
            manager.setDepartment((String) requestData.get("department"));
            manager.setSpecialization((String) requestData.get("specialization"));
            manager.setTicketCapacity((Integer) requestData.get("ticketCapacity"));
            
            manager = (Manager) userService.createUser(manager);
            return new ResponseEntity<>(manager, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Müşteri temsilcisi oluşturulurken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Admin rolünde yeni kullanıcı oluşturur
     */
    @PostMapping("/create/admin")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, Object> requestData) {
        try {
            Admin admin = new Admin();
            admin.setUsername((String) requestData.get("username"));
            admin.setEmail((String) requestData.get("email"));
            admin.setPassword((String) requestData.get("password"));
            admin.setFullName((String) requestData.get("fullName"));
            admin.setPhoneNumber((String) requestData.get("phoneNumber"));
            admin.setName((String) requestData.get("name"));
            
            admin.setAdminLevel((String) requestData.get("adminLevel"));
            admin.setAdminArea((String) requestData.get("adminArea"));
            
            admin = (Admin) userService.createUser(admin);
            return new ResponseEntity<>(admin, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Admin oluşturulurken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Süper Admin rolünde yeni kullanıcı oluşturur
     */
    @PostMapping("/create/superadmin")
    public ResponseEntity<?> createSuperAdmin(@RequestBody Map<String, Object> requestData) {
        try {
            SuperAdmin superAdmin = new SuperAdmin();
            superAdmin.setUsername((String) requestData.get("username"));
            superAdmin.setEmail((String) requestData.get("email"));
            superAdmin.setPassword((String) requestData.get("password"));
            superAdmin.setFullName((String) requestData.get("fullName"));
            superAdmin.setPhoneNumber((String) requestData.get("phoneNumber"));
            superAdmin.setName((String) requestData.get("name"));
            
            superAdmin.setHasFullAccess((Boolean) requestData.getOrDefault("hasFullAccess", false));
            superAdmin.setSecurityLevel((String) requestData.get("securityLevel"));
            
            superAdmin = (SuperAdmin) userService.createUser(superAdmin);
            return new ResponseEntity<>(superAdmin, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Süper Admin oluşturulurken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Kullanıcı rolüne göre bilgileri getirir
     */
    @GetMapping("/role-info/{userId}")
    public ResponseEntity<?> getUserRoleInfo(@PathVariable Long userId) {
        try {
            User user = userService.findById(userId);
            if (user == null) {
                return new ResponseEntity<>("Kullanıcı bulunamadı", HttpStatus.NOT_FOUND);
            }
            
            Map<String, Object> roleInfo = new HashMap<>();
            roleInfo.put("userId", user.getId());
            roleInfo.put("role", user.getRole().name());
            
            if (user instanceof Customer) {
                // Customer'a özgü bilgiler
                roleInfo.put("type", "Customer");
            } else if (user instanceof Manager) {
                Manager manager = (Manager) user;
                roleInfo.put("type", "Manager");
                roleInfo.put("department", manager.getDepartment());
                roleInfo.put("specialization", manager.getSpecialization());
                roleInfo.put("ticketCapacity", manager.getTicketCapacity());
            } else if (user instanceof Admin) {
                Admin admin = (Admin) user;
                roleInfo.put("type", "Admin");
                roleInfo.put("adminLevel", admin.getAdminLevel());
                roleInfo.put("adminArea", admin.getAdminArea());
            } else if (user instanceof SuperAdmin) {
                SuperAdmin superAdmin = (SuperAdmin) user;
                roleInfo.put("type", "SuperAdmin");
                roleInfo.put("hasFullAccess", superAdmin.getHasFullAccess());
                roleInfo.put("securityLevel", superAdmin.getSecurityLevel());
            }
            
            return new ResponseEntity<>(roleInfo, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Rol bilgileri alınırken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Tüm müşteri kullanıcılarını listeler
     */
    @GetMapping("/customers")
    public ResponseEntity<?> getAllCustomers() {
        try {
            return new ResponseEntity<>(userService.getUserRepository().findAllCustomers(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Müşteriler listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Tüm müşteri temsilcilerini listeler
     */
    @GetMapping("/managers")
    public ResponseEntity<?> getAllManagers() {
        try {
            return new ResponseEntity<>(userService.getUserRepository().findAllManagers(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Müşteri temsilcileri listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Tüm admin kullanıcılarını listeler
     */
    @GetMapping("/admins")
    public ResponseEntity<?> getAllAdmins() {
        try {
            return new ResponseEntity<>(userService.getUserRepository().findAllAdmins(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Adminler listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Belirli bir departmandaki müşteri temsilcilerini listeler
     */
    @GetMapping("/managers/department/{department}")
    public ResponseEntity<?> getManagersByDepartment(@PathVariable String department) {
        try {
            return new ResponseEntity<>(userService.getUserRepository().findByDepartment(department), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Departmana göre müşteri temsilcileri listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Belirli bir şirketteki kullanıcıları listeler
     */
    @GetMapping("/company/{companyId}")
    public ResponseEntity<?> getUsersByCompany(@PathVariable Long companyId) {
        try {
            return new ResponseEntity<>(userService.getUserRepository().findByCompanyId(companyId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Şirkete göre kullanıcılar listelenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Müşteri özel bilgilerini günceller
     */
    @PostMapping("/customer-details")
    public ResponseEntity<?> updateCustomerDetails(@RequestBody CustomerDTO customerDTO) {
        try {
            // Müşteri bulunur
            Optional<Customer> customerOpt = userService.getUserRepository().findCustomerById(customerDTO.getId());
            if (customerOpt.isEmpty()) {
                return new ResponseEntity<>("Müşteri bulunamadı", HttpStatus.NOT_FOUND);
            }
            
            Customer customer = customerOpt.get();
            
            // Müşteriye özgü alanları güncelle
            if (customerDTO.getCustomerType() != null) {
                customer.setCustomerType(customerDTO.getCustomerType());
            }
            
            if (customerDTO.getLoyaltyPoints() != null) {
                customer.setLoyaltyPoints(customerDTO.getLoyaltyPoints());
            }
            
            if (customerDTO.getRegistrationDate() != null) {
                customer.setRegistrationDate(customerDTO.getRegistrationDate());
            }
            
            if (customerDTO.getPreferredContactMethod() != null) {
                customer.setPreferredContactMethod(customerDTO.getPreferredContactMethod());
            }
            
            if (customerDTO.getNewsletterSubscription() != null) {
                customer.setNewsletterSubscription(customerDTO.getNewsletterSubscription());
            }
            
            customer.setUpdatedAt(LocalDateTime.now());
            userService.updateUser(customer);
            
            return new ResponseEntity<>(CustomerDTO.fromEntity(customer), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Müşteri bilgileri güncellenirken hata: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 