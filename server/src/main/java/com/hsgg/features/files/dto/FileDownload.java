package com.hsgg.features.files.dto;

import org.springframework.core.io.Resource;

public record FileDownload(
		String filename,
		String contentType,
		Resource resource) {
}