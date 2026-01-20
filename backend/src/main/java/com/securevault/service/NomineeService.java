package com.securevault.service;

import com.securevault.model.Nominee;
import com.securevault.model.User;
import com.securevault.repository.NomineeRepository;
import com.securevault.repository.UserRepository;
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

    public Nominee addNominee(UUID userId, Nominee nomineeData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure you have a setUser() method in your Nominee.java model!
        nomineeData.setUser(user);

        return nomineeRepository.save(nomineeData);
    }

    public List<Nominee> getNomineesByUser(UUID userId) {
        return nomineeRepository.findByUserId(userId);
    }
}