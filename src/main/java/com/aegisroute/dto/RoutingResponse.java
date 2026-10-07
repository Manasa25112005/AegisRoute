package com.aegisroute.dto;

import com.aegisroute.entity.Gateway;

public class RoutingResponse {

    private Gateway gateway;
    private double confidence;
    private double routingScore;

    public RoutingResponse() {
    }

    public RoutingResponse(
            Gateway gateway,
            double confidence,
            double routingScore) {

        this.gateway = gateway;
        this.confidence = confidence;
        this.routingScore = routingScore;
    }

    public Gateway getGateway() {
        return gateway;
    }

    public void setGateway(Gateway gateway) {
        this.gateway = gateway;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public double getRoutingScore() {
        return routingScore;
    }

    public void setRoutingScore(double routingScore) {
        this.routingScore = routingScore;
    }
}
