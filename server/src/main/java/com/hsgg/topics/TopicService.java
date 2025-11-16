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

    public TopicDetailDto getTopicDetail(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new NotFoundException("Topic not found: " + topicId));

        return new TopicDetailDto(
                topic.getId(),
                topic.getTitle(),
                topic.getDescription(),
                new SubjectDto(
                        topic.getSubject().getId(),
                        topic.getSubject().getName(),
                        topic.getSubject().getDescription()
                )
        );
    }

    public TopicContentResponseDto getTopicContent(Long topicId) {
        topicRepository.findById(topicId)
                .orElseThrow(() -> new NotFoundException("Topic not found: " + topicId));

        List<ContentBlock> blocks =
                contentBlockRepository.findByTopic_IdOrderByPositionAsc(topicId);

        List<ContentBlockDto> blockDtos = blocks.stream()
                .map(b -> new ContentBlockDto(
                        b.getId(),
                        b.getType().name(),
                        b.getTitle(),
                        b.getPosition(),
                        b.getText(),
                        b.getReferenceTopic() != null ? b.getReferenceTopic().getId() : null,
                        b.getFile() != null ? "/api/files/" + b.getFile().getId() + "/download" : null
                ))
                .toList();

        return new TopicContentResponseDto(topicId, blockDtos);
    }

    public List<SearchResultDto> search(String query) {
        return topicRepository.search(query)
                .stream()
                .map(t -> new SearchResultDto(
                        "topic",
                        t.getTitle(),
                        t.getDescription(),
                        t.getSubject().getId(),
                        t.getId(),
                        null
                ))
                .toList();
    }
}
