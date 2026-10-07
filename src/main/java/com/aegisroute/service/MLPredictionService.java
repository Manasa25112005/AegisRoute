package com.aegisroute.service;

import com.aegisroute.ml.PredictionRequest;
import com.aegisroute.ml.PredictionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MLPredictionService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String ML_API =
            "http://localhost:5001/predict";

    public PredictionResponse predictGateway(PredictionRequest request) {

        return restTemplate.postForObject(
                ML_API,
                request,
                PredictionResponse.class
        );
    }
}