package com.aegisroute.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "gateways")
public class Gateway {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String gatewayName;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String status;

    // Keep nullable while migrating existing data
    @Column
    private Double cost;

    @Column(nullable = false)
    private Double responseTime;

    private int failureCount = 0;

    private boolean circuitOpen = false;

    private Long circuitOpenedAt;

    // ---------------- Health ----------------

    @Transient
    public double getHealth() {

        if (circuitOpen) {
            return 0.0;
        }

        if ("UP".equalsIgnoreCase(status) && failureCount == 0) {
            return 100.0;
        }

        double health = 100.0 - (failureCount * 33.33);

        return Math.max(0.0, health);
    }

    public Gateway() {
    }

    public Gateway(Long id,
                   String gatewayName,
                   String url,
                   String status,
                   Double cost,
                   Double responseTime) {
        this.id = id;
        this.gatewayName = gatewayName;
        this.url = url;
        this.status = status;
        this.cost = cost;
        this.responseTime = responseTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGatewayName() {
        return gatewayName;
    }

    public void setGatewayName(String gatewayName) {
        this.gatewayName = gatewayName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Double getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(Double responseTime) {
        this.responseTime = responseTime;
    }

    public int getFailureCount() {
        return failureCount;
    }

    public void setFailureCount(int failureCount) {
        this.failureCount = failureCount;
    }

    public boolean isCircuitOpen() {
        return circuitOpen;
    }

    public void setCircuitOpen(boolean circuitOpen) {
        this.circuitOpen = circuitOpen;
    }

    public Long getCircuitOpenedAt() {
        return circuitOpenedAt;
    }

    public void setCircuitOpenedAt(Long circuitOpenedAt) {
        this.circuitOpenedAt = circuitOpenedAt;
    }
}