package com.aegisroute.repository;

import com.aegisroute.entity.GatewayLatencyHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GatewayLatencyHistoryRepository
        extends JpaRepository<GatewayLatencyHistory, Long> {

    List<GatewayLatencyHistory>
    findByTimestampGreaterThanEqualOrderByTimestampAsc(
            Long timestamp
    );
}
