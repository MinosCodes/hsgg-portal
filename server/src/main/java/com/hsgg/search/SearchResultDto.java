package com.hsgg.search;

public record SearchResultDto(
        String type,            // "subject", "topic", "contentBlock"
        String title,
        String snippet,
        String subjectSlug,
        String topicSlug,
        Long contentBlockId
) {}