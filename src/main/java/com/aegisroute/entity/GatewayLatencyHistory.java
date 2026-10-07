package com.aegisroute.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "gateway_latency_history")
public class GatewayLatencyHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String gatewayName;

    @Column(nullable = false)
    private Double responseTime;

    @Column(nullable = false)
    private Long timestamp;

    public GatewayLatencyHistory() {
    }

    public GatewayLatencyHistory(
            String gatewayName,
            Double responseTime,
            Long timestamp) {

        this.gatewayName = gatewayName;
        this.responseTime = responseTime;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public String getGatewayName() {
        return gatewayName;
    }

    public void setGatewayName(String gatewayName) {
        this.gatewayName = gatewayName;
    }

    public Double getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(Double responseTime) {
        this.responseTime = responseTime;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}
