package com.hsgg.features.files;

import com.hsgg.app.exceptions.NotFoundException;
import com.hsgg.features.files.dto.FileDto;
import com.hsgg.features.topics.TopicRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.List;

@Service
public class FileService {

	private final FileRepository fileRepository;
	private final TopicRepository topicRepository;

	@Value("${learning-materials-dir:data}")
	private String baseDir;

	public FileService(FileRepository fileRepository, TopicRepository topicRepository) {
		this.fileRepository = fileRepository;
		this.topicRepository = topicRepository;

	}

	public List<FileDto> getAllFiles() {
		return fileRepository.findAll()
				.stream()
				.map(FileDto::fromEntity)
				.toList();
	}

	public List<FileDto> getFilesByTopic(Long topicId) {
		if (!topicRepository.existsById(topicId)) {
			throw new NotFoundException("Topic not found: " + topicId);
		}

		return fileRepository.findByTopicId(topicId)
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
