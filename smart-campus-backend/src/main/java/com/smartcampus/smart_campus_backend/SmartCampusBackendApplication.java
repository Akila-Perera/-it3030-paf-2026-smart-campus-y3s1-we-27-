package com.smartcampus.smart_campus_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartCampusBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusBackendApplication.class, args);
        
        System.out.println("==============================================");
        System.out.println("🚀 SMART CAMPUS BACKEND STARTED SUCCESSFULLY!");
        System.out.println("📡 API is running on: http://localhost:8081");
        System.out.println("✅ Ready to serve Member 4's requests!");
        System.out.println("==============================================");
    }
}