package com.securevault.dto;

import java.time.LocalDateTime;

public class VerificationRequestResponseDTO {
    private String id;
    private String nomineeId;
    private String nomineeName;
    private String nomineeEmail;
    private String nomineePhone;
    private String relationship;
    
    private String deceasedUserId;
    private String deceasedUserName;
    
    private String deathCertificateFileId;
    private String status;
    private String adminNotes;
    private String rejectionReason;
    
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;

    public VerificationRequestResponseDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNomineeId() { return nomineeId; }
    public void setNomineeId(String nomineeId) { this.nomineeId = nomineeId; }
    public String getNomineeName() { return nomineeName; }
    public void setNomineeName(String nomineeName) { this.nomineeName = nomineeName; }
    public String getNomineeEmail() { return nomineeEmail; }
    public void setNomineeEmail(String nomineeEmail) { this.nomineeEmail = nomineeEmail; }
    public String getNomineePhone() { return nomineePhone; }
    public void setNomineePhone(String nomineePhone) { this.nomineePhone = nomineePhone; }
    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public String getDeceasedUserId() { return deceasedUserId; }
    public void setDeceasedUserId(String deceasedUserId) { this.deceasedUserId = deceasedUserId; }
    public String getDeceasedUserName() { return deceasedUserName; }
    public void setDeceasedUserName(String deceasedUserName) { this.deceasedUserName = deceasedUserName; }
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
