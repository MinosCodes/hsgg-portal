package com.hsgg.features.contentBlock;

public record ContentBlockDto(
		Long id,
		String type, // "text", "reference", "file"
		String title,
		int position,
		String text,
		Long referenceTopicId,
		String fileUrl
) {
}
