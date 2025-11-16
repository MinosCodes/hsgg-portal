package com.hsgg.contentBlock;

import com.hsgg.search.SearchResultDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentBlockService {
    private final ContentBlockRepository contentBlockRepository;

    public ContentBlockService(ContentBlockRepository contentBlockRepository) {
        this.contentBlockRepository = contentBlockRepository;
    }

    public List<SearchResultDto> search(String query) {
        return contentBlockRepository.search(query)
                .stream()
                .map(b -> new SearchResultDto(
                        "contentBlock",
                        b.getTitle(),
                        b.getText(),
                        b.getTopic().getSubject().getSlug(),
                        b.getTopic().getSlug(),
                        b.getId()
                ))
                .toList();
    }
}
