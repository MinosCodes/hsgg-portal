package com.hsgg.features.files;

import com.hsgg.app.exceptions.NotFoundException;
import com.hsgg.features.files.dto.FileDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.List;

@Service
public class FileService {

	private final FileRepository fileRepository;

	@Value("${learning-materials-dir:data}")
	private String baseDir;

	public FileService(FileRepository fileRepository) {
		this.fileRepository = fileRepository;
	}

	public List<FileDto> getAllFiles() {
		return fileRepository.findAll()
				.stream()
				.map(FileDto::fromEntity)
				.toList();
	}

	public FileDownload loadForDownload(Long id) {
		FileEntity file = fileRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("File not found: " + id));

		Path filePath = Path.of("../", baseDir, file.getStoredName());
		FileSystemResource resource = new FileSystemResource(filePath.toFile());

		if (!resource.exists()) {
			throw new NotFoundException("Stored file missing: " + file.getStoredName());
		}

		return new FileDownload(
				file.getOriginalName(),
				file.getMimeType(),
				resource
		);
	}

	public record FileDownload(String filename, String contentType, Resource resource) {
	}
}
