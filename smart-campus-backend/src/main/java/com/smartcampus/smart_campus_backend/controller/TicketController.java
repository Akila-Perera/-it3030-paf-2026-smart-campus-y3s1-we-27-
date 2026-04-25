package com.smartcampus.smart_campus_backend.controller;

import com.smartcampus.smart_campus_backend.model.Ticket;
import com.smartcampus.smart_campus_backend.model.Comment;
import com.smartcampus.smart_campus_backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService ticketService;

    // ========== 1. CREATE TICKET (POST) ==========
    @PostMapping
    public ResponseEntity<?> createTicket(
            @RequestParam String resourceId,
            @RequestParam(required = false) String location,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam String priority,
            @RequestParam(required = false) String preferredContact,
            @RequestParam String createdBy,
            @RequestParam(required = false) List<MultipartFile> attachments) {
        
        try {
            Ticket ticket = ticketService.createTicket(resourceId, location, category, 
                    description, priority, preferredContact, createdBy, attachments);
            return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== 2. GET ALL TICKETS (GET) ==========
    @GetMapping
    public ResponseEntity<List<Ticket>> getTickets(
            @RequestParam String userId,
            @RequestParam String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String priority) {
        
        List<Ticket> tickets = ticketService.getTickets(userId, role, status, category, priority);
        return ResponseEntity.ok(tickets);
    }

    // ========== 3. GET SINGLE TICKET (GET) ==========
    @GetMapping("/{ticketId}")
    public ResponseEntity<?> getTicketById(@PathVariable String ticketId) {
        try {
            Ticket ticket = ticketService.getTicketById(ticketId);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== 4. UPDATE TICKET STATUS (PUT) ==========
    @PutMapping("/{ticketId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String ticketId,
            @RequestParam String status,
            @RequestParam(required = false) String resolutionNotes,
            @RequestParam(required = false) String rejectedReason,
            @RequestParam String userId,
            @RequestParam String role) {
        
        try {
            Ticket ticket = ticketService.updateStatus(ticketId, status, resolutionNotes, 
                    rejectedReason, userId, role);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== 5. ASSIGN TECHNICIAN (PATCH) ==========
    @PatchMapping("/{ticketId}/assign")
    public ResponseEntity<?> assignTechnician(
            @PathVariable String ticketId,
            @RequestParam String technicianId,
            @RequestParam String role) {
        
        try {
            Ticket ticket = ticketService.assignTechnician(ticketId, technicianId, role);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== 6. ADD COMMENT (POST) ==========
    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable String ticketId,
            @RequestParam String content,
            @RequestParam String userId,
            @RequestParam String userRole) {
        
        try {
            Comment comment = ticketService.addComment(ticketId, content, userId, userRole);
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== 7. GET COMMENTS (GET) ==========
    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String ticketId) {
        List<Comment> comments = ticketService.getCommentsByTicketId(ticketId);
        return ResponseEntity.ok(comments);
    }

    // ========== 8. EDIT COMMENT (PUT) ==========
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> editComment(
            @PathVariable String commentId,
            @RequestParam String content,
            @RequestParam String userId) {
        
        try {
            Comment comment = ticketService.editComment(commentId, content, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== 9. DELETE COMMENT (DELETE) ==========
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String commentId,
            @RequestParam String userId) {
        
        try {
            ticketService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}