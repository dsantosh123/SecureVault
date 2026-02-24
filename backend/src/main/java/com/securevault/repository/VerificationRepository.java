package com.securevault.repository;

import com.securevault.model.VerificationRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VerificationRepository extends MongoRepository<VerificationRequest, String> {
    
    Optional<VerificationRequest> findByNomineeId(String nomineeId);
}