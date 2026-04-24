package com.smartcampus.smart_campus_backend.repository; // නිවැරදි කළ package එක

import com.smartcampus.smart_campus_backend.model.Notification; // නිවැරදි කළ import එක
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserId(String userId);
}