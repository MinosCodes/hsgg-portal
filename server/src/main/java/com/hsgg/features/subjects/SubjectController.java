package com.hsgg.features.subjects;

import com.hsgg.features.subjects.dtos.CreateSubjectDto;
import com.hsgg.features.subjects.dtos.SubjectDto;
import com.hsgg.features.subjects.dtos.UpdateSubjectRequest;
import com.hsgg.features.topics.TopicSummaryDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
	public ResponseEntity<?> create(@RequestBody CreateSubjectDto req) {
		subjectService.create(req);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PutMapping("/{subjectId}")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> update(@PathVariable Long subjectId, @RequestBody UpdateSubjectRequest req) {
		subjectService.update(subjectId, req);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/{subjectId}")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> delete(@PathVariable Long subjectId) {
		subjectService.delete(subjectId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
