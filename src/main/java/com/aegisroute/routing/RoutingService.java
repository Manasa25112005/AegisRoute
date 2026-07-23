package com.aegisroute.routing;

import org.springframework.stereotype.Service;

@Service
public class RoutingService {

    public String chooseGateway() {
        return "Gateway A";
    }
}