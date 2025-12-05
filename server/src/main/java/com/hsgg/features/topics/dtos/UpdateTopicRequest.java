package com.hsgg.features.topics.dtos;

import java.util.Optional;

public record UpdateTopicRequest(
		Optional<String> title,
		Optional<String> description
) {
}
