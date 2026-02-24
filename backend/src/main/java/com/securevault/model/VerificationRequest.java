package com.securevault.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "verification_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationRequest {

    @Id
    private String id;

    // The ID of the nominee who is making the claim
    private String nomineeId;

    // The ID of the user who is reportedly deceased
    private String deceasedUserId;

    // GridFS ObjectId of the death certificate
    private String deathCertificateFileId;

    // Status: PENDING_ADMIN_REVIEW, APPROVED, REJECTED, or DOCUMENTS_REQUESTED
    private String status = "PENDING_ADMIN_REVIEW";

    private String adminNotes;
    private String rejectionReason;

    private LocalDateTime submittedAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;

    // Standard getters and setters 
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNomineeId() { return nomineeId; }
    public void setNomineeId(String nomineeId) { this.nomineeId = nomineeId; }

    public String getDeceasedUserId() { return deceasedUserId; }
    public void setDeceasedUserId(String deceasedUserId) { this.deceasedUserId = deceasedUserId; }

    public String getDeathCertificateFileId() { return deathCertificateFileId; }
    public void setDeathCertificateFileId(String deathCertificateFileId) { this.deathCertificateFileId = deathCertificateFileId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}