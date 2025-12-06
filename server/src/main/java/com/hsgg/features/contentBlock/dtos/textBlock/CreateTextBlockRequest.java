package com.hsgg.features.contentBlock.dtos.textBlock;

import com.hsgg.features.contentBlock.dtos.CreateBlockRequest;

public record CreateTextBlockRequest(
		Long topicId,
		String title,
		Integer position,
		String text
) implements CreateBlockRequest {
}
