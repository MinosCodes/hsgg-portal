package com.hsgg.features.topics;

import com.hsgg.features.contentBlock.ContentBlockDto;
import com.hsgg.features.topics.dtos.CreateTopicRequest;
import com.hsgg.features.topics.dtos.TopicDetailDto;
import com.hsgg.features.topics.dtos.UpdateTopicRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

	private final TopicService topicService;

	public TopicController(TopicService topicService) {
		this.topicService = topicService;
	}

	@GetMapping("/{topicId}")
	public TopicDetailDto getTopic(@PathVariable Long topicId) {
		return topicService.getTopicDetail(topicId);
	}

	@GetMapping("/{topicId}/content")
	public List<ContentBlockDto> getTopicContent(@PathVariable Long topicId) {
		return topicService.getTopicContent(topicId);
	}

	@PostMapping()
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> create(@RequestBody CreateTopicRequest req) {
		topicService.create(req);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PutMapping("/{topicId}")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> update(@PathVariable Long topicId, @RequestBody UpdateTopicRequest req) {
		topicService.update(topicId, req);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/{topicId}")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> delete(@PathVariable Long topicId) {
		topicService.delete(topicId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
