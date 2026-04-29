package com.smartcampus.smart_campus_backend.controller;

import com.smartcampus.smart_campus_backend.model.Attachment;
import com.smartcampus.smart_campus_backend.model.Ticket;
import com.smartcampus.smart_campus_backend.repository.AttachmentRepository;
import com.smartcampus.smart_campus_backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;

    @GetMapping("/{attachmentId}")
    public ResponseEntity<?> getAttachment(
            @PathVariable String attachmentId,
            @RequestParam String userId,
            @RequestParam String role) {
        
        try {
            Optional<Attachment> attachmentOpt = attachmentRepository.findById(attachmentId);
            
            if (attachmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Attachment attachment = attachmentOpt.get();
            
            Optional<Ticket> ticketOpt = ticketRepository.findById(attachment.getTicketId());
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Ticket ticket = ticketOpt.get();
            
            if ("TECHNICIAN".equals(role)) {
                if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().equals(userId)) {
                    return ResponseEntity.status(403).body("Access denied");
                }
            }
            
            if ("USER".equals(role)) {
                if (!ticket.getCreatedBy().equals(userId)) {
                    return ResponseEntity.status(403).body("Access denied");
                }
            }
            
            Path filePath = Paths.get(attachment.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            String contentType = determineContentType(attachment.getFileName());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + attachment.getFileName() + "\"")
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private String determineContentType(String fileName) {
        if (fileName.endsWith(".png")) return "image/png";
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
        if (fileName.endsWith(".gif")) return "image/gif";
        return "image/jpeg";
    }
}