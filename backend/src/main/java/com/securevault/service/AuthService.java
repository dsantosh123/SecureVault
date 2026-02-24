package com.securevault.service;

import com.securevault.dto.UserRegistrationRequest;
import com.securevault.model.User;
import com.securevault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;
    
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, ActivityLogService activityLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityLogService = activityLogService;
    }
    
    public User registerUser(UserRegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setFullName(request.getFullName());
        newUser.setCountry(request.getCountry());
        newUser.setAccountType("USER"); // Default role
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setInactivityDays(180); // Default inactivity period: 180 days
        newUser.setLastLoginAt(java.time.LocalDateTime.now());
        
        User saved = userRepository.save(newUser);
        activityLogService.log(saved.getId(), saved.getFullName(), "USER_REGISTRATION", "New user registered with email: " + saved.getEmail(), saved.getId(), "USER");
        return saved;
    }
    
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .filter(userObj -> passwordEncoder.matches(password, userObj.getPassword()))
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        user.setLastLoginAt(java.time.LocalDateTime.now());
        User saved = userRepository.save(user);
        
        // Log activity based on role
        String type = "ADMIN".equalsIgnoreCase(saved.getAccountType()) ? "ADMIN" : "USER";
        activityLogService.log(saved.getId(), saved.getFullName(), "LOGIN", "User logged into the system", saved.getId(), type);
        
        return saved;
    }

    public User adminLogin(String email, String password) {
        // Calling login directly will log the event. 
        // We filter out ADMIN logs in the admin dashboard anyway.
        User user = login(email, password);
        if (user.getAccountType() == null || !user.getAccountType().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("Access denied. User does not have administrative privileges.");
        }
        return user;
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
