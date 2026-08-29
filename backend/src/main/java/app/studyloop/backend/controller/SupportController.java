package app.studyloop.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/contact")
public class SupportController {

    private final List<Map<String, Object>> tickets = Collections.synchronizedList(new ArrayList<>());
    private final AtomicLong ticketIdCounter = new AtomicLong(89240);

    @PostMapping("/support")
    public ResponseEntity<Map<String, Object>> createSupportTicket(@RequestBody Map<String, Object> payload) {
        String issueType = (String) payload.getOrDefault("issueType", "Other");
        String subject = (String) payload.getOrDefault("subject", "General Inquiry");
        String message = (String) payload.getOrDefault("message", "");
        String userEmail = (String) payload.getOrDefault("email", "student@studyloop.in");
        String userName = (String) payload.getOrDefault("fullName", "Aarav Sharma");
        String attachmentName = (String) payload.getOrDefault("attachmentName", null);

        long newId = ticketIdCounter.incrementAndGet();
        String ticketNumber = "SL-" + newId;

        Map<String, Object> ticket = new HashMap<>();
        ticket.put("ticketId", ticketNumber);
        ticket.put("issueType", issueType);
        ticket.put("subject", subject);
        ticket.put("message", message);
        ticket.put("userEmail", userEmail);
        ticket.put("userName", userName);
        ticket.put("attachmentName", attachmentName);
        ticket.put("status", "Open");
        ticket.put("createdAt", Instant.now().toString());
        ticket.put("estimatedResponse", "Within 24 Hours");

        tickets.add(0, ticket);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Support ticket created successfully");
        response.put("ticket", ticket);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<Map<String, Object>>> getTickets() {
        return ResponseEntity.ok(tickets);
    }
}
