package com.securevault.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${storage.upload-dir}") // This reads "uploads/" from your application.yml
    private String uploadDir;

    public String saveFile(MultipartFile file) throws IOException {
        // 1. Create the uploads folder if it doesn't exist
        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        // 2. Give the file a unique name (to prevent overwriting)
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // 3. Save the file to the folder
        Files.copy(file.getInputStream(), root.resolve(fileName));

        return fileName; // This becomes our 's3Key' for now
    }
}