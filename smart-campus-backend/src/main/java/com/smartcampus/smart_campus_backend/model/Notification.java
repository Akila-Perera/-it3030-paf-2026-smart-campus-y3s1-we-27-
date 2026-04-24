package com.smartcampus.smart_campus_backend.model; // නිවැරදි කළ package එක

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userId;

    private String message;

    private String type;

    private boolean isRead;

    private LocalDateTime createdAt;
}