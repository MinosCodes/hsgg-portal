package com.hsgg.features.topics;

import com.hsgg.app.exceptions.NotFoundException;
import com.hsgg.features.contentBlock.ContentBlockRepository;
import com.hsgg.features.contentBlock.dtos.ContentBlockDto;
import com.hsgg.features.search.SearchResultDto;
import com.hsgg.features.subjects.Subject;
import com.hsgg.features.subjects.SubjectRepository;
import com.hsgg.features.topics.dtos.CreateTopicRequest;
import com.hsgg.features.topics.dtos.TopicDetailDto;
import com.hsgg.features.topics.dtos.UpdateTopicRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

	private final SubjectRepository subjectRepository;
	private final TopicRepository topicRepository;
	private final ContentBlockRepository contentBlockRepository;

	public TopicService(
			SubjectRepository subjectRepository,
			TopicRepository topicRepository,
			ContentBlockRepository contentBlockRepository) {
		this.subjectRepository = subjectRepository;
		this.topicRepository = topicRepository;
		this.contentBlockRepository = contentBlockRepository;
	}

	public TopicDetailDto getTopicDetail(Long topicId) {
		Topic topic = topicRepository.findById(topicId)
				.orElseThrow(() -> new NotFoundException("Topic not found: " + topicId));

		return new TopicDetailDto(
				topic.getId(),
				topic.getTitle(),
				topic.getDescription()
		);
	}

	public List<ContentBlockDto> getTopicContent(Long topicId) {
		topicRepository.findById(topicId)
				.orElseThrow(() -> new NotFoundException("Topic not found: " + topicId));

		return contentBlockRepository
				.findByTopic_Id(topicId)
				.stream()
				.map(b -> new ContentBlockDto(
						b.getId(),
						b.getType().name(),
						b.getTitle(),
						b.getPosition(),
						b.getText(),
						b.getReferenceTopic() != null ? b.getReferenceTopic().getId() : null,
						b.getFile() != null ? "/api/files/" + b.getFile().getId() + "/download" : null
				))
				.toList();
	}

	public List<SearchResultDto> search(String query) {
		return topicRepository.search(query)
				.stream()
				.map(t -> new SearchResultDto(
						"topic",
						t.getTitle(),
						t.getDescription(),
						t.getSubject().getId(),
						t.getId(),
						null
				))
				.toList();
	}

	public void create(CreateTopicRequest req) {
		Subject subject = subjectRepository.findById(req.subjectId())
				.orElseThrow(() -> new NotFoundException("Subject not found"));

		Topic topic = new Topic();
		topic.setSubject(subject);
		topic.setTitle(req.title());
		topic.setDescription(req.description());
		topicRepository.save(topic);
	}

	public void update(Long id, UpdateTopicRequest req) {
		Topic topic = topicRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Topic not found"));

		req.title().ifPresent(topic::setTitle);
		req.description().ifPresent(topic::setDescription);
		topicRepository.save(topic);
	}

	public void delete(Long id) {
		topicRepository.deleteCascade(id);
	}
}
