package com.securevault.service;

import com.securevault.model.Asset;
import com.securevault.model.Nominee;
import com.securevault.model.User;
import com.securevault.repository.AssetRepository;
import com.securevault.repository.NomineeRepository;
import com.securevault.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NomineeService {

    private final NomineeRepository nomineeRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;

    public NomineeService(NomineeRepository nomineeRepository, UserRepository userRepository,
                          AssetRepository assetRepository) {
        this.nomineeRepository = nomineeRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
    }

    public Nominee addNominee(String userId, Nominee nomineeData) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        nomineeData.setUserId(userId);
        return nomineeRepository.save(nomineeData);
    }

    public List<Nominee> getNomineesByUser(String userId) {
        return nomineeRepository.findByUserId(userId);
    }

    public Nominee getNomineeById(String nomineeId) {
        return nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee not found"));
    }

    /**
     * Delete a nominee completely.
     * Also removes this nominee from all assets that reference it.
     */
    public void deleteNominee(String nomineeId, String userId) {
        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee not found"));

        if (!nominee.getUserId().equals(userId)) {
            throw new AccessDeniedException("Nominee does not belong to the user");
        }

        // Remove this nominee from all assets that reference it
        List<Asset> userAssets = assetRepository.findByUserId(userId);
        for (Asset asset : userAssets) {
            List<String> nomineeIds = asset.getNomineeIds();
            if (nomineeIds != null && nomineeIds.contains(nomineeId)) {
                nomineeIds.remove(nomineeId);
                asset.setNomineeIds(nomineeIds);
                assetRepository.save(asset);
            }
        }

        // Delete the nominee record
        nomineeRepository.delete(nominee);
    }

    /**
     * Update nominee details (name, email, relationship, phone)
     */
    public Nominee updateNominee(String nomineeId, String userId, Nominee updatedData) {
        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> new RuntimeException("Nominee not found"));

        if (!nominee.getUserId().equals(userId)) {
            throw new AccessDeniedException("Nominee does not belong to the user");
        }

        if (updatedData.getName() != null) nominee.setName(updatedData.getName());
        if (updatedData.getEmail() != null) nominee.setEmail(updatedData.getEmail());
        if (updatedData.getRelationship() != null) nominee.setRelationship(updatedData.getRelationship());
        if (updatedData.getPhoneNumber() != null) nominee.setPhoneNumber(updatedData.getPhoneNumber());

        return nomineeRepository.save(nominee);
    }
}