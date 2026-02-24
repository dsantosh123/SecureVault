package com.securevault.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String accountType;
    private String country;
    private Integer inactivityDays;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt = LocalDateTime.now();
    private Boolean isTrustVerified = false;
    private String role = "USER"; // Default role

    // Standard getters and setters (Lombok @Data handles most, 
    // but keeping explicit ones if they were being used specifically)
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public Integer getInactivityDays() { return inactivityDays; }
    public void setInactivityDays(Integer inactivityDays) { this.inactivityDays = inactivityDays; }
    
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Boolean getIsTrustVerified() { return isTrustVerified; }
    public void setIsTrustVerified(Boolean isTrustVerified) { this.isTrustVerified = isTrustVerified; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
