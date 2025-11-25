package com.hsgg.features.files;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api")
public class FilesController {

	private final FileService fileService;

	public FilesController(FileService fileService) {
		this.fileService = fileService;
	}

	@GetMapping("/files/{id}/download")
	public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
		FileService.FileDownload fileDownload = fileService.loadForDownload(id);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,
						"attachment; filename=\"" + fileDownload.filename() + "\"")
				.contentType(MediaType.parseMediaType(fileDownload.contentType()))
				.body(fileDownload.resource());
	}
}
