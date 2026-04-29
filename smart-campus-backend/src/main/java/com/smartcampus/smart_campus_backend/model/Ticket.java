package com.smartcampus.smart_campus_backend.model;

import com.smartcampus.smart_campus_backend.model.enums.Priority;
import com.smartcampus.smart_campus_backend.model.enums.TicketStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tickets")
@Data
public class Ticket {
    
    @Id
    private String id;
    
    @Field("resource_id")
    private String resourceId;
    
    private String location;
    
    private String category;
    
    private String description;
    
    private Priority priority;
    
    private TicketStatus status = TicketStatus.OPEN;
    
    @Field("preferred_contact")
    private String preferredContact;
    
    @Field("created_by")
    private String createdBy;
    
    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("assigned_to")
    private String assignedTo;
    
    @Field("resolution_notes")
    private String resolutionNotes;
    
    @Field("rejected_reason")
    private String rejectedReason;
    
    @Field("updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // This field is not saved to MongoDB - used only for frontend display
    private List<Attachment> attachmentList = new ArrayList<>();

    public List<Attachment> getAttachmentList() {
        return attachmentList;
    }

    public void setAttachmentList(List<Attachment> attachmentList) {
        this.attachmentList = attachmentList;
    }
}