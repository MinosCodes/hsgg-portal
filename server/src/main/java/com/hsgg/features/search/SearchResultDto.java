package com.hsgg.search;

public record SearchResultDto(
        String type, // "subject", "topic", "contentBlock"
        String title,
        String snippet,
        Long subjectId,
        Long topicId,
        Long contentBlockId
) {}