package com.smartcampus.smart_campus_backend.repository;

import com.smartcampus.smart_campus_backend.model.Ticket;
import com.smartcampus.smart_campus_backend.model.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    
    List<Ticket> findByCreatedBy(String userId);
    
    List<Ticket> findByAssignedTo(String technicianId);
    
    List<Ticket> findByStatus(TicketStatus status);
}