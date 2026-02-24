package com.securevault.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🔍 [SecurityUtils] Current Authentication: " + (authentication != null ? authentication.getClass().getSimpleName() : "null"));
        if (authentication != null) {
            System.out.println("   - Is Authenticated: " + authentication.isAuthenticated());
            System.out.println("   - Principal: " + authentication.getPrincipal());
        }

        if (authentication != null && authentication.isAuthenticated()) {
            return (String) authentication.getPrincipal();
        }
        throw new RuntimeException("User not authenticated");
    }
}
