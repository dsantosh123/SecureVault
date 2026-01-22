package com.securevault.controller;

import com.securevault.model.Nominee;
import com.securevault.service.NomineeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/nominees") // Added /api to match your React fetch calls
@CrossOrigin(origins = "http://localhost:3000") // Required for React connection
public class NomineeController {

    private final NomineeService nomineeService;

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