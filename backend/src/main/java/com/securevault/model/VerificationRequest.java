package com.securevault.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verification_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationRequest {

    public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public Nominee getNominee() {
		return nominee;
	}

	public void setNominee(Nominee nominee) {
		this.nominee = nominee;
	}

	public User getDeceasedUser() {
		return deceasedUser;
	}

	public void setDeceasedUser(User deceasedUser) {
		this.deceasedUser = deceasedUser;
	}

	public String getDeathCertificateUrl() {
		return deathCertificateUrl;
	}

	public void setDeathCertificateUrl(String deathCertificateUrl) {
		this.deathCertificateUrl = deathCertificateUrl;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getAdminNotes() {
		return adminNotes;
	}

	public void setAdminNotes(String adminNotes) {
		this.adminNotes = adminNotes;
	}

	public String getRejectionReason() {
		return rejectionReason;
	}

	public void setRejectionReason(String rejectionReason) {
		this.rejectionReason = rejectionReason;
	}

	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}

	public void setSubmittedAt(LocalDateTime submittedAt) {
		this.submittedAt = submittedAt;
	}

	public LocalDateTime getReviewedAt() {
		return reviewedAt;
	}

	public void setReviewedAt(LocalDateTime reviewedAt) {
		this.reviewedAt = reviewedAt;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // The nominee who is making the claim
    @OneToOne 
    @JoinColumn(name = "nominee_id")
    private Nominee nominee;

    // The user who is reportedly deceased
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User deceasedUser;

    // Path to the death certificate saved in your StorageService
    private String deathCertificateUrl;

    // Status: PENDING_ADMIN_REVIEW, APPROVED, REJECTED, or DOCUMENTS_REQUESTED
    @Column(nullable = false)
    private String status = "PENDING_ADMIN_REVIEW";

    private String adminNotes;
    
    private String rejectionReason;

    private LocalDateTime submittedAt = LocalDateTime.now();
    
    private LocalDateTime reviewedAt;
}