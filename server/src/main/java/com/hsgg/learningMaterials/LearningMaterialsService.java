package com.hsgg.learningMaterials;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LearningMaterialsService {
    private static final String LEARNING_MATERIALS_PATTERN = "classpath*:learningMaterials/*.pdf";


    public LearningMaterialsListDTO listFileNames() {
        return new LearningMaterialsListDTO(this.doListFileNames());
    }

    private Optional<List<String>> doListFileNames() {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        List<String> fileNames = new ArrayList<>();

        try {
            for (Resource resource : resolver.getResources(LearningMaterialsService.LEARNING_MATERIALS_PATTERN)) {
                fileNames.add(resource.getFilename());
            }
        } catch (IOException e) {
            e.printStackTrace();
            return Optional.empty();
        }

        return Optional.of(fileNames);
    }
}
