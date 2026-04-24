package com.smartcampus.smart_campus_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "attachments")
@Data
public class Attachment {
    
    @Id
    private String id;
    
    @Field("ticket_id")
    private String ticketId;
    
    @Field("file_name")
    private String fileName;
    
    @Field("file_path")
    private String filePath;
    
    @Field("file_size")
    private Long fileSize;
    
    @Field("uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now();
}