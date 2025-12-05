package com.hsgg.features.topics.dtos;

public record CreateTopicRequest(
		Long subjectId,
		String title,
		String description
) {
}
