package com.hsgg.controllers;

import com.hsgg.contentBlock.ContentBlockDto;
import com.hsgg.files.FileService;
import com.hsgg.search.SearchResultDto;
import com.hsgg.search.SearchService;
import com.hsgg.subjects.SubjectDto;
import com.hsgg.subjects.SubjectService;
import com.hsgg.topics.TopicDetailDto;
import com.hsgg.topics.TopicService;
import com.hsgg.topics.TopicSummaryDto;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicController {
    private final SubjectService subjectService;
    private final TopicService topicService;
    private final FileService fileService;
    private final SearchService searchService;

    public PublicController(SubjectService subjectService, TopicService topicService, FileService fileService, SearchService searchService) {
        this.subjectService = subjectService;
        this.topicService = topicService;
        this.fileService = fileService;
        this.searchService = searchService;
    }

    @GetMapping("/subjects")
    public List<SubjectDto> getSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/subjects/{subjectId}/topics")
    public List<TopicSummaryDto> getTopicsBySubject(@PathVariable Long subjectId) {
        return subjectService.getTopicsBySubjectId(subjectId);
    }

    @GetMapping("/topics/{topicId}")
    public TopicDetailDto getTopic(@PathVariable Long topicId) {
        return topicService.getTopicDetail(topicId);
    }

    @GetMapping("/topics/{topicId}/content")
    public List<ContentBlockDto> getTopicContent(@PathVariable Long topicId) {
        return topicService.getTopicContent(topicId);
    }

    @GetMapping("/search")
    public List<SearchResultDto> search(@RequestParam("q") String query) {
        return searchService.search(query);
    }

    @GetMapping("/files/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        FileService.FileDownload fileDownload = fileService.loadForDownload(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileDownload.filename() + "\"")
                .contentType(MediaType.parseMediaType(fileDownload.contentType()))
                .body(fileDownload.resource());
    }

}
