package com.aegisroute.service;

import com.aegisroute.entity.Gateway;
import com.aegisroute.repository.GatewayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GatewayService {

    @Autowired
    private GatewayRepository gatewayRepository;

    public List<Gateway> getAllGateways() {
        return gatewayRepository.findAll();
    }

    public Gateway saveGateway(Gateway gateway) {
        return gatewayRepository.save(gateway);
    }
    public Gateway updateGateway(Long id, Gateway updatedGateway) {
        Gateway gateway = gatewayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gateway not found"));

        gateway.setGatewayName(updatedGateway.getGatewayName());
        gateway.setUrl(updatedGateway.getUrl());
        gateway.setStatus(updatedGateway.getStatus());
        gateway.setResponseTime(updatedGateway.getResponseTime());

        return gatewayRepository.save(gateway);
    }
    public void deleteGateway(Long id) {
        gatewayRepository.deleteById(id);
    }
}