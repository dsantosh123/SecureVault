package com.securevault.controller;

import com.securevault.model.User;
import com.securevault.security.SecurityUtils;
import com.securevault.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;

    public UserController(UserService userService, SecurityUtils securityUtils) {
        this.userService = userService;
        this.securityUtils = securityUtils;
    }

    /**
     * GET /api/users/profile
     * Returns the current user's profile with inactivityDays and lastLoginAt
     * needed for dynamic inactivity calculation on frontend.
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            System.out.println("🔍 [UserController] Getting profile for current user...");
            String userId = securityUtils.getCurrentUserId();
            System.out.println("✅ [UserController] Current userId from security context: " + userId);
            
            User user = userService.getUserById(userId);
            System.out.println("✅ [UserController] Found user: " + user.getEmail());

            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("email", user.getEmail());
            profile.put("fullName", user.getFullName());
            profile.put("accountType", user.getAccountType());
            profile.put("country", user.getCountry());
            profile.put("inactivityDays", user.getInactivityDays() != null ? user.getInactivityDays() : 180);
            profile.put("lastLoginAt", user.getLastLoginAt());
            profile.put("createdAt", user.getCreatedAt());
            profile.put("isTrustVerified", user.getIsTrustVerified());

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            System.err.println("❌ [UserController] Error getting profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
