package com.securevault.controller;

import com.securevault.dto.AdminUserResponseDTO;
import com.securevault.dto.VerificationRequestResponseDTO;
import com.securevault.model.User;
import com.securevault.model.VerificationRequest;
import com.securevault.model.ActivityLog;
import com.securevault.repository.AssetRepository;
import com.securevault.repository.NomineeRepository;
import com.securevault.service.UserService;
import com.securevault.service.VerificationService;
import com.securevault.service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final VerificationService verificationService;
    private final UserService userService;
    private final AssetRepository assetRepository;
    private final NomineeRepository nomineeRepository;
    private final ActivityLogService activityLogService;

    public AdminController(VerificationService verificationService, UserService userService, 
                           AssetRepository assetRepository, NomineeRepository nomineeRepository,
                           ActivityLogService activityLogService) {
        this.verificationService = verificationService;
        this.userService = userService;
        this.assetRepository = assetRepository;
        this.nomineeRepository = nomineeRepository;
        this.activityLogService = activityLogService;
    }

    @GetMapping("/logs")
    public ResponseEntity<List<ActivityLog>> getActivityLogs() {
        // Return only USER and NOMINEE activities, per requirement
        List<ActivityLog> logs = activityLogService.getNonAdminLogs().stream()
                .filter(log -> !"ADMIN".equalsIgnoreCase(log.getUserType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/verification-requests")
    public ResponseEntity<List<VerificationRequestResponseDTO>> getVerificationRequests() {
        return ResponseEntity.ok(verificationService.getAllRequestsDetailed());
    }

    @PutMapping("/verification-requests/{id}/review")
    public ResponseEntity<VerificationRequest> reviewRequest(
            @PathVariable String id,
            @RequestBody Map<String, String> reviewData) {
        
        String status = reviewData.get("status");
        String notes = reviewData.get("notes");
        String reason = reviewData.get("rejectionReason");
        
        VerificationRequest updated = verificationService.reviewRequest(id, status, notes, reason);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponseDTO>> getAllUsers() {
        List<AdminUserResponseDTO> users = userService.getAllUsers()
                .stream()
                .map(u -> new AdminUserResponseDTO(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getRole() != null ? u.getRole() : "USER",
                        u.getLastLoginAt(),
                        u.getInactivityDays(),
                        (long) assetRepository.findByUserId(u.getId()).size(),
                        (long) nomineeRepository.findByUserId(u.getId()).size()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        List<User> users = userService.getAllUsers();
        List<VerificationRequest> requests = verificationService.getAllRequests();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("activeUsers", users.stream().filter(u -> u.getLastLoginAt() != null).count());
        stats.put("totalAssets", assetRepository.count());
        stats.put("totalVerifications", requests.size());
        stats.put("pendingVerifications", requests.stream().filter(r -> "PENDING_ADMIN_REVIEW".equals(r.getStatus())).count());
        stats.put("approvedVerifications", requests.stream().filter(r -> "APPROVED".equals(r.getStatus())).count());
        stats.put("rejectedVerifications", requests.stream().filter(r -> "REJECTED".equals(r.getStatus())).count());
        stats.put("systemUptime", "99.99%"); 
        
        return ResponseEntity.ok(stats);
    }
}
