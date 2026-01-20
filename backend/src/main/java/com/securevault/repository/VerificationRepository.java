package com.securevault.repository;

import com.securevault.model.VerificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationRepository extends JpaRepository<VerificationRequest, UUID> {
    
    // Used to find a specific claim by the nominee's ID
    Optional<VerificationRequest> findByNomineeId(UUID nomineeId);
}