package com.securevault.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    private String id;

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "File type is required")
    private String fileType;

    @NotBlank(message = "File ID is required")
    private String fileId;

    private Long fileSize;
    private String description;

    private String userId;

    // Support multiple nominees per asset
    private List<String> nomineeIds = new ArrayList<>();

    private LocalDateTime uploadedAt = LocalDateTime.now();
    private Boolean isReleased = false;

    // Standard getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<String> getNomineeIds() { return nomineeIds != null ? nomineeIds : new ArrayList<>(); }
    public void setNomineeIds(List<String> nomineeIds) { this.nomineeIds = nomineeIds != null ? nomineeIds : new ArrayList<>(); }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public Boolean getIsReleased() { return isReleased; }
    public void setIsReleased(Boolean isReleased) { this.isReleased = isReleased; }
}
