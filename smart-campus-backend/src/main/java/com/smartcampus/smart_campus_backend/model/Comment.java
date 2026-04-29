package com.smartcampus.smart_campus_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "comments")
@Data
public class Comment {
    
    @Id
    private String id;
    
    @Field("ticket_id")
    private String ticketId;
    
    @Field("user_id")
    private String userId;
    
    @Field("user_role")
    private String userRole;
    
    private String content;
    
    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}