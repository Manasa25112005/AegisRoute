package com.aegisroute.routing;

import com.aegisroute.entity.Gateway;
import com.aegisroute.repository.GatewayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class RoutingService {

    @Autowired
    private GatewayRepository gatewayRepository;

    public String chooseGateway() {

        List<Gateway> gateways = gatewayRepository.findAll();

        return gateways.stream()
                .filter(g -> "UP".equalsIgnoreCase(g.getStatus()))
                .min(Comparator.comparing(Gateway::getResponseTime))
                .map(Gateway::getGatewayName)
                .orElse("No Gateway Available");
    }
}