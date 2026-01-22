package com.securevault.service;

import com.securevault.dto.UserRegistrationRequest;
import com.securevault.model.PasswordResetToken;
import com.securevault.model.User;
import com.securevault.repository.PasswordResetTokenRepository;
import com.securevault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository resetTokenRepository; // ✅ ADD THIS
    
    // ✅ UPDATE CONSTRUCTOR - Add PasswordResetTokenRepository
    public AuthService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder,
                      PasswordResetTokenRepository resetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.resetTokenRepository = resetTokenRepository; // ✅ ADD THIS
    }
    
    // ✅ EXISTING METHOD - NO CHANGES
    @Transactional 
    public User registerUser(UserRegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setFullName(request.getFullName());
        newUser.setCountry(request.getCountry());
        
        // 🔑 THE CRITICAL FIX: Hash the password BEFORE saving
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        
        return userRepository.save(newUser);
    }
    
    // ✅ EXISTING METHOD - NO CHANGES
    public User login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }
    
    // ✅ NEW METHOD - Create Password Reset Token
    @Transactional
    public PasswordResetToken createPasswordResetToken(String email) {
        // Check if user exists
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Delete any existing tokens for this email
        resetTokenRepository.findByEmail(email)
            .ifPresent(resetTokenRepository::delete);
        
        // Create new token
        PasswordResetToken resetToken = new PasswordResetToken(email);
        return resetTokenRepository.save(resetToken);
    }
    
    // ✅ NEW METHOD - Reset Password
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Find token
        PasswordResetToken resetToken = resetTokenRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid reset token"));
        
        // Check if expired
        if (resetToken.isExpired()) {
            throw new RuntimeException("Reset token has expired");
        }
        
        // Check if already used
        if (resetToken.isUsed()) {
            throw new RuntimeException("Reset token has already been used");
        }
        
        // Find user
        User user = userRepository.findByEmail(resetToken.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update password with BCrypt hashing
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Mark token as used
        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
        
        System.out.println("✅ Password reset successful for: " + user.getEmail());
    }
}
