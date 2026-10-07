package com.aegisroute.ml;

import com.aegisroute.ml.DatasetGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DatasetController {

    @Autowired
    private DatasetGenerator datasetGenerator;

    @GetMapping("/generate-dataset")
    public String generateDataset() {

        datasetGenerator.generateDataset(300);

        return "Dataset generated successfully!";
    }
}