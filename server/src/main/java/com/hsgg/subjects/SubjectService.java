package com.hsgg.subjects;

import com.hsgg.exceptions.NotFoundException;
import com.hsgg.topics.Topic;
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
                        s.getSlug(),
                        s.getName(),
                        s.getDescription()
                ))
                .toList();
    }

    public List<TopicSummaryDto> getTopicsBySubjectSlug(String subjectSlug) {
        Subject subject = subjectRepository.findBySlug(subjectSlug)
                .orElseThrow(() -> new NotFoundException("Subject not found: " + subjectSlug));

        List<Topic> topics = topicRepository.findBySubject_SlugOrderByIdAsc(subjectSlug);

        return topics.stream()
                .map(t -> new TopicSummaryDto(
                        t.getId(),
                        t.getSlug(),
                        t.getTitle(),
                        t.getDescription()
                ))
                .toList();
    }
}
