package com.aegisroute.ml;

import com.aegisroute.entity.Gateway;
import com.aegisroute.repository.GatewayRepository;
import com.aegisroute.service.GatewayRoutingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;
import java.util.Random;

@Component
public class DatasetGenerator {

    @Autowired
    private GatewayRepository gatewayRepository;

    @Autowired
    private GatewayRoutingService gatewayRoutingService;

    public void generateDataset(int scenarios) {

        // Delete old dataset before generating a new one
        File file = new File("gateway_dataset.csv");
        if (file.exists() && !file.delete()) {
            throw new RuntimeException("Failed to delete old dataset.");
        }

        List<Gateway> gateways = gatewayRepository.findAll();
        Random random = new Random();

        for (int i = 0; i < scenarios; i++) {

            // Randomly choose one of the three scenarios
            int scenario = random.nextInt(3);

            for (Gateway gateway : gateways) {

                // Default values
                gateway.setStatus("UP");
                gateway.setCircuitOpen(false);

                switch (scenario) {

                    // ===========================
                    // Scenario 1 : OpenAI Wins
                    // ===========================
                    case 0:

                        if (gateway.getGatewayName().equalsIgnoreCase("OpenAI")) {

                            gateway.setResponseTime(430.0 + random.nextInt(51)); // 430-480
                            gateway.setFailureCount(random.nextInt(2)); // 0-1
                            gateway.setCost(0.019 + random.nextDouble() * 0.002); // 0.019-0.021

                        } else if (gateway.getGatewayName().equalsIgnoreCase("Gemini")) {

                            gateway.setResponseTime(1150.0 + random.nextInt(151)); // 1150-1300
                            gateway.setFailureCount(2 + random.nextInt(2)); // 2-3
                            gateway.setCost(0.009 + random.nextDouble() * 0.002); // 0.009-0.011

                        } else {

                            gateway.setResponseTime(1700.0 + random.nextInt(201)); // 1700-1900
                            gateway.setFailureCount(1 + random.nextInt(2)); // 1-2
                            gateway.setCost(0.029 + random.nextDouble() * 0.002); // 0.029-0.031
                        }

                        break;

                    // ===========================
                    // Scenario 2 : Gemini Wins
                    // ===========================
                    case 1:

                        if (gateway.getGatewayName().equalsIgnoreCase("OpenAI")) {

                            gateway.setResponseTime(1600.0 + random.nextInt(201)); // 1600-1800
                            gateway.setFailureCount(1 + random.nextInt(2)); // 1-2
                            gateway.setCost(0.019 + random.nextDouble() * 0.002);

                        } else if (gateway.getGatewayName().equalsIgnoreCase("Gemini")) {

                            gateway.setResponseTime(430.0 + random.nextInt(71)); // 430-500
                            gateway.setFailureCount(random.nextInt(2)); // 0-1
                            gateway.setCost(0.009 + random.nextDouble() * 0.002);

                        } else {

                            gateway.setResponseTime(1300.0 + random.nextInt(201)); // 1300-1500
                            gateway.setFailureCount(1 + random.nextInt(2));
                            gateway.setCost(0.029 + random.nextDouble() * 0.002);
                        }

                        break;

                    // ===========================
                    // Scenario 3 : Claude Wins
                    // ===========================
                    case 2:

                        if (gateway.getGatewayName().equalsIgnoreCase("OpenAI")) {

                            gateway.setResponseTime(900.0 + random.nextInt(301)); // 900-1200
                            gateway.setFailureCount(2 + random.nextInt(2)); // 2-3
                            gateway.setCost(0.019 + random.nextDouble() * 0.002);

                        } else if (gateway.getGatewayName().equalsIgnoreCase("Gemini")) {

                            gateway.setResponseTime(1300.0 + random.nextInt(401)); // 1300-1700
                            gateway.setFailureCount(2 + random.nextInt(2)); // 2-3
                            gateway.setCost(0.009 + random.nextDouble() * 0.002);

                        } else {

                            gateway.setResponseTime(430.0 + random.nextInt(71)); // 430-500
                            gateway.setFailureCount(random.nextInt(2)); // 0-1
                            gateway.setCost(0.029 + random.nextDouble() * 0.002);
                        }

                        break;
                }

                // ------------------------------
                // Rare real-world conditions
                // ------------------------------

                // 2% chance gateway is DOWN
                if (random.nextInt(100) < 2) {
                    gateway.setStatus("DOWN");
                }

                // 3% chance circuit breaker is OPEN
                if (random.nextInt(100) < 3) {
                    gateway.setCircuitOpen(true);
                }
            }

            gatewayRepository.saveAll(gateways);

            // Select best gateway and write dataset row
            gatewayRoutingService.getBestGateway();
        }

        System.out.println("Dataset generated successfully!");
    }
}