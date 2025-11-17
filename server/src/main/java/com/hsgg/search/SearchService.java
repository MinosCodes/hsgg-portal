package com.hsgg.search;

import com.hsgg.contentBlock.ContentBlockService;
import com.hsgg.subjects.SubjectService;
import com.hsgg.topics.TopicService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
public class SearchService {

    private final SubjectService subjectService;
    private final TopicService topicService;
    private final ContentBlockService contentBlockService;

    public SearchService(SubjectService subjectService, TopicService topicService, ContentBlockService contentBlockService) {
        this.subjectService = subjectService;
        this.topicService = topicService;
        this.contentBlockService = contentBlockService;
    }

    public List<SearchResultDto> search(String query) {
        if (query == null || query.isEmpty()) {
            return new ArrayList<>();
        }

        String q = query.trim().toLowerCase();
        return Stream.of(
                        subjectService.search(q),
                        topicService.search(q),
                        contentBlockService.search(q)
                )
                .flatMap(List::stream)
                .toList();
    }
}
