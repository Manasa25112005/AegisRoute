package com.aegisroute.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RoutingStatisticsService {

    private int successfulRoutes = 0;
    private int failedRoutes = 0;

    // Stores how many times each gateway was selected
    private final Map<String, Integer> gatewaySelections = new HashMap<>();

    // -----------------------------------------
    // Record successful routing
    // -----------------------------------------

    public void recordSuccess(String gatewayName) {

        successfulRoutes++;

        gatewaySelections.put(
                gatewayName,
                gatewaySelections.getOrDefault(gatewayName, 0) + 1
        );
    }

    // -----------------------------------------
    // Record failed routing
    // -----------------------------------------

    public void recordFailure() {
        failedRoutes++;
    }

    // -----------------------------------------
    // Get successful routes
    // -----------------------------------------

    public int getSuccessfulRoutes() {
        return successfulRoutes;
    }

    // -----------------------------------------
    // Get failed routes
    // -----------------------------------------

    public int getFailedRoutes() {
        return failedRoutes;
    }

    // -----------------------------------------
    // Calculate success rate
    // -----------------------------------------

    public double getSuccessRate() {

        int total = successfulRoutes + failedRoutes;

        if (total == 0) {
            return 0.0;
        }

        return (successfulRoutes * 100.0) / total;
    }

    // -----------------------------------------
    // Get gateway selection counts
    // -----------------------------------------

    public Map<String, Integer> getGatewaySelections() {

        return new HashMap<>(gatewaySelections);
    }
}