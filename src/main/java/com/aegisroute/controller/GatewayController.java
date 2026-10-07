package com.aegisroute.controller;

import com.aegisroute.entity.Gateway;
import com.aegisroute.service.GatewayService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/gateways")
public class GatewayController {

    @Autowired
    private GatewayService gatewayService;


    // ==============================
    // GET ALL GATEWAYS
    // ==============================

    @GetMapping
    public List<Gateway> getAllGateways() {

        return gatewayService.getAllGateways();

    }


    // ==============================
    // ADD NEW GATEWAY
    // ==============================

    @PostMapping
    public Gateway addGateway(
            @RequestBody Gateway gateway) {

        return gatewayService.saveGateway(gateway);

    }


    // ==============================
    // UPDATE GATEWAY
    // ==============================

    @PutMapping("/{id}")
    public Gateway updateGateway(
            @PathVariable Long id,
            @RequestBody Gateway gateway) {

        return gatewayService.updateGateway(
                id,
                gateway
        );

    }


    // ==============================
    // DELETE GATEWAY
    // ==============================

    @DeleteMapping("/{id}")
    public void deleteGateway(
            @PathVariable Long id) {

        gatewayService.deleteGateway(id);

    }

}