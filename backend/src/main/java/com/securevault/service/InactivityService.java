package com.securevault.service;

import com.securevault.model.User;
import com.securevault.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InactivityService {

    // 1. Manually create the logger to fix "log cannot be resolved"
    private static final Logger log = LoggerFactory.getLogger(InactivityService.class);

    private final UserRepository userRepository;

    // 2. Manual Constructor to fix the initialization error
    public InactivityService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void checkUserInactivity() {
        log.info("Starting daily inactivity check...");

        List<User> allUsers = userRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (User user : allUsers) {
            // Ensure these methods exist in your User.java model!
            if (user.getLastLoginAt() != null && user.getInactivityDays() != null) {
                LocalDateTime thresholdDate = user.getLastLoginAt()
                        .plusDays(user.getInactivityDays());

                if (now.isAfter(thresholdDate)) {
                    triggerNomineeProcess(user);
                }
            }
        }
    }

    private void triggerNomineeProcess(User user) {
        log.warn("User {} has become inactive! Triggering nominee notification.", user.getEmail());
    }
}