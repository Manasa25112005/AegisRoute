package com.aegisroute.service;

import com.aegisroute.dto.RoutingResponse;
import com.aegisroute.entity.Gateway;
import com.aegisroute.entity.RoutingDecision;
import com.aegisroute.ml.DatasetService;
import com.aegisroute.ml.PredictionRequest;
import com.aegisroute.ml.PredictionResponse;
import com.aegisroute.repository.GatewayRepository;
import com.aegisroute.repository.RoutingDecisionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GatewayRoutingService {

    @Autowired
    private DatasetService datasetService;

    @Autowired
    private GatewayRepository gatewayRepository;

    @Autowired
    private MLPredictionService mlPredictionService;

    @Autowired
    private RoutingDecisionRepository routingDecisionRepository;


    // =====================================================
    // GET BEST GATEWAY
    // =====================================================

    public RoutingResponse getBestGateway() {

        // =================================================
        // STEP 1: GET HEALTHY GATEWAYS
        // =================================================

        List<Gateway> healthyGateways =
                gatewayRepository.findAll()
                        .stream()
                        .filter(g ->
                                "UP".equals(g.getStatus()))
                        .filter(g ->
                                !g.isCircuitOpen())
                        .collect(Collectors.toList());


        // =================================================
        // NO HEALTHY GATEWAY
        // =================================================

        if (healthyGateways.isEmpty()) {

            return null;
        }


        // =================================================
        // STEP 2: FIND FASTEST GATEWAY
        // =================================================

        Gateway fastestGateway =
                healthyGateways
                        .stream()
                        .min((g1, g2) ->
                                Double.compare(
                                        g1.getResponseTime(),
                                        g2.getResponseTime()
                                )
                        )
                        .orElse(null);


        if (fastestGateway == null) {

            return null;
        }


        double fastestLatency =
                fastestGateway.getResponseTime();


        System.out.println(
                "=============================="
        );

        System.out.println(
                "Fastest Gateway : "
                        + fastestGateway.getGatewayName()
        );

        System.out.println(
                "Fastest Latency : "
                        + fastestLatency
                        + " ms"
        );


        // =================================================
        // STEP 3: RUN ML PREDICTION
        // =================================================

        Gateway mlSelectedGateway = null;

        double mlConfidence = 0.0;


        for (Gateway gateway : healthyGateways) {

            PredictionRequest request =
                    new PredictionRequest();


            request.setGatewayName(
                    gateway.getGatewayName()
            );


            request.setResponseTime(
                    gateway.getResponseTime().intValue()
            );


            request.setFailureCount(
                    gateway.getFailureCount()
            );


            request.setCost(
                    gateway.getCost()
            );


            request.setCircuitOpen(
                    gateway.isCircuitOpen()
                            ? 1
                            : 0
            );


            request.setStatus(
                    gateway.getStatus()
            );


            // =================================================
            // CALL ML SERVER
            // =================================================

            PredictionResponse response =
                    mlPredictionService.predictGateway(
                            request
                    );


            // =================================================
            // CHECK WHETHER ML SELECTED THIS GATEWAY
            // =================================================

            boolean selected =
                    response != null
                            &&
                            response.getSelected()
                                    ==
                                    getGatewayCode(
                                            gateway.getGatewayName()
                                    );


            System.out.println(
                    gateway.getGatewayName()
                            + " -> ML Selected : "
                            + selected
            );


            // =================================================
            // STORE ML SELECTION
            // =================================================

            if (selected && response != null) {

                mlSelectedGateway =
                        gateway;

                mlConfidence =
                        response.getConfidence();


                System.out.println(
                        "ML Selected Gateway : "
                                + gateway.getGatewayName()
                );


                System.out.println(
                        "ML Confidence : "
                                + mlConfidence
                );


                break;
            }
        }


        // =================================================
        // STEP 4: FINAL GATEWAY SELECTION
        // =================================================

        Gateway bestGateway;


        // =================================================
        // CASE 1: ML DID NOT SELECT ANY GATEWAY
        // =================================================

        if (mlSelectedGateway == null) {

            System.out.println(
                    "ML did not select a gateway."
            );


            System.out.println(
                    "Using fastest healthy gateway."
            );


            bestGateway =
                    fastestGateway;
        }


        // =================================================
        // CASE 2: ML SELECTED A GATEWAY
        // =================================================

        else {

            double mlLatency =
                    mlSelectedGateway
                            .getResponseTime();


            // -------------------------------------------------
            // Maximum acceptable latency
            // -------------------------------------------------

            double maximumAllowedLatency =
                    fastestLatency * 1.20;


            System.out.println(
                    "ML Gateway Latency : "
                            + mlLatency
                            + " ms"
            );


            System.out.println(
                    "Maximum Allowed Latency : "
                            + maximumAllowedLatency
                            + " ms"
            );


            // =================================================
            // ACCEPT ML GATEWAY
            // =================================================

            if (mlLatency <= maximumAllowedLatency) {

                bestGateway =
                        mlSelectedGateway;


                System.out.println(
                        "ML gateway accepted."
                );
            }


            // =================================================
            // REJECT ML GATEWAY
            // =================================================

            else {

                bestGateway =
                        fastestGateway;


                System.out.println(
                        "ML selected a significantly "
                                + "slower gateway."
                );


                System.out.println(
                        "Switching to fastest gateway."
                );
            }
        }


        // =================================================
        // STEP 5: CALCULATE FINAL ROUTING SCORE
        // =================================================

        double finalRoutingScore =
                calculateRoutingScore(
                        bestGateway,
                        healthyGateways
                );


        // =================================================
        // STEP 6: FINAL CONFIDENCE
        // =================================================

        double finalConfidence =
                mlConfidence;


        /*
         * If ML did not select anything,
         * this is a rule-based decision.
         */

        if (mlSelectedGateway == null) {

            finalConfidence = 100.0;
        }


        // =================================================
        // FINAL LOGGING
        // =================================================

        System.out.println(
                "---------------------------"
        );


        System.out.println(
                "Selected Gateway : "
                        + bestGateway.getGatewayName()
        );


        System.out.println(
                "Latency : "
                        + bestGateway.getResponseTime()
                        + " ms"
        );


        System.out.println(
                "Confidence : "
                        + finalConfidence
        );


        System.out.println(
                "Routing Score : "
                        + finalRoutingScore
        );


        System.out.println(
                "---------------------------"
        );


        // =================================================
        // SAVE DATASET INFORMATION
        // =================================================

        datasetService.saveGatewayData(
                healthyGateways,
                bestGateway
        );


        // =================================================
        // SAVE ROUTING DECISION
        // =================================================

        saveRoutingDecision(
                bestGateway,
                finalConfidence,
                finalRoutingScore
        );


        // =================================================
        // RETURN RESPONSE
        // =================================================

        return new RoutingResponse(
                bestGateway,
                finalConfidence,
                finalRoutingScore
        );
    }


    // =====================================================
    // SAVE ROUTING DECISION
    // =====================================================

    private void saveRoutingDecision(
            Gateway bestGateway,
            double confidence,
            double routingScore) {


        String requestId =
                "REQ-" +
                        System.currentTimeMillis();


        String status;


        double latency =
                bestGateway.getResponseTime();


        if (bestGateway.isCircuitOpen()) {

            status = "Circuit Open";

        } else if (latency > 500) {

            status = "High Latency";

        } else {

            status = "Success";
        }


        RoutingDecision decision =
                new RoutingDecision(
                        requestId,
                        bestGateway.getGatewayName(),
                        latency,
                        status,
                        routingScore,
                        confidence,
                        LocalDateTime.now()
                );


        routingDecisionRepository.save(
                decision
        );


        System.out.println(
                "Routing decision saved : "
                        + requestId
        );

    }


    // =====================================================
    // CALCULATE ROUTING SCORE
    // =====================================================

    private double calculateRoutingScore(
            Gateway selectedGateway,
            List<Gateway> gateways) {


        if (selectedGateway == null
                || gateways == null
                || gateways.isEmpty()) {

            return 0.0;
        }


        // =================================================
        // FIND MAXIMUM VALUES
        // =================================================

        double maxLatency =
                gateways.stream()
                        .mapToDouble(
                                g -> g.getResponseTime()
                        )
                        .max()
                        .orElse(1.0);


        double maxCost =
                gateways.stream()
                        .mapToDouble(
                                g -> g.getCost()
                        )
                        .max()
                        .orElse(1.0);


        double maxFailures =
                gateways.stream()
                        .mapToDouble(
                                g -> g.getFailureCount()
                        )
                        .max()
                        .orElse(0.0);


        // =================================================
        // LATENCY SCORE
        // =================================================

        double latencyScore;


        if (maxLatency <= 0) {

            latencyScore = 100.0;

        } else {

            latencyScore =
                    (
                            1.0
                                    -
                                    (
                                            selectedGateway
                                                    .getResponseTime()
                                                    / maxLatency
                                    )
                    ) * 100.0;
        }


        // =================================================
        // COST SCORE
        // =================================================

        double costScore;


        if (maxCost <= 0) {

            costScore = 100.0;

        } else {

            costScore =
                    (
                            1.0
                                    -
                                    (
                                            selectedGateway
                                                    .getCost()
                                                    / maxCost
                                    )
                    ) * 100.0;
        }


        // =================================================
        // FAILURE SCORE
        // =================================================

        double failureScore;


        if (maxFailures <= 0) {

            failureScore = 100.0;

        } else {

            failureScore =
                    (
                            1.0
                                    -
                                    (
                                            (double)
                                                    selectedGateway
                                                            .getFailureCount()
                                                    / maxFailures
                                    )
                    ) * 100.0;
        }


        // =================================================
        // HEALTH SCORE
        // =================================================

        double healthScore =
                selectedGateway.getHealth();


        // =================================================
        // LIMIT ALL SCORES
        // =================================================

        latencyScore =
                Math.max(
                        0.0,
                        Math.min(
                                100.0,
                                latencyScore
                        )
                );


        costScore =
                Math.max(
                        0.0,
                        Math.min(
                                100.0,
                                costScore
                        )
                );


        failureScore =
                Math.max(
                        0.0,
                        Math.min(
                                100.0,
                                failureScore
                        )
                );


        healthScore =
                Math.max(
                        0.0,
                        Math.min(
                                100.0,
                                healthScore
                        )
                );


        // =================================================
        // WEIGHTED ROUTING SCORE
        // =================================================

        /*
         * Latency  = 50%
         * Cost     = 20%
         * Failures = 15%
         * Health   = 15%
         */

        double routingScore =
                (latencyScore * 0.50)
                        +
                        (costScore * 0.20)
                        +
                        (failureScore * 0.15)
                        +
                        (healthScore * 0.15);


        // =================================================
        // ROUND TO ONE DECIMAL
        // =================================================

        return Math.round(
                routingScore * 10.0
        ) / 10.0;
    }


    // =====================================================
    // GATEWAY CODE
    // =====================================================

    private int getGatewayCode(
            String gatewayName) {

        switch (gatewayName) {

            case "OpenAI":
                return 0;

            case "Gemini":
                return 1;

            case "Claude":
                return 2;

            default:
                return -1;
        }
    }

}