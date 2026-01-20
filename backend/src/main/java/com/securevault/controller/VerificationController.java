package com.securevault.controller;

import com.securevault.model.VerificationRequest;
import com.securevault.service.VerificationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/nominee-verify")
public class VerificationController {

    private final VerificationService verificationService;

    // MANUAL CONSTRUCTOR: This tells the IDE exactly how the service is initialized
    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/confirm-identity")
    public ResponseEntity<String> confirmIdentity(
            @RequestParam UUID nomineeId, 
            @RequestParam String enteredName) {
        
        boolean isMatched = verificationService.confirmIdentity(nomineeId, enteredName);
        
        if (isMatched) {
            return ResponseEntity.ok("Identity confirmed. Proceed to document upload.");
        } else {
            return ResponseEntity.status(401).body("Name does not match our records.");
        }
    }

    @PostMapping(value = "/submit-claim", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VerificationRequest> submitClaim(
            @RequestParam UUID nomineeId,
            @RequestParam("file") MultipartFile file) throws IOException {

        VerificationRequest request = verificationService.submitClaim(nomineeId, file);
        return ResponseEntity.ok(request);
    }
}