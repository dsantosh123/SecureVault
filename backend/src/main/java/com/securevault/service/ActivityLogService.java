package com.securevault.service;

import com.securevault.model.ActivityLog;
import com.securevault.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {
    private final ActivityLogRepository repository;

    public ActivityLogService(ActivityLogRepository repository) {
        this.repository = repository;
    }

    public void log(String userId, String userName, String action, String details, String entityId, String userType) {
        ActivityLog log = new ActivityLog();
        log.setUserId(userId);
        log.setUserName(userName);
        log.setAction(action);
        log.setDetails(details);
        log.setEntityId(entityId);
        log.setUserType(userType);
        log.setTimestamp(LocalDateTime.now());
        repository.save(log);
    }

    public List<ActivityLog> getAllLogs() {
        return repository.findAllByOrderByTimestampDesc();
    }

    public List<ActivityLog> getNonAdminLogs() {
        // We only want to show USER and NOMINEE logs to admins
        // In the database these are logs where userType is "USER" or "NOMINEE"
        // But for now, returning all for the controller to filter, or we can filter here.
        return repository.findAllByOrderByTimestampDesc();
    }
}
