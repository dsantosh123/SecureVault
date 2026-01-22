package com.securevault.service;

import com.securevault.model.Nominee;
import com.securevault.model.User;
import com.securevault.repository.NomineeRepository;
import com.securevault.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class NomineeService {

    private final NomineeRepository nomineeRepository;
    private final UserRepository userRepository;

    // MANUAL CONSTRUCTOR: This fixes the "not initialized" errors
    public NomineeService(NomineeRepository nomineeRepository, UserRepository userRepository) {
        this.nomineeRepository = nomineeRepository;
        this.userRepository = userRepository;
    }

    @Transactional // Add this to ensure database consistency
    public Nominee addNominee(UUID userId, Nominee nomineeData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Logged-in user with ID " + userId + " not found"));

        // This now works because we fixed the method in the Model!
        nomineeData.setUser(user);

        return nomineeRepository.save(nomineeData);
    }

    public List<Nominee> getNomineesByUser(UUID userId) {
        return nomineeRepository.findByUserId(userId);
    }
}