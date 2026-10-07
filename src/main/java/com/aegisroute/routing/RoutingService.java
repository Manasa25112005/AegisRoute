package com.aegisroute.routing;

import com.aegisroute.dto.RoutingResponse;
import com.aegisroute.service.GatewayRoutingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoutingService {

    @Autowired
    private GatewayRoutingService gatewayRoutingService;

    public String chooseGateway() {

        RoutingResponse response =
                gatewayRoutingService.getBestGateway();

        if (response == null) {
            return "No Gateway Available";
        }

        return "Selected Gateway : "
                + response.getGateway().getGatewayName();
    }
}