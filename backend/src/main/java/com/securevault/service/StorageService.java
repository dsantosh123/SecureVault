package com.securevault.service;

import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.bson.types.ObjectId;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class StorageService {

    private final GridFsTemplate gridFsTemplate;

    public StorageService(GridFsTemplate gridFsTemplate) {
        this.gridFsTemplate = gridFsTemplate;
    }

    /**
     * Saves a file to MongoDB Atlas using GridFS
     * @param file The file to save
     * @return The unique ObjectId (as String) of the saved file
     */
    public String saveFile(MultipartFile file) throws IOException {
        // Store the file in GridFS and get the generated ID
        ObjectId fileId = gridFsTemplate.store(
            file.getInputStream(), 
            file.getOriginalFilename(), 
            file.getContentType()
        );

        return fileId.toString();
    }

    /**
     * Retrieves a file from MongoDB GridFS as a Resource
     * @param fileId The ObjectId string
     * @return GridFsResource
     */
    public org.springframework.data.mongodb.gridfs.GridFsResource getFileResource(String fileId) {
        com.mongodb.client.gridfs.model.GridFSFile file = gridFsTemplate.findOne(query(where("_id").is(new ObjectId(fileId))));
        if (file == null) {
            throw new RuntimeException("File not found with ID: " + fileId);
        }
        return gridFsTemplate.getResource(file);
    }

    /**
     * Deletes a file from MongoDB GridFS by its ObjectId string
     * @param fileId The ObjectId string of the file to delete
     */
    public void deleteFile(String fileId) {
        try {
            gridFsTemplate.delete(query(where("_id").is(new ObjectId(fileId))));
        } catch (Exception e) {
            // Log but don't throw — asset metadata deletion should still proceed
            System.err.println("Warning: Could not delete GridFS file " + fileId + ": " + e.getMessage());
        }
    }
}
