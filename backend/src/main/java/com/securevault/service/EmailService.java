package com.securevault.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final Map<String, OtpData> otpStorage = new HashMap<>();
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    public void sendOtp(String email) {
        try {
            String otp = String.format("%06d", new SecureRandom().nextInt(999999));
            otpStorage.put(email, new OtpData(otp, LocalDateTime.now().plusMinutes(5)));
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("SecureVault - Email Verification Code");
            message.setText("Your verification code is: " + otp + "\n\nThis code will expire in 5 minutes.");
            
            mailSender.send(message);
            
            System.out.println("✅ OTP sent to " + email + ": " + otp);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }
    
    public boolean verifyOtp(String email, String otp) {
        OtpData stored = otpStorage.get(email);
        
        if (stored == null) {
            return false;
        }
        
        if (LocalDateTime.now().isAfter(stored.expiryTime)) {
            otpStorage.remove(email);
            return false;
        }
        
        if (stored.otp.equals(otp)) {
            otpStorage.remove(email);
            return true;
        }
        
        return false;
    }
    
    private static class OtpData {
        String otp;
        LocalDateTime expiryTime;
        
        OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
    public void sendPasswordResetEmail(String email, String resetToken) {
        try {
            // Create reset link
            String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("SecureVault - Password Reset Request");
            message.setText(
                "Hello,\n\n" +
                "You requested to reset your password for your SecureVault account.\n\n" +
                "Click the link below to reset your password:\n" +
                resetLink + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "SecureVault Team"
            );
            
            mailSender.send(message);
            
            System.out.println("✅ Password reset email sent to: " + email);
            System.out.println("🔗 Reset link: " + resetLink);
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage());
        }
    }
}