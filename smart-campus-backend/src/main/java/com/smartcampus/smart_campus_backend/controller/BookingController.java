package com.smartcampus.smart_campus_backend.controller;

import com.smartcampus.smart_campus_backend.dto.RejectBookingRequest;
import com.smartcampus.smart_campus_backend.model.Booking;
import com.smartcampus.smart_campus_backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Booking booking) {
        try {
            return ResponseEntity.ok(bookingService.create(booking));
        } catch (BookingService.ConflictException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Booking>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) String requesterId,
            @RequestParam(required = false) String date
    ) {
        return ResponseEntity.ok(bookingService.list(status, resourceId, requesterId, date));
    }

    @GetMapping("/user/{requesterId}")
    public ResponseEntity<List<Booking>> listForUser(@PathVariable String requesterId) {
        return ResponseEntity.ok(bookingService.listForUser(requesterId));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable String id) {
        try {
            return ResponseEntity.ok(bookingService.approve(id));
        } catch (BookingService.ConflictException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable String id, @Valid @RequestBody RejectBookingRequest req) {
        try {
            return ResponseEntity.ok(bookingService.reject(id, req.getReason()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id) {
        try {
            return ResponseEntity.ok(bookingService.cancel(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}
