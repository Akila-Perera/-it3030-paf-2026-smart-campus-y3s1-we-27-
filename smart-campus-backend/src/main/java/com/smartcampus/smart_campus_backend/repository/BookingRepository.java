package com.smartcampus.smart_campus_backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartcampus.smart_campus_backend.model.Booking;
import com.smartcampus.smart_campus_backend.model.BookingStatus;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByRequesterId(String requesterId);

    List<Booking> findByResourceIdAndDate(String resourceId, String date);

    List<Booking> findByResourceIdAndDateAndStatusIn(String resourceId, String date, Collection<BookingStatus> statuses);
}
