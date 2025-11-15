package com.hsgg;

import com.hsgg.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class HsggApplication {
	public static void main(String[] args) {
		SpringApplication.run(HsggApplication.class, args);
	}
}
