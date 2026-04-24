package com.smartcampus.smart_campus_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable()) // CSRF ඕෆ් කළා
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // ඕනෑම කෙනෙකුට ඕනෑම තැනකට යන්න අවසර දුන්නා
            );
        return http.build();
    }
}