package com.hsgg.topics;

import com.hsgg.contentBlock.ContentBlockDto;

import java.util.List;

public record TopicContentResponseDto(
        Long topicId, // TODO: remove id from all dtos
        List<ContentBlockDto> blocks
) {}