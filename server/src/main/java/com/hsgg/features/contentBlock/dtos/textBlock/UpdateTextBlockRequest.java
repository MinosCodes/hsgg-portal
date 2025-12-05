package com.hsgg.features.contentBlock.dtos.textBlock;

import java.util.Optional;

public record UpdateTextBlockRequest(
		Optional<String> newTitle,
		Optional<Integer> newPosition,
		Optional<String> newText
) {

}
