package com.securevault.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "nominees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nominee {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String relationship;
    private String phoneNumber;

    private String userId;

    private Boolean identityConfirmed = false;

    // Standard getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Boolean getIdentityConfirmed() { return identityConfirmed; }
    public void setIdentityConfirmed(Boolean identityConfirmed) { this.identityConfirmed = identityConfirmed; }
}