package com.Destek.Support.controller;

import com.Destek.Support.model.User;
import com.Destek.Support.model.UserRole;
import com.Destek.Support.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public interface ApiResponse {}

    public static class LoginResponse implements ApiResponse {
        private final Long id;
        private final String email;
        private final UserRole role;
        private final String fullName;

        public LoginResponse(User user) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.role = user.getRole();
            this.fullName = user.getFullName();
        }

        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public UserRole getRole() {
            return role;
        }

        public String getFullName() {
            return fullName;
        }
    }

    public static class ErrorResponse implements ApiResponse {
        private final String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            return new ResponseEntity<>(new ErrorResponse("Email and password are required"), HttpStatus.BAD_REQUEST);
        }

        return userService.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> new ResponseEntity<ApiResponse>(new LoginResponse(user), HttpStatus.OK))
                .orElse(new ResponseEntity<>(new ErrorResponse("Invalid email or password"), HttpStatus.BAD_REQUEST));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody Map<String, String> registerRequest) {
        String email = registerRequest.get("email");
        String password = registerRequest.get("password");
        String fullName = registerRequest.get("fullName");

        if (email == null || password == null || fullName == null) {
            return new ResponseEntity<>(new ErrorResponse("Email, password and full name are required"), HttpStatus.BAD_REQUEST);
        }

        if (userService.findByEmail(email).isPresent()) {
            return new ResponseEntity<>(new ErrorResponse("Email already exists"), HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(UserRole.CUSTOMER);

        User savedUser = userService.save(user);
        return new ResponseEntity<>(new LoginResponse(savedUser), HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ApiResponse> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> new ResponseEntity<ApiResponse>(new LoginResponse(user), HttpStatus.OK))
                .orElse(new ResponseEntity<>(new ErrorResponse("User not found"), HttpStatus.NOT_FOUND));
    }
} 