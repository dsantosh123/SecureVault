package com.securevault.service;

import com.securevault.dto.UserRegistrationRequest;
import com.securevault.model.User;
import com.securevault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // ✅ ADD THIS
    
    // ✅ UPDATE CONSTRUCTOR - Add PasswordEncoder parameter
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
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
    
    // ✅ UPDATE LOGIN METHOD - Use BCrypt to compare passwords
    public User login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }
}
