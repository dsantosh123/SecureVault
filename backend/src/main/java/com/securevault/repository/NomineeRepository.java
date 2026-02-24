package com.securevault.repository;

import com.securevault.model.Nominee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NomineeRepository extends MongoRepository<Nominee, String> {
    
    List<Nominee> findByUserId(String userId);
}