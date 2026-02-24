package com.securevault.service;

import com.securevault.dto.AssetResponseDTO;
import com.securevault.model.Asset;
import com.securevault.model.Nominee;
import com.securevault.model.User;
import com.securevault.repository.AssetRepository;
import com.securevault.repository.NomineeRepository;
import com.securevault.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final NomineeRepository nomineeRepository;
    private final StorageService storageService;
    private final ActivityLogService activityLogService;

    public AssetService(AssetRepository assetRepository, UserRepository userRepository, 
                        NomineeRepository nomineeRepository, StorageService storageService,
                        ActivityLogService activityLogService) {
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
        this.nomineeRepository = nomineeRepository;
        this.storageService = storageService;
        this.activityLogService = activityLogService;
    }

    private String getUserName(String userId) {
        return userRepository.findById(userId)
                .map(User::getFullName)
                .orElse("Unknown User");
    }

    public Asset uploadAsset(String userId, String nomineeId, String description, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee not found"));

        // Ownership check: Nominee must belong to the user
        if (!nominee.getUserId().equals(userId)) {
            throw new AccessDeniedException("Nominee does not belong to the user");
        }

        String fileId = storageService.saveFile(file);

        Asset asset = new Asset();
        asset.setFileName(file.getOriginalFilename());
        asset.setFileType(file.getContentType());
        asset.setFileSize(file.getSize());
        asset.setFileId(fileId);
        asset.setDescription(description);
        asset.setUserId(userId);

        // Initialize with single nominee (can add more later via Manage Nominees)
        List<String> nomineeIds = new ArrayList<>();
        nomineeIds.add(nomineeId);
        asset.setNomineeIds(nomineeIds);

        asset.setUploadedAt(LocalDateTime.now());
        asset.setIsReleased(false);

        Asset saved = assetRepository.save(asset);
        activityLogService.log(userId, user.getFullName(), "ASSET_UPLOAD", "Uploaded asset: " + saved.getFileName(), saved.getId(), "USER");
        return saved;
    }

    public List<AssetResponseDTO> getUserAssets(String userId) {
        List<Asset> assets = assetRepository.findByUserId(userId);
        return assets.stream().map(this::mapToDTO).toList();
    }

    private AssetResponseDTO mapToDTO(Asset asset) {
        AssetResponseDTO dto = new AssetResponseDTO();
        dto.setId(asset.getId());
        dto.setFileName(asset.getFileName());
        dto.setFileType(asset.getFileType());
        dto.setFileSize(asset.getFileSize());
        dto.setDescription(asset.getDescription());
        dto.setFileId(asset.getFileId());
        dto.setUploadedAt(asset.getUploadedAt());
        dto.setIsReleased(asset.getIsReleased());

        // Fetch ALL nominees assigned to this asset
        List<AssetResponseDTO.NomineeInfo> nomineeInfoList = new ArrayList<>();
        List<String> nomineeIds = asset.getNomineeIds();
        if (nomineeIds != null && !nomineeIds.isEmpty()) {
            for (String nomineeId : nomineeIds) {
                nomineeRepository.findById(nomineeId).ifPresent(nominee -> {
                    nomineeInfoList.add(new AssetResponseDTO.NomineeInfo(
                            nominee.getId(),
                            nominee.getName(),
                            nominee.getEmail(),
                            nominee.getRelationship()
                    ));
                });
            }
        }
        dto.setNominees(nomineeInfoList);

        return dto;
    }

    /**
     * Update asset — ONLY description can be edited.
     * Nominee changes are handled separately via NomineeController.
     */
    public Asset updateAsset(String assetId, String userId, String description) {
        Asset asset = getAsset(assetId, userId);
        
        if (description != null) {
            asset.setDescription(description);
        }
        Asset saved = assetRepository.save(asset);
        activityLogService.log(userId, getUserName(userId), "ASSET_UPDATE", "Updated description for asset: " + saved.getFileName(), saved.getId(), "USER");
        return saved;
    }

    /**
     * Assign a nominee to an asset (called from Manage Nominees)
     */
    public Asset assignNomineeToAsset(String assetId, String userId, String nomineeId) {
        Asset asset = getAsset(assetId, userId);
        
        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee not found"));
        if (!nominee.getUserId().equals(userId)) {
            throw new AccessDeniedException("Nominee does not belong to the user");
        }

        List<String> nomineeIds = asset.getNomineeIds();
        if (nomineeIds == null) {
            nomineeIds = new ArrayList<>();
        }
        if (!nomineeIds.contains(nomineeId)) {
            nomineeIds.add(nomineeId);
            asset.setNomineeIds(nomineeIds);
        }

        Asset saved = assetRepository.save(asset);
        activityLogService.log(userId, getUserName(userId), "NOMINEE_ASSIGNED", "Assigned nominee " + nominee.getName() + " to asset: " + saved.getFileName(), saved.getId(), "USER");
        return saved;
    }

    /**
     * Remove a specific nominee from an asset (called from Manage Nominees)
     */
    public Asset removeNomineeFromAsset(String assetId, String userId, String nomineeId) {
        Asset asset = getAsset(assetId, userId);
        
        List<String> nomineeIds = asset.getNomineeIds();
        String nomineeName = nomineeRepository.findById(nomineeId).map(Nominee::getName).orElse("Unknown");
        if (nomineeIds != null) {
            nomineeIds.remove(nomineeId);
            asset.setNomineeIds(nomineeIds);
        }

        Asset saved = assetRepository.save(asset);
        activityLogService.log(userId, getUserName(userId), "NOMINEE_REMOVED", "Removed nominee " + nomineeName + " from asset: " + saved.getFileName(), saved.getId(), "USER");
        return saved;
    }

    public Asset getAsset(String assetId, String userId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        
        // Ownership check
        if (!asset.getUserId().equals(userId)) {
            throw new AccessDeniedException("Ownership check failed");
        }
        
        return asset;
    }

    public void deleteAsset(String assetId, String userId) {
        Asset asset = getAsset(assetId, userId);
        String fileName = asset.getFileName();
        // Delete the file from GridFS storage
        if (asset.getFileId() != null) {
            storageService.deleteFile(asset.getFileId());
        }
        // Delete asset metadata from MongoDB
        assetRepository.delete(asset);
        activityLogService.log(userId, getUserName(userId), "ASSET_DELETE", "Deleted asset: " + fileName, assetId, "USER");
    }
}