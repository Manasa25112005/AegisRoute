package com.aegisroute.controller;

import com.aegisroute.entity.RoutingDecision;
import com.aegisroute.repository.RoutingDecisionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/routing")
public class RoutingController {

    @Autowired
    private RoutingDecisionRepository routingDecisionRepository;


    // =========================================
    // GET REQUESTS TODAY
    // =========================================

    @GetMapping("/requests/today")
    public Map<String, Object> getRequestsToday() {

        LocalDateTime startOfDay =
                LocalDate.now().atStartOfDay();

        LocalDateTime endOfDay =
                startOfDay.plusDays(1);


        long count =
                routingDecisionRepository
                        .countByTimestampBetween(
                                startOfDay,
                                endOfDay
                        );


        Map<String, Object> response =
                new HashMap<>();

        response.put("count", count);

        return response;
    }


    // =========================================
    // GET RECENT ROUTING DECISIONS
    // =========================================

    @GetMapping("/decisions/recent")
    public List<RoutingDecision> getRecentDecisions() {

        return routingDecisionRepository
                .findTop10ByOrderByTimestampDesc();

    }

}