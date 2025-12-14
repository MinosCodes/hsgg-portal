package com.hsgg.features.files;

import com.hsgg.app.exceptions.NotFoundException;
import com.hsgg.features.files.dto.FileDownload;
import com.hsgg.features.files.dto.FileDto;
import com.hsgg.features.topics.Topic;
import com.hsgg.features.topics.TopicRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

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

		Path filePath = this.getFilePath(file.getStoredName());
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

	public void delete(Long id) {
		FileEntity file = fileRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("File not found: " + id));

		Path filePath = this.getFilePath(file.getStoredName());

		try {
			Files.deleteIfExists(filePath);
		} catch (IOException e) {
			fileRepository.delete(file);
			throw new RuntimeException("File not found: " + id);
		}

		fileRepository.delete(file);
	}

	public FileDto upload(MultipartFile file, Long topicId) {
		if (file.isEmpty()) {
			throw new IllegalArgumentException("File must not be empty");
		}

		Topic topic = topicRepository.findById(topicId)
				.orElseThrow(() -> new NotFoundException("Topic not found: " + topicId));

		String originalName = file.getOriginalFilename();
		String storedName = UUID.randomUUID() + "_" + originalName;

		Path uploadDir = Path.of("../", baseDir);
		Path targetPath = uploadDir.resolve(storedName);

		try {
			Files.createDirectories(uploadDir);
			file.transferTo(targetPath);
		} catch (IOException e) {
			throw new RuntimeException("Failed to store file", e);
		}

		FileEntity entity = new FileEntity();
		entity.setOriginalName(originalName);
		entity.setStoredName(storedName);
		entity.setMimeType(file.getContentType());
		entity.setSize(file.getSize());
		entity.setTopic(topic);

		FileEntity saved = fileRepository.save(entity);

		return FileDto.fromEntity(saved);
	}

	private Path getFilePath(String storedName) {
		return Path.of("../", baseDir, storedName);
	}
}
