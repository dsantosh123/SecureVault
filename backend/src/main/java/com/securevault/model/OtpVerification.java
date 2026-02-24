package com.securevault.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "otp_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {
    @Id
    private String id;
    
    private String email;
    private String otp;
    private LocalDateTime expiryTime;
    private boolean verified;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    
    public LocalDateTime getExpiryTime() { return expiryTime; }
    public void setExpiryTime(LocalDateTime expiryTime) { this.expiryTime = expiryTime; }
    
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}