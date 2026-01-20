package com.securevault.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// CORRECT IMPORT: Use java.util.Arrays instead of io.jsonwebtoken
import java.util.Arrays; 

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Enable CORS using our custom source
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Disable CSRF for development/testing
            .csrf(csrf -> csrf.disable())
            
            // 3. Set URL permissions
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll() 
                .requestMatchers("/nominees/**").permitAll() 
                .requestMatchers("/assets/**").permitAll()   
                .requestMatchers("/nominee-verify/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> {}); 
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow your React frontend URL
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        // Apply this to all paths (/**)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}