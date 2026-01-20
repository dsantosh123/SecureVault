package com.securevault.service;

import com.securevault.dto.UserRegistrationRequest;
import com.securevault.model.User;
import com.securevault.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    // 1. Manual Constructor fixes "authService may not have been initialized"
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional 
    public User registerUser(UserRegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        User newUser = new User();
        // ... (keep your existing set methods here) ...

        return userRepository.save(newUser); // Returns the User with the generated UUID
    }
}