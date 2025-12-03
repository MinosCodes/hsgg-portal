package com.hsgg.features.subjects;

import com.hsgg.features.topics.TopicSummaryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

	private final SubjectService subjectService;

	public SubjectController(SubjectService subjectService) {
		this.subjectService = subjectService;
	}

	@GetMapping
	public List<SubjectDto> getSubjects() {
		return subjectService.getAllSubjects();
	}

	@GetMapping("/{subjectId}/topics")
	public List<TopicSummaryDto> getTopicsBySubject(@PathVariable Long subjectId) {
		return subjectService.getTopicsBySubjectId(subjectId);
	}

	@PostMapping
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> create(@RequestBody SubjectRequest req) {
		return ResponseEntity.status(201).body(subjectService.create(req).getId());
	}

	@PutMapping("/{subjectId}")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> update(@PathVariable Long subjectId, @RequestBody SubjectRequest req) {
		subjectService.update(subjectId, req);
		return ResponseEntity.ok(Map.of("message", "updated"));
	}

	@DeleteMapping("/{subjectId}")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> delete(@PathVariable Long subjectId) {
		subjectService.delete(subjectId);
		return ResponseEntity.ok(Map.of("message", "deleted"));
	}
}
