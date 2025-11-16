package com.hsgg.search;

import com.hsgg.subjects.Subject;
import com.hsgg.subjects.SubjectRepository;
import com.hsgg.topics.contentBlock.ContentBlock;
import com.hsgg.topics.contentBlock.ContentBlockRepository;
import com.hsgg.topics.Topic;
import com.hsgg.topics.TopicRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;
    private final ContentBlockRepository contentBlockRepository;

    public SearchService(SubjectRepository subjectRepository,
                             TopicRepository topicRepository,
                             ContentBlockRepository contentBlockRepository) {
        this.subjectRepository = subjectRepository;
        this.topicRepository = topicRepository;
        this.contentBlockRepository = contentBlockRepository;
    }

    public List<SearchResultDto> search(String query) {
        String q = query.toLowerCase();
        List<SearchResultDto> results = new ArrayList<>();

        for (Subject s : subjectRepository.findAll()) {
            if (s.getName().toLowerCase().contains(q)
                    || s.getSlug().toLowerCase().contains(q)
                    || s.getDescription().toLowerCase().contains(q)) {
                results.add(new SearchResultDto(
                        "subject",
                        s.getName(),
                        s.getDescription(),
                        s.getSlug(),
                        null,
                        null
                ));
            }
        }

        for (Topic t : topicRepository.findAll()) {
            boolean match =
                    t.getTitle().toLowerCase().contains(q)
                            || (t.getDescription() != null && t.getDescription().toLowerCase().contains(q))
                            || (t.getSlug().toLowerCase().contains(q));

            if (match) {
                results.add(new SearchResultDto(
                        "topic",
                        t.getTitle(),
                        t.getDescription(),
                        t.getSubject().getSlug(),
                        t.getSlug(),
                        null
                ));
            }
        }

        for (ContentBlock b : contentBlockRepository.findAll()) {

            if (b.getTitle().toLowerCase().contains(q) || (b.getText() != null && b.getText().toLowerCase().contains(q))) {
                results.add(new SearchResultDto(
                        "contentBlock",
                        b.getTitle(),
                        b.getText().substring(0, Math.min(200, b.getText().length())),
                        b.getTopic().getSubject().getSlug(),
                        b.getTopic().getSlug(),
                        b.getId()
                ));
            }
        }

        return results;
    }
}
