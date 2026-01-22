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
}