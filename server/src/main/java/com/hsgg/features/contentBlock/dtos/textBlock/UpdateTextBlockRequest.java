package com.hsgg.features.contentBlock.dtos.textBlock;

import java.util.Optional;

public record UpdateTextBlockRequest(
		Long topicId,
		Optional<String> newTitle,
		Optional<Integer> newPosition,
		Optional<String> newText
) {

}
