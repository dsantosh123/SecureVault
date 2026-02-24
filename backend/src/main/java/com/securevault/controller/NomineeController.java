package com.securevault.controller;

import com.securevault.model.Asset;
import com.securevault.model.Nominee;
import com.securevault.service.AssetService;
import com.securevault.service.NomineeService;
import com.securevault.security.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/nominees")
public class NomineeController {

    private final NomineeService nomineeService;
    private final AssetService assetService;
    private final SecurityUtils securityUtils;

    public NomineeController(NomineeService nomineeService, AssetService assetService, SecurityUtils securityUtils) {
        this.nomineeService = nomineeService;
        this.assetService = assetService;
        this.securityUtils = securityUtils;
    }

    @PostMapping("/add")
    public ResponseEntity<Nominee> addNominee(@Valid @RequestBody Nominee nominee) {
        String userId = securityUtils.getCurrentUserId();
        Nominee savedNominee = nomineeService.addNominee(userId, nominee);
        return ResponseEntity.ok(savedNominee);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Nominee>> getMyNominees() {
        String userId = securityUtils.getCurrentUserId();
        List<Nominee> nominees = nomineeService.getNomineesByUser(userId);
        return ResponseEntity.ok(nominees);
    }

    /**
     * Update nominee details
     */
    @PutMapping("/{nomineeId}")
    public ResponseEntity<Nominee> updateNominee(@PathVariable String nomineeId, @Valid @RequestBody Nominee nominee) {
        String userId = securityUtils.getCurrentUserId();
        Nominee updated = nomineeService.updateNominee(nomineeId, userId, nominee);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a nominee completely (also removes from all assets).
     */
    @DeleteMapping("/{nomineeId}")
    public ResponseEntity<Void> deleteNominee(@PathVariable String nomineeId) {
        String userId = securityUtils.getCurrentUserId();
        nomineeService.deleteNominee(nomineeId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Assign a nominee to an asset.
     * POST /nominees/{nomineeId}/assign/{assetId}
     */
    @PostMapping("/{nomineeId}/assign/{assetId}")
    public ResponseEntity<?> assignNomineeToAsset(
            @PathVariable String nomineeId,
            @PathVariable String assetId) {
        String userId = securityUtils.getCurrentUserId();
        Asset updatedAsset = assetService.assignNomineeToAsset(assetId, userId, nomineeId);
        return ResponseEntity.ok(Map.of(
            "message", "Nominee assigned successfully",
            "assetId", updatedAsset.getId(),
            "nomineeIds", updatedAsset.getNomineeIds()
        ));
    }

    /**
     * Remove a specific nominee from an asset (without deleting the nominee).
     * DELETE /nominees/{nomineeId}/unassign/{assetId}
     */
    @DeleteMapping("/{nomineeId}/unassign/{assetId}")
    public ResponseEntity<?> removeNomineeFromAsset(
            @PathVariable String nomineeId,
            @PathVariable String assetId) {
        String userId = securityUtils.getCurrentUserId();
        Asset updatedAsset = assetService.removeNomineeFromAsset(assetId, userId, nomineeId);
        return ResponseEntity.ok(Map.of(
            "message", "Nominee removed from asset",
            "assetId", updatedAsset.getId(),
            "nomineeIds", updatedAsset.getNomineeIds()
        ));
    }
}