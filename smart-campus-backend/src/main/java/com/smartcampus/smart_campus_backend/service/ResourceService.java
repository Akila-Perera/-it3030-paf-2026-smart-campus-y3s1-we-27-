package com.smartcampus.smart_campus_backend.service;

import com.smartcampus.smart_campus_backend.model.Resource;
import com.smartcampus.smart_campus_backend.model.ResourceStatus;
import com.smartcampus.smart_campus_backend.model.ResourceType;
import com.smartcampus.smart_campus_backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public Resource create(Resource resource) {
        if (resource.getStatus() == null) {
            resource.setStatus(ResourceStatus.ACTIVE);
        }
        if (resource.getType() == null) {
            resource.setType(ResourceType.LECTURE_HALL);
        }
        resource.setCreatedAt(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    public List<Resource> list(String q, ResourceType type, Integer minCapacity, Integer maxCapacity, String location, ResourceStatus status) {
        final String qNorm = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
        final String locNorm = location == null ? "" : location.trim().toLowerCase(Locale.ROOT);

        return resourceRepository.findAll().stream()
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> status == null || r.getStatus() == status)
                .filter(r -> minCapacity == null || (r.getCapacity() != null && r.getCapacity() >= minCapacity))
                .filter(r -> maxCapacity == null || (r.getCapacity() != null && r.getCapacity() <= maxCapacity))
                .filter(r -> locNorm.isEmpty() || (r.getLocation() != null && r.getLocation().toLowerCase(Locale.ROOT).contains(locNorm)))
                .filter(r -> {
                    if (qNorm.isEmpty()) return true;
                    final String name = Objects.toString(r.getName(), "").toLowerCase(Locale.ROOT);
                    final String loc = Objects.toString(r.getLocation(), "").toLowerCase(Locale.ROOT);
                    return name.contains(qNorm) || loc.contains(qNorm);
                })
                .sorted(Comparator.comparing(Resource::getName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();
    }

    public Resource update(String id, Resource updated) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));

        updated.setId(existing.getId());
        if (updated.getCreatedAt() == null) {
            updated.setCreatedAt(existing.getCreatedAt());
        }
        return resourceRepository.save(updated);
    }

    public void delete(String id) {
        resourceRepository.deleteById(id);
    }

    public Resource get(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));
    }
}
