package com.hsgg.controllers;

import com.hsgg.files.FileService;
import com.hsgg.subjects.SubjectService;
import com.hsgg.topics.TopicService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PublicController {
    private final SubjectService subjectService;
    private final TopicService topicService;
    private final FileService fileService;

    public PublicController(SubjectService subjectService, TopicService topicService, FileService fileService) {
        this.subjectService = subjectService;
        this.topicService = topicService;
        this.fileService = fileService;
    }
}
