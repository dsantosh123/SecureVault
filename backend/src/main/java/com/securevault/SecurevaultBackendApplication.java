package com.securevault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // <--- ADD THIS LINE HERE
public class SecurevaultBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecurevaultBackendApplication.class, args);
    }
}