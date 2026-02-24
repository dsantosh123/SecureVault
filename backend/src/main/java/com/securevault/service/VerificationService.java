package com.securevault.service;

import com.securevault.model.Nominee;
import com.securevault.model.User;
import com.securevault.model.VerificationRequest;
import com.securevault.dto.VerificationRequestResponseDTO;
import com.securevault.repository.NomineeRepository;
import com.securevault.repository.VerificationRepository;
import com.securevault.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final NomineeRepository nomineeRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final ActivityLogService activityLogService;

    public VerificationService(VerificationRepository verificationRepository, 
                               NomineeRepository nomineeRepository, 
                               UserRepository userRepository,
                               StorageService storageService,
                               ActivityLogService activityLogService) {
        this.verificationRepository = verificationRepository;
        this.nomineeRepository = nomineeRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
        this.activityLogService = activityLogService;
    }

    public boolean confirmIdentity(String nomineeId, String enteredName) {
        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee record not found"));

        if (nominee.getName().equalsIgnoreCase(enteredName.trim())) {
            nominee.setIdentityConfirmed(true);
            nomineeRepository.save(nominee);
            activityLogService.log(nomineeId, nominee.getName(), "NOMINEE_IDENTITY_CONFIRMED", "Nominee confirmed their identity", nomineeId, "NOMINEE");
            return true;
        }
        activityLogService.log(nomineeId, enteredName, "NOMINEE_IDENTITY_FAILED", "Failed identity confirmation attempt", nomineeId, "NOMINEE");
        return false;
    }

    public VerificationRequest submitClaim(String nomineeId, MultipartFile deathCertificate) throws IOException {
        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee not found"));

        if (!nominee.getIdentityConfirmed()) {
            throw new RuntimeException("Identity must be confirmed before uploading documents");
        }

        String fileId = storageService.saveFile(deathCertificate);

        VerificationRequest request = new VerificationRequest();
        request.setNomineeId(nomineeId);
        request.setDeceasedUserId(nominee.getUserId());
        request.setDeathCertificateFileId(fileId);
        request.setStatus("PENDING_ADMIN_REVIEW");
        request.setSubmittedAt(LocalDateTime.now());

        VerificationRequest saved = verificationRepository.save(request);
        activityLogService.log(nomineeId, nominee.getName(), "NOMINEE_CLAIM_SUBMITTED", "Submitted death certificate and claim", saved.getId(), "NOMINEE");
        return saved;
    }

    public VerificationRequest reviewRequest(String requestId, String status, String notes, String rejectionReason) {
        VerificationRequest request = verificationRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Verification request not found"));

        request.setStatus(status);
        request.setAdminNotes(notes);
        request.setRejectionReason(rejectionReason);
        request.setReviewedAt(LocalDateTime.now());

        if ("APPROVED".equals(status)) {
            // Logic for approved request
        }

        VerificationRequest saved = verificationRepository.save(request);
        
        activityLogService.log("SYSTEM_ADMIN", "Admin", "VERIFICATION_REVIEW", 
                "Reviewed request: " + status + (notes != null ? " - " + notes : ""), 
                saved.getId(), "ADMIN");
                
        return saved;
    }

    public Map<String, Object> getVerificationStatus(String nomineeId) {
        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee not found"));
        
        Optional<VerificationRequest> requestOpt = verificationRepository.findByNomineeId(nomineeId);
        
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> timeline = new ArrayList<>();
        
        // 1. Link Created
        timeline.add(createTimelineStep("Verification Link Created", "COMPLETED", null));
        
        // 2. Identity Confirmation
        timeline.add(createTimelineStep("Identity Confirmation", nominee.getIdentityConfirmed() ? "COMPLETED" : "IN_PROGRESS", null));
        
        // 3. Document Submission
        String docStatus = "PENDING";
        if (requestOpt.isPresent()) {
            docStatus = "COMPLETED";
        } else if (nominee.getIdentityConfirmed()) {
            docStatus = "IN_PROGRESS";
        }
        timeline.add(createTimelineStep("Document Submission", docStatus, null));
        
        // 4. Admin Review
        String reviewStatus = "PENDING";
        if (requestOpt.isPresent()) {
            String status = requestOpt.get().getStatus();
            if (status.equals("APPROVED") || status.equals("REJECTED")) {
                reviewStatus = "COMPLETED";
            } else {
                reviewStatus = "IN_PROGRESS";
            }
        }
        timeline.add(createTimelineStep("Admin Review", reviewStatus, null));

        response.put("status", requestOpt.isPresent() ? requestOpt.get().getStatus() : (nominee.getIdentityConfirmed() ? "AWAITING_DOCUMENTS" : "IDENTITY_CONFIRMED"));
        response.put("timeline", timeline);
        response.put("verificationId", requestOpt.isPresent() ? requestOpt.get().getId() : "PENDING");
        
        Map<String, String> nomineeInfo = new HashMap<>();
        nomineeInfo.put("name", nominee.getName());
        nomineeInfo.put("relationship", nominee.getRelationship());
        nomineeInfo.put("deceasedName", "Asset Owner"); 
        response.put("nomineeInfo", nomineeInfo);
        
        return response;
    }

    public List<VerificationRequestResponseDTO> getAllRequestsDetailed() {
        return verificationRepository.findAll().stream().map(request -> {
            Nominee nominee = nomineeRepository.findById(request.getNomineeId()).orElse(null);
            User user = userRepository.findById(request.getDeceasedUserId()).orElse(null);
            
            VerificationRequestResponseDTO responseDTO = new VerificationRequestResponseDTO();
            responseDTO.setId(request.getId());
            responseDTO.setNomineeId(request.getNomineeId());
            responseDTO.setNomineeName(nominee != null ? nominee.getName() : "Unknown");
            responseDTO.setNomineeEmail(nominee != null ? nominee.getEmail() : "Unknown");
            responseDTO.setNomineePhone(nominee != null ? nominee.getPhoneNumber() : "N/A");
            responseDTO.setRelationship(nominee != null ? nominee.getRelationship() : "N/A");
            responseDTO.setDeceasedUserId(request.getDeceasedUserId());
            responseDTO.setDeceasedUserName(user != null ? user.getFullName() : "Unknown User");
            responseDTO.setDeathCertificateFileId(request.getDeathCertificateFileId());
            responseDTO.setStatus(request.getStatus());
            responseDTO.setAdminNotes(request.getAdminNotes());
            responseDTO.setRejectionReason(request.getRejectionReason());
            responseDTO.setSubmittedAt(request.getSubmittedAt());
            responseDTO.setReviewedAt(request.getReviewedAt());
            return responseDTO;
        }).collect(Collectors.toList());
    }

    public List<VerificationRequest> getAllRequests() {
        return verificationRepository.findAll();
    }

    private Map<String, Object> createTimelineStep(String step, String status, String message) {
        Map<String, Object> map = new HashMap<>();
        map.put("step", step);
        map.put("status", status);
        if (message != null) map.put("message", message);
        return map;
    }
}