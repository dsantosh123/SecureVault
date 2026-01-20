package com.securevault.repository;

import com.securevault.model.Nominee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface 
NomineeRepository extends JpaRepository<Nominee, UUID> {
    
    // This helper method finds all nominees added by a specific user ID
    List<Nominee> findByUserId(UUID userId);
}