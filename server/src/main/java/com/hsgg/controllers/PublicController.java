package com.hsgg.controllers;

import com.hsgg.files.FileService;
import com.hsgg.search.SearchResultDto;
import com.hsgg.subjects.SubjectDto;
import com.hsgg.subjects.SubjectService;
import com.hsgg.topics.TopicContentResponseDto;
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

    public PublicController(SubjectService subjectService, TopicService topicService, FileService fileService) {
        this.subjectService = subjectService;
        this.topicService = topicService;
        this.fileService = fileService;
    }

    @GetMapping("/subjects")
    public List<SubjectDto> getSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/subjects/{subjectSlug}/topics")
    public List<TopicSummaryDto> getTopicsBySubject(@PathVariable String subjectSlug) {
        return topicService.getTopicsBySubjectSlug(subjectSlug);
    }

    @GetMapping("/topics/{topicSlug}")
    public TopicDetailDto getTopic(@PathVariable String topicSlug) {
        return topicService.getTopicDetail(topicSlug);
    }

    @GetMapping("/topics/{topicSlug}/content")
    public TopicContentResponseDto getTopicContent(@PathVariable String topicSlug) {
        return topicService.getTopicContent(topicSlug);
    }

    @GetMapping("/search")
    public List<SearchResultDto> search(@RequestParam("q") String query) {
        return topicService.search(query);
    }

    @GetMapping("/files/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        FileService.FileDownload fileDownload = fileService.getFileForDownload(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileDownload.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(fileDownload.getContentType()))
                .body(fileDownload.getResource());
    }

}
