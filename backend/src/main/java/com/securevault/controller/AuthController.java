package com.securevault.controller;

import com.securevault.dto.OtpRequest;
import com.securevault.dto.UserRegistrationRequest;
import com.securevault.model.User;
import com.securevault.service.AuthService;
import com.securevault.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final AuthService authService;
    private final EmailService emailService;
    
    public AuthController(AuthService authService, EmailService emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }
    
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        try {
            emailService.sendOtp(request.getEmail());
            return ResponseEntity.ok("OTP sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send OTP: " + e.getMessage());
        }
    }
    
    // UPDATED: Signup with OTP verification
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody UserRegistrationRequest request) {
        try {
            // Verify OTP first
            if (!emailService.verifyOtp(request.getEmail(), request.getOtp())) {
                return ResponseEntity.status(400).body("Invalid or expired OTP");
            }
            
            // Create user if OTP is valid
            User savedUser = authService.registerUser(request);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRegistrationRequest loginRequest) {
        try {
            User user = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}