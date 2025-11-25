package com.hsgg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HsggApplication {

	public static void main(String[] args) {
		SpringApplication.run(HsggApplication.class, args);
	}
}
