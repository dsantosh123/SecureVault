package com.securevault.repository;

import com.securevault.model.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findAllByOrderByTimestampDesc();
    List<ActivityLog> findByUserTypeOrderByTimestampDesc(String userType);
}
