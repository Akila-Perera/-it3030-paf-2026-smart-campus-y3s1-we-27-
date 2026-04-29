package com.smartcampus.smart_campus_backend.repository;

import com.smartcampus.smart_campus_backend.model.Attachment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttachmentRepository extends MongoRepository<Attachment, String> {
    
    List<Attachment> findByTicketId(String ticketId);
    
    void deleteByTicketId(String ticketId);
}