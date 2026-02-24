//package com.securevault.service;
//
//import com.amazonaws.HttpMethod;
//import com.amazonaws.services.s3.AmazonS3;
//import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
//import com.amazonaws.services.s3.model.ObjectMetadata;
//import com.amazonaws.services.s3.model.PutObjectRequest;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.net.URL;
//import java.util.Date;
//import java.util.UUID;
//
//@Service
//public class S3Service {
//
//    private final AmazonS3 s3Client;
//
//    @Value("${aws.s3.bucket-name}")
//    private String bucketName;
//
//    public S3Service(AmazonS3 s3Client) {
//        this.s3Client = s3Client;
//    }
//
//    public String uploadFile(MultipartFile file) throws IOException {
//        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
//        ObjectMetadata metadata = new ObjectMetadata();
//        metadata.setContentLength(file.getSize());
//        metadata.setContentType(file.getContentType());
//
//        s3Client.putObject(new PutObjectRequest(bucketName, fileName, file.getInputStream(), metadata));
//        return fileName;
//    }
//
//    public String generatePresignedUrl(String s3Key) {
//        Date expiration = new Date();
//        long expTimeMillis = expiration.getTime();
//        expTimeMillis += 1000 * 60 * 60; // 1 hour
//        expiration.setTime(expTimeMillis);
//
//        GeneratePresignedUrlRequest generatePresignedUrlRequest =
//                new GeneratePresignedUrlRequest(bucketName, s3Key)
//                        .withMethod(HttpMethod.GET)
//                        .withExpiration(expiration);
//
//        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
//        return url.toString();
//    }
//
//    public void deleteFile(String s3Key) {
//        s3Client.deleteObject(bucketName, s3Key);
//    }
//}
