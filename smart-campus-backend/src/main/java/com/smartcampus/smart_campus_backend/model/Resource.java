package com.smartcampus.smart_campus_backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    @NotBlank
    private String name;

    private ResourceType type;

    @Min(0)
    private Integer capacity;

    private String location;

    // Daily availability window (HH:mm). Kept simple for MVP.
    private String availabilityStart;

    private String availabilityEnd;

    private ResourceStatus status;

    private LocalDateTime createdAt;
}
