package com.securevault.controller;

import com.securevault.model.Nominee;
import com.securevault.model.User;
import com.securevault.model.VerificationRequest;
import com.securevault.service.NomineeService;
import com.securevault.service.UserService;
import com.securevault.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/verification")
public class VerificationController {

    private final VerificationService verificationService;
    private final NomineeService nomineeService;
    private final UserService userService;

    public VerificationController(VerificationService verificationService, NomineeService nomineeService, UserService userService) {
        this.verificationService = verificationService;
        this.nomineeService = nomineeService;
        this.userService = userService;
    }

    /**
     * Mock verification for testing the flow.
     */
    @GetMapping("/verify-token")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestParam String token) {
        try {
            Nominee nominee = nomineeService.getNomineeById(token);
            User deceasedUser = userService.getUserById(nominee.getUserId());

            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("expiresAt", LocalDateTime.now().plusMinutes(30).toString());
            response.put("nomineeId", nominee.getId());
            response.put("userId", nominee.getUserId());
            response.put("deceasedName", deceasedUser.getFullName());
            response.put("nomineeNameExpected", nominee.getName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("valid", false);
            errorResponse.put("error", "Invalid or expired verification link");
            return ResponseEntity.status(404).body(errorResponse);
        }
    }

    @PostMapping("/confirm-identity")
    public ResponseEntity<Map<String, Object>> confirmIdentity(@RequestBody Map<String, String> request) {
        String nomineeId = request.get("nomineeId");
        String fullName = request.get("fullName");

        boolean success = verificationService.confirmIdentity(nomineeId, fullName);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        
        if (success) {
            response.put("message", "Identity confirmed successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Identity confirmation failed. Name does not match records.");
            return ResponseEntity.status(400).body(response);
        }
    }

    @PostMapping("/submit-claim")
    public ResponseEntity<VerificationRequest> submitClaim(
            @RequestParam("nomineeId") String nomineeId,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        VerificationRequest claim = verificationService.submitClaim(nomineeId, file);
        return ResponseEntity.ok(claim);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus(@RequestParam String token) {
        Map<String, Object> status = verificationService.getVerificationStatus(token);
        return ResponseEntity.ok(status);
    }
}