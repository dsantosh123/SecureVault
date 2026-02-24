package com.securevault.controller;

import com.securevault.dto.OtpRequest;
import com.securevault.dto.UserRegistrationRequest;
import com.securevault.model.User;
import com.securevault.service.AuthService;
import com.securevault.service.EmailService;
import com.securevault.security.JwtUtils;
import com.securevault.security.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final AuthService authService;
    private final EmailService emailService;
    private final JwtUtils jwtUtils;
    private final SecurityUtils securityUtils;
    
    public AuthController(AuthService authService, EmailService emailService, JwtUtils jwtUtils, SecurityUtils securityUtils) {
        this.authService = authService;
        this.emailService = emailService;
        this.jwtUtils = jwtUtils;
        this.securityUtils = securityUtils;
    }
    
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        try {
            emailService.sendOtp(request.getEmail());
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send OTP: " + e.getMessage()));
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            if (!emailService.verifyOtp(request.getEmail(), request.getOtp())) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid or expired OTP"));
            }
            
            User savedUser = authService.registerUser(request);
            String token = jwtUtils.generateToken(savedUser.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", savedUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserRegistrationRequest loginRequest) {
        try {
            System.out.println("🔍 [AuthController] Login attempt for: " + loginRequest.getEmail());
            User user = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
            System.out.println("✅ [AuthController] Login successful for: " + user.getEmail() + " (ID: " + user.getId() + ")");
            
            // Include roles in token
            Map<String, Object> claims = new HashMap<>();
            claims.put("roles", java.util.List.of("ROLE_USER"));
            if ("ADMIN".equalsIgnoreCase(user.getAccountType())) {
                claims.put("roles", java.util.List.of("ROLE_USER", "ROLE_ADMIN"));
            }
            
            String token = jwtUtils.generateToken(user.getId(), claims);
            System.out.println("✅ [AuthController] Generated token for userId: " + user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("❌ [AuthController] Login failed: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            User user = authService.adminLogin(email, password);
            
            Map<String, Object> claims = new HashMap<>();
            claims.put("roles", java.util.List.of("ROLE_USER", "ROLE_ADMIN"));
            
            String token = jwtUtils.generateToken(user.getId(), claims);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        try {
            String userId = securityUtils.getCurrentUserId();
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            
            authService.changePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
