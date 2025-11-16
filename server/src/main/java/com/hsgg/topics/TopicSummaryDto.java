package com.hsgg.topics;

public record TopicSummaryDto(
        Long id,
        String slug,
        String title,
        String description
) {}