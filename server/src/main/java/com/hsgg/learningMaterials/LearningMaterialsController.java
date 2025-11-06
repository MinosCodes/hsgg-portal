package com.hsgg.learningMaterials;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/learningMaterials")
public class LearningMaterialsController {
    @GetMapping
    public LearningMaterialsListDTO getLearningMaterialsList(LearningMaterialsService learningMaterialsService) {
        return learningMaterialsService.listFileNames();
    }
}
