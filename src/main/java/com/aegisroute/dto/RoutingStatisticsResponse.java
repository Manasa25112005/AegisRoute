package com.aegisroute.dto;

public class RoutingStatisticsResponse {

    private int successful;
    private int failed;
    private double successRate;

    public RoutingStatisticsResponse() {
    }

    public RoutingStatisticsResponse(
            int successful,
            int failed,
            double successRate) {

        this.successful = successful;
        this.failed = failed;
        this.successRate = successRate;
    }

    public int getSuccessful() {
        return successful;
    }

    public void setSuccessful(int successful) {
        this.successful = successful;
    }

    public int getFailed() {
        return failed;
    }

    public void setFailed(int failed) {
        this.failed = failed;
    }

    public double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(double successRate) {
        this.successRate = successRate;
    }
}