package com.securevault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponseDTO {
    
	private String id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime lastLoginAt;
    private Integer inactivityDays;
    private Long assetCount;
    private Long nomineeCount;
    
    public AdminUserResponseDTO(
            String id,
            String name,
            String email,
            String role,
            LocalDateTime lastLoginAt,
            Integer inactivityDays,
            Long assetCount,
            Long nomineeCount
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.lastLoginAt = lastLoginAt;
        this.inactivityDays = inactivityDays;
        this.assetCount = assetCount;
        this.nomineeCount = nomineeCount;
    }
}
