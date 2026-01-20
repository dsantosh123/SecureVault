package com.securevault.controller;

import com.securevault.dto.UserRegistrationRequest;
import com.securevault.model.User;
import com.securevault.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/auth") 
public class AuthController {

    private final AuthService authService;

    // Manual Constructor to fix the "not initialized" error
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@RequestBody UserRegistrationRequest request) {
        // This now returns the User object (with the ID) instead of just a string
        User savedUser = authService.registerUser(request); 
        return ResponseEntity.ok(savedUser);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRegistrationRequest loginRequest) {
        // 1. Find user by email
        return userRepository.findByEmail(loginRequest.getEmail())
                // 2. Compare the plain-text password (since we haven't added hashing yet)
                .filter(user -> user.getPassword().equals(loginRequest.getPassword()))
                // 3. Return the full user object if match found
                .map(user -> ResponseEntity.ok(user)) 
                // 4. Return 401 if email not found or password wrong
                .orElse(ResponseEntity.status(401).build());
    }
}