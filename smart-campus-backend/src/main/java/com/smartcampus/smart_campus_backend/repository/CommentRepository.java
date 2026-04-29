package com.smartcampus.smart_campus_backend.repository;

import com.smartcampus.smart_campus_backend.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    
    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);
    
    void deleteByIdAndUserId(String id, String userId);
}