package com.securevault.service;

import com.securevault.model.Asset;
import com.securevault.model.Nominee;
import com.securevault.model.User;
import com.securevault.repository.AssetRepository;
import com.securevault.repository.NomineeRepository;
import com.securevault.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final NomineeRepository nomineeRepository;
    private final StorageService storageService;

    // Manual Constructor fixes the red lines on lines 20-23
    public AssetService(AssetRepository assetRepository, UserRepository userRepository, 
                        NomineeRepository nomineeRepository, StorageService storageService) {
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
        this.nomineeRepository = nomineeRepository;
        this.storageService = storageService;
    }

    public Asset uploadAsset(UUID userId, UUID nomineeId, String description, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee not found"));

        String s3Key = storageService.saveFile(file);

        // Standard object creation fixes the error on line 38
        Asset asset = new Asset();
        asset.setFileName(file.getOriginalFilename());
        asset.setFileType(file.getContentType());
        asset.setFileSize(file.getSize());
        asset.setS3Key(s3Key);
        asset.setDescription(description);
        asset.setUser(user);
        asset.setAssignedNominee(nominee);
        asset.setUploadedAt(LocalDateTime.now());
        asset.setIsReleased(false);

        return assetRepository.save(asset);
    }

    public List<Asset> getUserAssets(UUID userId) {
        return assetRepository.findByUserId(userId);
    }
}