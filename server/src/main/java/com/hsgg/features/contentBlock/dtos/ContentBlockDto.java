package com.hsgg.features.contentBlock.dtos;

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
