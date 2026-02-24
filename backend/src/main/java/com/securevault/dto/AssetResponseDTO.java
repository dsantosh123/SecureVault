package com.securevault.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AssetResponseDTO {
    private String id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String description;
    private String fileId;

    // Multiple nominees support
    private List<NomineeInfo> nominees;

    private LocalDateTime uploadedAt;
    private Boolean isReleased;

    public static class NomineeInfo {
        private String id;
        private String name;
        private String email;
        private String relationship;

        public NomineeInfo() {}

        public NomineeInfo(String id, String name, String email, String relationship) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.relationship = relationship;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRelationship() { return relationship; }
        public void setRelationship(String relationship) { this.relationship = relationship; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }

    public List<NomineeInfo> getNominees() { return nominees != null ? nominees : new ArrayList<>(); }
    public void setNominees(List<NomineeInfo> nominees) { this.nominees = nominees; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public Boolean getIsReleased() { return isReleased; }
    public void setIsReleased(Boolean isReleased) { this.isReleased = isReleased; }
}
