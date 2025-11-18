package com.hsgg.topics;

import com.hsgg.exceptions.NotFoundException;
import com.hsgg.features.contentBlock.ContentBlockDto;
import com.hsgg.features.contentBlock.ContentBlockRepository;
import com.hsgg.features.search.SearchResultDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

   private final TopicRepository topicRepository;
   private final ContentBlockRepository contentBlockRepository;

   public TopicService(TopicRepository topicRepository,
					   ContentBlockRepository contentBlockRepository) {
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
}
