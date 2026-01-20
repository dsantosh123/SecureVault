package com.securevault.controller;

import com.securevault.model.Nominee;
import com.securevault.service.NomineeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/nominees") 
public class NomineeController {

    private final NomineeService nomineeService;

    // Manual Constructor to initialize the final field
    public NomineeController(NomineeService nomineeService) {
        this.nomineeService = nomineeService;
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<Nominee> addNominee(
            @PathVariable UUID userId, 
            @RequestBody Nominee nominee) {
        
        Nominee savedNominee = nomineeService.addNominee(userId, nominee);
        return ResponseEntity.ok(savedNominee);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Nominee>> getMyNominees(@PathVariable UUID userId) {
        List<Nominee> nominees = nomineeService.getNomineesByUser(userId);
        return ResponseEntity.ok(nominees);
    }
}