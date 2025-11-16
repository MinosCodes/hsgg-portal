package com.hsgg.topics;

import com.hsgg.exceptions.NotFoundException;
import com.hsgg.search.SearchResultDto;
import com.hsgg.subjects.SubjectDto;
import com.hsgg.contentBlock.ContentBlock;
import com.hsgg.contentBlock.ContentBlockDto;
import com.hsgg.contentBlock.ContentBlockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

    private final TopicRepository topicRepository;
    private final ContentBlockRepository contentBlockRepository;

    public TopicService(TopicRepository topicRepository,
                            ContentBlockRepository contentBlockRepository) {
        this.topicRepository = topicRepository;
        this.contentBlockRepository = contentBlockRepository;
    }

    public TopicDetailDto getTopicDetail(String topicSlug) {
        Topic topic = topicRepository.findBySlug(topicSlug)
                .orElseThrow(() -> new NotFoundException("Topic not found: " + topicSlug));

        return new TopicDetailDto(
                topic.getId(),
                topic.getSlug(),
                topic.getTitle(),
                topic.getDescription(),
                new SubjectDto(
                        topic.getSubject().getId(),
                        topic.getSubject().getSlug(),
                        topic.getSubject().getName(),
                        topic.getSubject().getDescription()
                )
        );
    }

    public TopicContentResponseDto getTopicContent(String topicSlug) {
        Topic topic = topicRepository.findBySlug(topicSlug)
                .orElseThrow(() -> new NotFoundException("Topic not found: " + topicSlug));

        List<ContentBlock> blocks =
                contentBlockRepository.findByTopic_IdOrderByPositionAsc(topic.getId());

        List<ContentBlockDto> blockDtos = blocks.stream()
                .map(b -> new ContentBlockDto(
                        b.getId(),
                        b.getType().name(),
                        b.getTitle(),
                        b.getPosition(),
                        b.getText(),
                        b.getReferenceTopic() != null ? b.getReferenceTopic().getSlug() : null,
                        b.getFile() != null ? "/api/files/" + b.getFile().getId() + "/download" : null
                ))
                .toList();

        return new TopicContentResponseDto(topic.getSlug(), blockDtos);
    }

    public List<SearchResultDto> search(String query) {
        return topicRepository.search(query)
                .stream()
                .map(t -> new SearchResultDto(
                        "topic",
                        t.getTitle(),
                        t.getDescription(),
                        t.getSubject().getSlug(),
                        t.getSlug(),
                        null
                ))
                .toList();
    }
}
