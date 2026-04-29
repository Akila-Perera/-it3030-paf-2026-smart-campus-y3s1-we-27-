package com.smartcampus.smart_campus_backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    @NotBlank
    private String resourceId;

    private String resourceName;

    @NotBlank
    private String requesterId;

    private String requesterName;

    private String requesterEmail;

    // ISO date: yyyy-MM-dd
    @NotBlank
    private String date;

    // HH:mm
    @NotBlank
    private String startTime;

    // HH:mm
    @NotBlank
    private String endTime;

    @NotBlank
    private String purpose;

    private Integer expectedAttendees;

    private BookingStatus status;

    // Reason provided by admin when rejecting.
    private String adminReason;

    private LocalDateTime createdAt;

    private LocalDateTime reviewedAt;
}
