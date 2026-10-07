package com.aegisroute.ml;

public class PredictionResponse {

    private int selected;

    private double confidence;

    private double routingScore;


    public int getSelected() {
        return selected;
    }

    public void setSelected(int selected) {
        this.selected = selected;
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