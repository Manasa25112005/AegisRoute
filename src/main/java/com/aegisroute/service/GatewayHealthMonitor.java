package com.aegisroute.service;

import com.aegisroute.entity.Gateway;
import com.aegisroute.repository.GatewayRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import com.aegisroute.entity.Gateway;
import com.aegisroute.entity.GatewayLatencyHistory;
import com.aegisroute.repository.GatewayRepository;
import com.aegisroute.repository.GatewayLatencyHistoryRepository;
import java.util.List;

@Service
public class GatewayHealthMonitor {

    @Autowired
    private GatewayRepository gatewayRepository;

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private GatewayLatencyHistoryRepository
            gatewayLatencyHistoryRepository;


    @Scheduled(fixedRate = 30000)
    public void checkGatewayHealth() {

        System.out.println("\n==============================");
        System.out.println("Checking Gateway Health...");
        System.out.println("==============================");

        List<Gateway> gateways = gatewayRepository.findAll();

        for (Gateway gateway : gateways) {

            // ==============================
            // CIRCUIT BREAKER CHECK
            // ==============================

            if (gateway.isCircuitOpen()) {

                long currentTime = System.currentTimeMillis();

                if (gateway.getCircuitOpenedAt() != null &&
                        (currentTime - gateway.getCircuitOpenedAt()) < 30000) {

                    System.out.println(
                            gateway.getGatewayName()
                                    + " | Circuit OPEN - Skipping Request"
                    );

                    continue;
                }

                System.out.println(
                        gateway.getGatewayName()
                                + " | Retrying after Circuit Timeout"
                );

                gateway.setCircuitOpen(false);
                gateway.setFailureCount(0);
                gateway.setCircuitOpenedAt(null);
            }


            // ==============================
            // HEALTH CHECK
            // ==============================

            try {

                long responseTime = checkGateway(gateway.getUrl());

                if (responseTime >= 0) {

                    gateway.setStatus("UP");

                    // Store ONLY the actual successful
                    // request response time
                    gateway.setResponseTime(
                            (double) responseTime
                    );
                    GatewayLatencyHistory history =
                            new GatewayLatencyHistory(
                                    gateway.getGatewayName(),
                                    (double) responseTime,
                                    System.currentTimeMillis()
                            );

                    gatewayLatencyHistoryRepository.save(history);

                    gateway.setFailureCount(0);
                    gateway.setCircuitOpen(false);
                    gateway.setCircuitOpenedAt(null);

                } else {

                    throw new RuntimeException(
                            "Gateway Unreachable"
                    );
                }

            } catch (Exception e) {

                System.out.println(
                        "Error checking "
                                + gateway.getGatewayName()
                );

                gateway.setStatus("DOWN");

                gateway.setResponseTime(0.0);

                gateway.setFailureCount(
                        gateway.getFailureCount() + 1
                );

                System.out.println(
                        "Failure Count : "
                                + gateway.getFailureCount()
                );


                // ==============================
                // OPEN CIRCUIT AFTER 3 FAILURES
                // ==============================

                if (gateway.getFailureCount() >= 3) {

                    gateway.setCircuitOpen(true);

                    gateway.setCircuitOpenedAt(
                            System.currentTimeMillis()
                    );

                    System.out.println(
                            gateway.getGatewayName()
                                    + " | Circuit OPENED"
                    );
                }
            }


            // ==============================
            // SAVE GATEWAY
            // ==============================

            gatewayRepository.save(gateway);


            // ==============================
            // LOG
            // ==============================

            System.out.println(
                    "-------------------------------------"
            );

            System.out.println(
                    "Gateway       : "
                            + gateway.getGatewayName()
            );

            System.out.println(
                    "Status        : "
                            + gateway.getStatus()
            );

            System.out.println(
                    "Response Time : "
                            + gateway.getResponseTime()
                            + " ms"
            );

            System.out.println(
                    "Failures      : "
                            + gateway.getFailureCount()
            );

            System.out.println(
                    "Circuit Open  : "
                            + gateway.isCircuitOpen()
            );

            System.out.println(
                    "-------------------------------------"
            );
        }
    }


    // =====================================================
    // CHECK GATEWAY
    // =====================================================

    private long checkGateway(String url) {

        int retries = 3;

        while (retries > 0) {

            long startTime = System.currentTimeMillis();

            try {

                restTemplate.getForEntity(
                        url,
                        String.class
                );

                long endTime =
                        System.currentTimeMillis();

                long responseTime =
                        endTime - startTime;

                System.out.println(
                        "Gateway Reachable"
                                + " | Response Time : "
                                + responseTime
                                + " ms"
                );

                return responseTime;

            }

            // ==========================================
            // HTTP RESPONSE RECEIVED
            // ==========================================

            catch (HttpStatusCodeException e) {

                long endTime =
                        System.currentTimeMillis();

                long responseTime =
                        endTime - startTime;

                HttpStatusCode status =
                        e.getStatusCode();

                int code = status.value();


                // Provider is reachable even if
                // authentication is required
                if (code == 200 ||
                        code == 401 ||
                        code == 403 ||
                        code == 405) {

                    System.out.println(
                            "Gateway Reachable"
                                    + " | HTTP "
                                    + code
                                    + " | Response Time : "
                                    + responseTime
                                    + " ms"
                    );

                    return responseTime;
                }


                if (code >= 500) {

                    System.out.println(
                            "Server Error : "
                                    + code
                    );

                } else {

                    System.out.println(
                            "HTTP Error : "
                                    + code
                    );
                }

                retries--;

                System.out.println(
                        "Retry Remaining : "
                                + retries
                );
            }


            // ==========================================
            // CONNECTION / TIMEOUT / DNS FAILURE
            // ==========================================

            catch (Exception e) {

                long endTime =
                        System.currentTimeMillis();

                long responseTime =
                        endTime - startTime;

                System.out.println(
                        "Connection Failed"
                                + " | Time : "
                                + responseTime
                                + " ms"
                );

                System.out.println(
                        "Reason : "
                                + e.getMessage()
                );

                retries--;

                System.out.println(
                        "Retry Remaining : "
                                + retries
                );
            }
        }

        return -1;
    }
}