package com.securevault.controller;

import com.securevault.dto.ForgotPasswordRequest;
import com.securevault.dto.OtpRequest;
import com.securevault.dto.ResetPasswordRequest;
import com.securevault.dto.UserRegistrationRequest;
import com.securevault.model.PasswordResetToken;
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
    // ✅ NEW: Forgot Password - Send Reset Link
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            System.out.println("📧 Forgot password request for: " + request.getEmail());
            
            // Create reset token
            PasswordResetToken resetToken = authService.createPasswordResetToken(request.getEmail());
            
            // Send email
            emailService.sendPasswordResetEmail(request.getEmail(), resetToken.getToken());
            
            return ResponseEntity.ok("Password reset link sent to your email");
        } catch (RuntimeException e) {
            System.err.println("❌ Forgot password error: " + e.getMessage());
            // Don't reveal if email exists or not (security best practice)
            return ResponseEntity.ok("If that email exists, a reset link has been sent");
        } catch (Exception e) {
            System.err.println("❌ Forgot password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send reset email");
        }
    }
   // ✅ NEW: Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            System.out.println("🔐 Reset password request with token: " + request.getToken());
            
            authService.resetPassword(request.getToken(), request.getNewPassword());
            
            return ResponseEntity.ok("Password reset successful");
        } catch (RuntimeException e) {
            System.err.println("❌ Reset password error: " + e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Reset password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to reset password");
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