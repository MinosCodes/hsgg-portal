package com.hsgg.subjects;

import com.hsgg.exceptions.NotFoundException;
import com.hsgg.search.SearchResultDto;
import com.hsgg.topics.TopicRepository;
import com.hsgg.topics.TopicSummaryDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;

    public SubjectService(SubjectRepository subjectRepository,
                              TopicRepository topicRepository) {
        this.subjectRepository = subjectRepository;
        this.topicRepository = topicRepository;
    }

    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(s -> new SubjectDto(
                        s.getId(),
                        s.getName(),
                        s.getDescription()
                ))
                .toList();
    }

    public List<TopicSummaryDto> getTopicsBySubjectId(Long subjectId) {
        subjectRepository.findById(subjectId)
                .orElseThrow(() -> new NotFoundException("Subject not found: " + subjectId));

        return topicRepository.findBySubjectId(subjectId)
                .stream()
                .map(t -> new TopicSummaryDto(
                        t.getId(),
                        t.getTitle(),
                        t.getDescription()
                ))
                .toList();
    }

    public List<SearchResultDto> search(String query) {
        return subjectRepository.search(query)
                .stream()
                .map(s -> new SearchResultDto(
                        "subject",
                        s.getName(),
                        s.getDescription(),
                        s.getId(),
                        null,
                        null
                ))
                .toList();
    }
}
