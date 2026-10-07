package com.aegisroute.ml;

public class PredictionRequest {

    private String GatewayName;
    private int ResponseTime;
    private int FailureCount;
    private double Cost;
    private int CircuitOpen;
    private String Status;

    public String getGatewayName() {
        return GatewayName;
    }

    public void setGatewayName(String gatewayName) {
        GatewayName = gatewayName;
    }

    public int getResponseTime() {
        return ResponseTime;
    }

    public void setResponseTime(int responseTime) {
        ResponseTime = responseTime;
    }

    public int getFailureCount() {
        return FailureCount;
    }

    public void setFailureCount(int failureCount) {
        FailureCount = failureCount;
    }

    public double getCost() {
        return Cost;
    }

    public void setCost(double cost) {
        Cost = cost;
    }

    public int getCircuitOpen() {
        return CircuitOpen;
    }

    public void setCircuitOpen(int circuitOpen) {
        CircuitOpen = circuitOpen;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }
}