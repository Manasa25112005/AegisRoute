package com.aegisroute.controller;

import com.aegisroute.dto.RoutingResponse;
import com.aegisroute.dto.RoutingStatisticsResponse;
import com.aegisroute.entity.RoutingDecision;
import com.aegisroute.service.GatewayRoutingService;
import com.aegisroute.service.RoutingStatisticsService;
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
public class GatewayRoutingController {

    @Autowired
    private GatewayRoutingService gatewayRoutingService;

    @Autowired
    private RoutingStatisticsService routingStatisticsService;

    @Autowired
    private RoutingDecisionRepository routingDecisionRepository;


    // =========================================
    // Gateway Routing
    // =========================================

    @GetMapping("/route")
    public Object route() {

        RoutingResponse response =
                gatewayRoutingService.getBestGateway();

        // No gateway available
        if (response == null) {

            routingStatisticsService.recordFailure();

            return "No gateway available";
        }

        // Get selected gateway
        String gatewayName =
                response.getGateway()
                        .getGatewayName();

        // Record successful routing
        routingStatisticsService.recordSuccess(
                gatewayName
        );

        return response;
    }


    // =========================================
    // Routing Success Statistics
    // =========================================

    @GetMapping("/analytics/routing-success")
    public RoutingStatisticsResponse routingSuccess() {

        return new RoutingStatisticsResponse(

                routingStatisticsService
                        .getSuccessfulRoutes(),

                routingStatisticsService
                        .getFailedRoutes(),

                routingStatisticsService
                        .getSuccessRate()
        );
    }


    // =========================================
    // Gateway Selection Distribution
    // =========================================

    @GetMapping("/analytics/gateway-distribution")
    public Map<String, Integer> gatewayDistribution() {

        return routingStatisticsService
                .getGatewaySelections();
    }


    // =========================================
    // Average Latency
    // =========================================

    @GetMapping("/analytics/average-latency")
    public Map<String, Object> averageLatency() {

        LocalDateTime startOfDay =
                LocalDate.now().atStartOfDay();

        LocalDateTime endOfDay =
                startOfDay.plusDays(1);

        List<RoutingDecision> decisions =
                routingDecisionRepository
                        .findByTimestampBetweenOrderByTimestampDesc(
                                startOfDay,
                                endOfDay
                        );

        double averageLatency =
                decisions.stream()
                        .map(RoutingDecision::getLatency)
                        .filter(latency -> latency != null)
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0.0);

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "averageLatency",
                Math.round(
                        averageLatency * 10.0
                ) / 10.0
        );

        return response;
    }
}