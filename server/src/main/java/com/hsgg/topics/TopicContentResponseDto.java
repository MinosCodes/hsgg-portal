package com.hsgg.topics;

import java.util.List;

public record TopicContentResponseDto(
        String topicSlug,
        List<ContentBlockDto> blocks
) {}