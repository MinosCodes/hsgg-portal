package com.hsgg.features.subjects;

import com.hsgg.app.exceptions.NotFoundException;
import com.hsgg.features.search.SearchResultDto;
import com.hsgg.features.subjects.dtos.CreateSubjectRequest;
import com.hsgg.features.subjects.dtos.SubjectDto;
import com.hsgg.features.subjects.dtos.UpdateSubjectRequest;
import com.hsgg.features.topics.TopicRepository;
import com.hsgg.features.topics.dtos.TopicSummaryDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

	private final SubjectRepository subjectRepository;
	private final TopicRepository topicRepository;

	public SubjectService(SubjectRepository subjectRepository,
						  TopicRepository topicRepository) {
		this.subjectRepository = subjectRepository;
		this.topicRepository = topicRepository;
	}

	public List<SubjectDto> getAllSubjects() {
		return subjectRepository.findAll().stream()
				.map(s -> new SubjectDto(
						s.getId(),
						s.getName(),
						s.getDescription()
				))
				.toList();
	}

	public List<TopicSummaryDto> getTopicsBySubjectId(Long subjectId) {
		subjectRepository.findById(subjectId)
				.orElseThrow(() -> new NotFoundException("Subject not found: " + subjectId));

		return topicRepository.findBySubjectId(subjectId)
				.stream()
				.map(t -> new TopicSummaryDto(
						t.getId(),
						t.getTitle(),
						t.getDescription()
				))
				.toList();
	}

	public List<SearchResultDto> search(String query) {
		return subjectRepository.search(query)
				.stream()
				.map(s -> new SearchResultDto(
						"subject",
						s.getName(),
						s.getDescription(),
						s.getId(),
						null,
						null
				))
				.toList();
	}

	public void create(CreateSubjectRequest request) {
		Subject subject = new Subject();
		subject.setName(request.name());
		subject.setDescription(request.description());
		subjectRepository.save(subject);
	}

	public void update(Long id, UpdateSubjectRequest request) {
		Subject subject = subjectRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Subject not found"));

		request.newName().ifPresent(subject::setName);
		request.newDescription().ifPresent(subject::setDescription);
		subjectRepository.save(subject);
	}

	public void delete(Long id) {
		Subject subject = subjectRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Subject not found"));

		subjectRepository.delete(subject);
	}
}
