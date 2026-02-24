package com.securevault.config;

import com.securevault.model.User;
import com.securevault.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String adminEmail = "admin@securevault-admin.com";
        
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setFullName("System Administrator");
            admin.setPassword(passwordEncoder.encode("SecureVault@2024"));
            admin.setAccountType("ADMIN");
            admin.setRole("ADMIN");
            admin.setCountry("Global");
            admin.setInactivityDays(365);
            admin.setLastLoginAt(LocalDateTime.now());
            admin.setCreatedAt(LocalDateTime.now());
            admin.setIsTrustVerified(true);

            userRepository.save(admin);
            System.out.println("✅ Default admin user created: " + adminEmail);
        } else {
            // Ensure existing admin has correct accountType and role
            userRepository.findByEmail(adminEmail).ifPresent(existingAdmin -> {
                boolean updated = false;
                if (!"ADMIN".equalsIgnoreCase(existingAdmin.getAccountType())) {
                    existingAdmin.setAccountType("ADMIN");
                    updated = true;
                }
                if (!"ADMIN".equalsIgnoreCase(existingAdmin.getRole())) {
                    existingAdmin.setRole("ADMIN");
                    updated = true;
                }
                if (updated) {
                    userRepository.save(existingAdmin);
                    System.out.println("✅ Admin user role/accountType updated for: " + adminEmail);
                } else {
                    System.out.println("ℹ️ Admin user already exists: " + adminEmail);
                }
            });
        }
    }
}
