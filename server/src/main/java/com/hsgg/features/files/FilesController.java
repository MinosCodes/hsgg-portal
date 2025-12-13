package com.hsgg.features.files;

import com.hsgg.features.files.dto.FileDownload;
import com.hsgg.features.files.dto.FileDto;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/files")
public class FilesController {

	private final FileService fileService;

	public FilesController(FileService fileService) {
		this.fileService = fileService;
	}

	@GetMapping
	public ResponseEntity<List<FileDto>> getFiles(
			@RequestParam(required = false) Long topicId
	) {
		if (topicId == null) {
			return ResponseEntity.ok(fileService.getAllFiles());
		} else {
			return ResponseEntity.ok(fileService.getFilesByTopic(topicId));
		}
	}

	@GetMapping("/{id}/download")
	public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
		FileDownload fileDownload = fileService.loadForDownload(id);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,
						"attachment; filename=\"" + fileDownload.filename() + "\"")
				.contentType(MediaType.parseMediaType(fileDownload.contentType()))
				.body(fileDownload.resource());
	}

	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
		fileService.deleteFile(id);
		return ResponseEntity.noContent().build();
	}
}
