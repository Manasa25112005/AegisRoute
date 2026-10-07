package com.aegisroute.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "routing_decisions")
public class RoutingDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String requestId;

    @Column(nullable = false)
    private String gatewayName;

    @Column(nullable = false)
    private Double latency;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Double routingScore;

    @Column(nullable = false)
    private Double confidence;

    @Column(nullable = false)
    private LocalDateTime timestamp;


    // ==============================
    // Constructor
    // ==============================

    public RoutingDecision() {
    }


    public RoutingDecision(
            String requestId,
            String gatewayName,
            Double latency,
            String status,
            Double routingScore,
            Double confidence,
            LocalDateTime timestamp) {

        this.requestId = requestId;
        this.gatewayName = gatewayName;
        this.latency = latency;
        this.status = status;
        this.routingScore = routingScore;
        this.confidence = confidence;
        this.timestamp = timestamp;
    }


    // ==============================
    // Getters and Setters
    // ==============================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }


    public String getGatewayName() {
        return gatewayName;
    }

    public void setGatewayName(String gatewayName) {
        this.gatewayName = gatewayName;
    }


    public Double getLatency() {
        return latency;
    }

    public void setLatency(Double latency) {
        this.latency = latency;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public Double getRoutingScore() {
        return routingScore;
    }

    public void setRoutingScore(Double routingScore) {
        this.routingScore = routingScore;
    }


    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }


    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}