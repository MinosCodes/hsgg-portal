package com.hsgg.topics;

import com.hsgg.topics.contentBlock.ContentBlockDto;

import java.util.List;

public record TopicContentResponseDto(
        String topicSlug,
        List<ContentBlockDto> blocks
) {}