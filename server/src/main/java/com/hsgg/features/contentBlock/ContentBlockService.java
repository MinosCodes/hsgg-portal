package com.hsgg.features.contentBlock;

import com.hsgg.app.exceptions.NotFoundException;
import com.hsgg.features.contentBlock.dtos.ContentBlockDto;
import com.hsgg.features.contentBlock.dtos.textBlock.CreateTextBlockRequest;
import com.hsgg.features.contentBlock.dtos.textBlock.UpdateTextBlockRequest;
import com.hsgg.features.search.SearchResultDto;
import com.hsgg.features.topics.Topic;
import com.hsgg.features.topics.TopicRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentBlockService {
	private final ContentBlockRepository contentBlockRepository;
	private final TopicRepository topicRepository;

	public ContentBlockService(ContentBlockRepository contentBlockRepository, TopicRepository topicRepository) {
		this.contentBlockRepository = contentBlockRepository;
		this.topicRepository = topicRepository;
	}

	public List<SearchResultDto> search(String query) {
		return contentBlockRepository.search(query)
				.stream()
				.map(b -> new SearchResultDto(
						"contentBlock",
						b.getTitle(),
						b.getText(),
						b.getTopic().getSubject().getId(),
						b.getTopic().getId(),
						b.getId()
				))
				.toList();
	}

	public ContentBlockDto get(Long id) {
		ContentBlock b = contentBlockRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Content block not found: " + id));

		return new ContentBlockDto(
				b.getId(),
				b.getType().name(),
				b.getTitle(),
				b.getPosition(),
				b.getText(),
				b.getReferenceTopic() != null ? b.getReferenceTopic().getId() : null,
				b.getFile() != null ? "/api/files/" + b.getFile().getId() + "/download" : null
		);
	}

	public void createText(CreateTextBlockRequest req) throws BadRequestException {
		Topic topic = topicRepository.findById(req.topicId())
				.orElseThrow(() -> new NotFoundException("Topic not found"));

		ContentBlock block = new ContentBlock();
		block.setTopic(topic);
		block.setType(ContentBlockType.text);
		block.setTitle(requireNonBlank(req.title(), "Title is required"));
		block.setPosition(req.position());
		block.setText(requireNonBlank(req.text(), "Text is required for TEXT block"));
		block.setFile(null);
		block.setReferenceTopic(null);

		contentBlockRepository.save(block);
	}

	public void delete(Long id) {
		ContentBlock block = contentBlockRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Content block not found"));
		contentBlockRepository.delete(block);
	}

	public void updateText(Long id, UpdateTextBlockRequest req) throws BadRequestException {
		ContentBlock block = findBlock(id, ContentBlockType.text);
		req.newPosition().ifPresent(block::setPosition);
		req.newText().ifPresent(block::setText);
		req.newTitle().ifPresent(block::setTitle);

		contentBlockRepository.save(block);
	}

	private ContentBlock findBlock(Long id, ContentBlockType expectedType) throws BadRequestException {
		ContentBlock block = contentBlockRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Content block not found"));
		if (block.getType() != expectedType) {
			throw new BadRequestException(
					"Block type mismatch. Expected: " + expectedType + ", found: " + block.getType()
			);
		}
		return block;
	}

	private String requireNonBlank(String value, String message) throws BadRequestException {
		if (value == null || value.isBlank()) {
			throw new BadRequestException(message);
		}
		return value;
	}
}
