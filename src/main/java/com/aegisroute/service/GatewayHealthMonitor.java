package com.aegisroute.service;

import com.aegisroute.entity.Gateway;
import com.aegisroute.repository.GatewayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GatewayHealthMonitor {

    @Autowired
    private GatewayRepository gatewayRepository;

    @Scheduled(fixedRate = 30000)
    public void checkGatewayHealth() {

        System.out.println("Checking gateway health...");

        List<Gateway> gateways = gatewayRepository.findAll();

        for (Gateway gateway : gateways) {
            System.out.println(
                    gateway.getGatewayName()
                            + " | Status: "
                            + gateway.getStatus()
                            + " | Response Time: "
                            + gateway.getResponseTime()
                            + " ms"
            );
        }
    }
}
