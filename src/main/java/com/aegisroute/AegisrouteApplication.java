package com.aegisroute;

import com.aegisroute.ml.DatasetGenerator;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AegisrouteApplication {

	public static void main(String[] args) {
		SpringApplication.run(AegisrouteApplication.class, args);
	}

	//@Bean
	//CommandLineRunner generateDataset(DatasetGenerator datasetGenerator) {
	//	return args -> {
		//	datasetGenerator.generateDataset(1000);
	//	};
	//}
}