package com.hsgg.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@ConfigurationPropertiesScan
public class AppProperties {
    private String learningMaterialsDir;

    public String getLearningMaterialsDir() {
        return learningMaterialsDir;
    }

    public void setLearningMaterialsDir(String learningMaterialsDir) {
        this.learningMaterialsDir = learningMaterialsDir;
    }
}
