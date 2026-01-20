package com.securevault.repository;

import com.securevault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository // Tells Spring this is the Database Access Layer
public interface UserRepository extends JpaRepository<User, UUID> {
    
    // This is a "Query Method"
    // Spring Boot will automatically write the SQL to find a user by email
    Optional<User> findByEmail(String email);
}