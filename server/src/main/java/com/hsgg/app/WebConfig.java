package com.hsgg.app;

import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
@ConfigurationPropertiesScan
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		Path clientPath = Path.of("").toAbsolutePath().resolve("../client");
		registry.addResourceHandler("/**")
				.addResourceLocations("file:" + clientPath + "/");
	}
}
