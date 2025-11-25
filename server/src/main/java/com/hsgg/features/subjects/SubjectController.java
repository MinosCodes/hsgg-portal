package com.hsgg.features.subjects;

import com.hsgg.features.topics.TopicSummaryDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubjectController {

	private final SubjectService subjectService;

	public SubjectController(SubjectService subjectService) {
		this.subjectService = subjectService;
	}

	@GetMapping("/subjects")
	public List<SubjectDto> getSubjects() {
		return subjectService.getAllSubjects();
	}

	@GetMapping("/subjects/{subjectId}/topics")
	public List<TopicSummaryDto> getTopicsBySubject(@PathVariable Long subjectId) {
		return subjectService.getTopicsBySubjectId(subjectId);
	}
}
