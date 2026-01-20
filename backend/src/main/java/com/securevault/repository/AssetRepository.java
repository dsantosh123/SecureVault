package com.securevault.repository;

import com.securevault.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AssetRepository extends JpaRepository<Asset, UUID> {
    
    // Find all assets belonging to a user
    List<Asset> findByUserId(UUID userId);

    // Find all assets assigned to a specific nominee
    List<Asset> findByAssignedNomineeId(UUID nomineeId);
}