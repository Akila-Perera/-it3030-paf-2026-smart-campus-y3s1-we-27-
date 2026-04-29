package com.smartcampus.smart_campus_backend.service;

import com.smartcampus.smart_campus_backend.model.Ticket;
import com.smartcampus.smart_campus_backend.model.Comment;
import com.smartcampus.smart_campus_backend.model.Attachment;
import com.smartcampus.smart_campus_backend.model.enums.TicketStatus;
import com.smartcampus.smart_campus_backend.model.enums.Priority;
import com.smartcampus.smart_campus_backend.repository.TicketRepository;
import com.smartcampus.smart_campus_backend.repository.CommentRepository;
import com.smartcampus.smart_campus_backend.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;

    private final String uploadDir = "./uploads/";

    @PostConstruct
    public void init() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created upload directory: " + uploadDir);
            }
        } catch (IOException e) {
            System.err.println("Could not create upload directory: " + e.getMessage());
        }
    }

    // 1. Create a new ticket
    public Ticket createTicket(String resourceId, String location, String category, 
                               String description, String priority, String preferredContact, 
                               String createdBy, List<MultipartFile> attachments) throws IOException {
        
        System.out.println("=== Creating new ticket ===");
        System.out.println("ResourceId: " + resourceId);
        System.out.println("Category: " + category);
        System.out.println("Priority: " + priority);
        
        Ticket ticket = new Ticket();
        ticket.setResourceId(resourceId);
        ticket.setLocation(location);
        ticket.setCategory(category);
        ticket.setDescription(description);
        ticket.setPriority(Priority.valueOf(priority));
        ticket.setPreferredContact(preferredContact);
        ticket.setCreatedBy(createdBy);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);
        System.out.println("Ticket saved with ID: " + savedTicket.getId());

        // Save attachments (max 3)
        if (attachments != null && !attachments.isEmpty()) {
            System.out.println("Processing " + attachments.size() + " attachments...");
            int count = 0;
            for (MultipartFile file : attachments) {
                if (count >= 3) {
                    System.out.println("Max 3 attachments reached, stopping...");
                    break;
                }
                if (file != null && !file.isEmpty()) {
                    try {
                        System.out.println("Saving file: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");
                        String filePath = saveFile(file, savedTicket.getId());
                        Attachment attachment = new Attachment();
                        attachment.setTicketId(savedTicket.getId());
                        attachment.setFileName(file.getOriginalFilename());
                        attachment.setFilePath(filePath);
                        attachment.setFileSize(file.getSize());
                        attachment.setUploadedAt(LocalDateTime.now());
                        attachmentRepository.save(attachment);
                        System.out.println("File saved successfully: " + filePath);
                        count++;
                    } catch (Exception e) {
                        System.err.println("Error saving attachment: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            }
            System.out.println("Saved " + count + " attachments");
        }

        // Load attachments for the saved ticket before returning
        List<Attachment> savedAttachments = attachmentRepository.findByTicketId(savedTicket.getId());
        savedTicket.setAttachmentList(savedAttachments);

        return savedTicket;
    }

    // 2. Get all tickets (filter by role) - UPDATED with attachments
    public List<Ticket> getTickets(String userId, String role, String status, String category, String priority) {
        List<Ticket> tickets;
        
        if ("ADMIN".equals(role)) {
            if (status != null) {
                tickets = ticketRepository.findByStatus(TicketStatus.valueOf(status));
            } else {
                tickets = ticketRepository.findAll();
            }
        } else if ("TECHNICIAN".equals(role)) {
            tickets = ticketRepository.findByAssignedTo(userId);
        } else {
            tickets = ticketRepository.findByCreatedBy(userId);
        }
        
        // Load attachments for each ticket
        for (Ticket ticket : tickets) {
            List<Attachment> attachments = attachmentRepository.findByTicketId(ticket.getId());
            ticket.setAttachmentList(attachments);
        }
        
        return tickets;
    }

    // 3. Get single ticket by ID - UPDATED with attachments
    public Ticket getTicketById(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));
        
        // Load attachments for this ticket
        List<Attachment> attachments = attachmentRepository.findByTicketId(ticketId);
        ticket.setAttachmentList(attachments);
        
        return ticket;
    }

    // 4. Update ticket status
    public Ticket updateStatus(String ticketId, String status, String resolutionNotes, 
                               String rejectedReason, String userId, String role) {
        
        Ticket ticket = getTicketById(ticketId);
        TicketStatus newStatus = TicketStatus.valueOf(status);

        // Authorization checks
        if (newStatus == TicketStatus.REJECTED && !"ADMIN".equals(role)) {
            throw new RuntimeException("Only admins can reject tickets");
        }

        if ((newStatus == TicketStatus.IN_PROGRESS || newStatus == TicketStatus.RESOLVED) 
                && ticket.getAssignedTo() != null && !ticket.getAssignedTo().equals(userId)) {
            if (!"ADMIN".equals(role)) {
                throw new RuntimeException("Only assigned technician can update status");
            }
        }

        ticket.setStatus(newStatus);
        
        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolutionNotes(resolutionNotes);
        }
        
        if (newStatus == TicketStatus.REJECTED) {
            ticket.setRejectedReason(rejectedReason);
        }
        
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // 5. Assign technician to ticket (Admin only)
    public Ticket assignTechnician(String ticketId, String technicianId, String role) {
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Only admins can assign technicians");
        }
        
        Ticket ticket = getTicketById(ticketId);
        ticket.setAssignedTo(technicianId);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // 6. Add comment to ticket
    public Comment addComment(String ticketId, String content, String userId, String userRole) {
        Ticket ticket = getTicketById(ticketId);
        
        Comment comment = new Comment();
        comment.setTicketId(ticket.getId());
        comment.setUserId(userId);
        comment.setUserRole(userRole);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    // 7. Edit own comment
    public Comment editComment(String commentId, String content, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You can only edit your own comments");
        }
        
        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // 8. Delete own comment
    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
    }

    // 9. Get all comments for a ticket
    public List<Comment> getCommentsByTicketId(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    // Helper method to save file
    private String saveFile(MultipartFile file, String ticketId) throws IOException {
        Path uploadPath = Paths.get(uploadDir, "tickets", ticketId);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("Created directory: " + uploadPath);
        }
        
        String originalFileName = file.getOriginalFilename();
        String sanitizedFileName = originalFileName != null ? 
            originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_") : "file";
        String fileName = UUID.randomUUID().toString() + "_" + sanitizedFileName;
        Path filePath = uploadPath.resolve(fileName);
        
        Files.copy(file.getInputStream(), filePath);
        System.out.println("File saved to: " + filePath);
        
        return filePath.toString();
    }
}