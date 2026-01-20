package com.securevault.controller;

import com.securevault.model.Asset;
import com.securevault.service.AssetService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/assets")
public class AssetController {

    private final AssetService assetService;

    // Manual Constructor (Replaces @RequiredArgsConstructor)
    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Asset> uploadAsset(
            @RequestParam("userId") UUID userId,
            @RequestParam("nomineeId") UUID nomineeId,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file) throws IOException {

        Asset savedAsset = assetService.uploadAsset(userId, nomineeId, description, file);
        return ResponseEntity.ok(savedAsset);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Asset>> getMyAssets(@PathVariable UUID userId) {
        return ResponseEntity.ok(assetService.getUserAssets(userId));
    }
}