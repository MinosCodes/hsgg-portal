package com.hsgg.features.topics;

import com.hsgg.features.contentBlock.ContentBlockDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TopicController {

	private final TopicService topicService;

	public TopicController(TopicService topicService) {
		this.topicService = topicService;
	}

	@GetMapping("/topics/{topicId}")
	public TopicDetailDto getTopic(@PathVariable Long topicId) {
		return topicService.getTopicDetail(topicId);
	}

	@GetMapping("/topics/{topicId}/content")
	public List<ContentBlockDto> getTopicContent(@PathVariable Long topicId) {
		return topicService.getTopicContent(topicId);
	}
}
