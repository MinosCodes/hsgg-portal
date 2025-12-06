package com.hsgg.features.contentBlock.dtos.textBlock;

import java.util.Optional;

public record UpdateTextBlockRequest(
		Optional<String> title,
		Optional<Integer> position,
		Optional<String> text
) {

}
