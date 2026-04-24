package com.smartcampus.smart_campus_backend.service; // අලුත් package නම

import com.smartcampus.smart_campus_backend.model.Notification; // නිවැරදි කළ path එක
import com.smartcampus.smart_campus_backend.repository.NotificationRepository; // නිවැරදි කළ path එක
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(Notification n) {
        return notificationRepository.save(n);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    public Notification markAsRead(String id) {
        Optional<Notification> notificationOptional = notificationRepository.findById(id);
        if (notificationOptional.isPresent()) {
            Notification notification = notificationOptional.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        return null;
    }

    public void deleteNotificationById(String id) {
        notificationRepository.deleteById(id);
    }
}