package com.securevault.controller;

import com.securevault.dto.AssetResponseDTO;
import com.securevault.model.Asset;
import com.securevault.service.AssetService;
import com.securevault.security.SecurityUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/assets")
public class AssetController {

    private final AssetService assetService;
    private final SecurityUtils securityUtils;

    public AssetController(AssetService assetService, SecurityUtils securityUtils) {
        this.assetService = assetService;
        this.securityUtils = securityUtils;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Asset> uploadAsset(
            @RequestParam("nomineeId") String nomineeId,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file) throws IOException {

        String userId = securityUtils.getCurrentUserId();
        Asset savedAsset = assetService.uploadAsset(userId, nomineeId, description, file);
        return ResponseEntity.ok(savedAsset);
    }

    @GetMapping("/my")
    public ResponseEntity<List<AssetResponseDTO>> getMyAssets() {
        String userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(assetService.getUserAssets(userId));
    }

    @GetMapping("/{assetId}")
    public ResponseEntity<Asset> getAsset(@PathVariable String assetId) {
        String userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(assetService.getAsset(assetId, userId));
    }

    /**
     * Update asset — ONLY description can be edited.
     * Nominee assignment/removal is handled in NomineeController.
     */
    @PutMapping("/{assetId}")
    public ResponseEntity<Asset> updateAsset(
            @PathVariable String assetId,
            @RequestParam("description") String description) {
        
        String userId = securityUtils.getCurrentUserId();
        Asset updatedAsset = assetService.updateAsset(assetId, userId, description);
        return ResponseEntity.ok(updatedAsset);
    }

    @DeleteMapping("/{assetId}")
    public ResponseEntity<Void> deleteAsset(@PathVariable String assetId) {
        String userId = securityUtils.getCurrentUserId();
        assetService.deleteAsset(assetId, userId);
        return ResponseEntity.noContent().build();
    }
}