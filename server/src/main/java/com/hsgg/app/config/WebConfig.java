package com.hsgg.app.config;

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
		Path contentPath = clientPath.resolve("content");
		
		// Serve content files (PDFs, docs, etc.)
		registry.addResourceHandler("/content/**")
				.addResourceLocations("file:" + contentPath + "/");
		
		// Serve all other static files (HTML, CSS, JS)
		registry.addResourceHandler("/**")
				.addResourceLocations("file:" + clientPath + "/");
	}
}
