package com.securevault.repository;

import com.securevault.model.Asset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssetRepository extends MongoRepository<Asset, String> {
    
    // Find all assets belonging to a user
    List<Asset> findByUserId(String userId);

    // Find all assets assigned to a specific nominee (nomineeIds is a list)
    List<Asset> findByNomineeIdsContaining(String nomineeId);
}