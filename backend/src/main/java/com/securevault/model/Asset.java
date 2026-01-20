package com.securevault.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String s3Key;

    private Long fileSize;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nominee_id")
    private Nominee assignedNominee;

    private LocalDateTime uploadedAt = LocalDateTime.now();
    private Boolean isReleased = false;

    // Standard Constructor
    public Asset() {}

    // GETTERS AND SETTERS (This is what fixes your Service error)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getS3Key() { return s3Key; }
    public void setS3Key(String s3Key) { this.s3Key = s3Key; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Nominee getAssignedNominee() { return assignedNominee; }
    public void setAssignedNominee(Nominee assignedNominee) { this.assignedNominee = assignedNominee; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public Boolean getIsReleased() { return isReleased; }
    public void setIsReleased(Boolean isReleased) { this.isReleased = isReleased; }
}