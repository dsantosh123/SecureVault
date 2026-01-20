package com.securevault.service;

import com.securevault.model.Nominee;
import com.securevault.model.VerificationRequest;
import com.securevault.repository.NomineeRepository;
import com.securevault.repository.VerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final NomineeRepository nomineeRepository;
    private final StorageService storageService;

    // 1. Manual Constructor fixes the "not initialized" error
    public VerificationService(VerificationRepository verificationRepository, 
                               NomineeRepository nomineeRepository, 
                               StorageService storageService) {
        this.verificationRepository = verificationRepository;
        this.nomineeRepository = nomineeRepository;
        this.storageService = storageService;
    }

    public boolean confirmIdentity(UUID nomineeId, String enteredName) {
        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee record not found"));

        if (nominee.getName().equalsIgnoreCase(enteredName.trim())) {
            nominee.setIdentityConfirmed(true);
            nomineeRepository.save(nominee);
            return true;
        }
        return false;
    }

    public VerificationRequest submitClaim(UUID nomineeId, MultipartFile deathCertificate) throws IOException {
        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee not found"));

        if (!nominee.getIdentityConfirmed()) {
            throw new RuntimeException("Identity must be confirmed before uploading documents");
        }

        String fileUrl = storageService.saveFile(deathCertificate);

        // 2. Standard object creation replaces .builder()
        VerificationRequest request = new VerificationRequest();
        request.setNominee(nominee);
        request.setDeceasedUser(nominee.getUser());
        request.setDeathCertificateUrl(fileUrl);
        request.setStatus("PENDING_ADMIN_REVIEW");

        return verificationRepository.save(request);
    }
}