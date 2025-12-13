package com.hsgg.features.files.dto;

import com.hsgg.features.files.FileEntity;

public record FileDto(
		Long id,
		String originalName,
		String mimeType,
		Long size,
		Long topicId
) {
	public static FileDto fromEntity(FileEntity file) {
		return new FileDto(
				file.getId(),
				file.getOriginalName(),
				file.getMimeType(),
				file.getSize(),
				file.getTopic() != null ? file.getTopic().getId() : null
		);
	}
}