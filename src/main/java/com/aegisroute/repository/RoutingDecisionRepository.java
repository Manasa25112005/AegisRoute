package com.aegisroute.repository;

import com.aegisroute.entity.RoutingDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface RoutingDecisionRepository
        extends JpaRepository<RoutingDecision, Long> {

    // =========================================
    // Get today's routing decisions
    // =========================================

    List<RoutingDecision> findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime start,
            LocalDateTime end
    );


    // =========================================
    // Count today's routing decisions
    // =========================================

    long countByTimestampBetween(
            LocalDateTime start,
            LocalDateTime end
    );


    // =========================================
    // Get recent routing decisions
    // =========================================

    List<RoutingDecision>
    findTop10ByOrderByTimestampDesc();


    // =========================================
    // Count requests for a particular gateway
    // =========================================

    long countByGatewayNameAndTimestampBetween(
            String gatewayName,
            LocalDateTime start,
            LocalDateTime end
    );

}