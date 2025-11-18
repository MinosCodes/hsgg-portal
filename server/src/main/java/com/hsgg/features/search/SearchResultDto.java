package com.hsgg.features.search;

public record SearchResultDto(
		String type, // "subject", "topic", "contentBlock"
		String title,
		String snippet,
		Long subjectId,
		Long topicId,
		Long contentBlockId
) {
}