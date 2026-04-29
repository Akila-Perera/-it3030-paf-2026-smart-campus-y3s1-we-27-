package com.smartcampus.smart_campus_backend.service;

import com.smartcampus.smart_campus_backend.model.*;
import com.smartcampus.smart_campus_backend.repository.BookingRepository;
import com.smartcampus.smart_campus_backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository, ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    public Booking create(Booking booking) {
        Resource resource = resourceRepository.findById(booking.getResourceId())
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));

        if (resource.getStatus() == ResourceStatus.OUT_OF_SERVICE) {
            throw new IllegalStateException("Resource is OUT_OF_SERVICE");
        }

        validateTimeRange(booking.getStartTime(), booking.getEndTime());

        // Prevent conflicts for same resource/date with pending/approved bookings.
        List<Booking> existing = bookingRepository.findByResourceIdAndDateAndStatusIn(
                booking.getResourceId(),
                booking.getDate(),
                EnumSet.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        );

        if (hasConflict(existing, booking.getStartTime(), booking.getEndTime(), null)) {
            throw new ConflictException("Scheduling conflict");
        }

        booking.setId(null);
        booking.setResourceName(resource.getName());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setReviewedAt(null);
        booking.setAdminReason(null);
        return bookingRepository.save(booking);
    }

    public List<Booking> list(String status, String resourceId, String requesterId, String date) {
        final BookingStatus parsedStatus = (status == null || status.trim().isEmpty())
                ? null
                : BookingStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));

        return bookingRepository.findAll().stream()
                .filter(b -> parsedStatus == null || b.getStatus() == parsedStatus)
                .filter(b -> resourceId == null || resourceId.isBlank() || resourceId.equals(b.getResourceId()))
                .filter(b -> requesterId == null || requesterId.isBlank() || requesterId.equals(b.getRequesterId()))
                .filter(b -> date == null || date.isBlank() || date.equals(b.getDate()))
                .sorted(Comparator.comparing(Booking::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .toList();
    }

    public List<Booking> listForUser(String requesterId) {
        return bookingRepository.findByRequesterId(requesterId).stream()
                .sorted(Comparator.comparing(Booking::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .toList();
    }

    public Booking approve(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved");
        }

        validateTimeRange(booking.getStartTime(), booking.getEndTime());

        // On approve, check conflicts with APPROVED bookings.
        List<Booking> approved = bookingRepository.findByResourceIdAndDateAndStatusIn(
                booking.getResourceId(),
                booking.getDate(),
                EnumSet.of(BookingStatus.APPROVED)
        );

        if (hasConflict(approved, booking.getStartTime(), booking.getEndTime(), booking.getId())) {
            throw new ConflictException("Scheduling conflict");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setReviewedAt(LocalDateTime.now());
        booking.setAdminReason(null);
        return bookingRepository.save(booking);
    }

    public Booking reject(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminReason(reason);
        booking.setReviewedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public Booking cancel(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setReviewedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    private static void validateTimeRange(String start, String end) {
        try {
            LocalTime s = LocalTime.parse(start);
            LocalTime e = LocalTime.parse(end);
            if (!s.isBefore(e)) {
                throw new IllegalArgumentException("startTime must be before endTime");
            }
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Invalid time format. Expected HH:mm");
        }
    }

    private static boolean hasConflict(List<Booking> existing, String startTime, String endTime, String excludeId) {
        LocalTime s = LocalTime.parse(startTime);
        LocalTime e = LocalTime.parse(endTime);

        for (Booking b : existing) {
            if (excludeId != null && excludeId.equals(b.getId())) continue;
            LocalTime bs = LocalTime.parse(b.getStartTime());
            LocalTime be = LocalTime.parse(b.getEndTime());
            // Overlap if start < otherEnd AND otherStart < end
            if (s.isBefore(be) && bs.isBefore(e)) {
                return true;
            }
        }
        return false;
    }

    public static class ConflictException extends RuntimeException {
        public ConflictException(String message) {
            super(message);
        }
    }
}
