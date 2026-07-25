package com.aegisroute;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AegisrouteApplication {

	public static void main(String[] args) {
		SpringApplication.run(AegisrouteApplication.class, args);
	}
}