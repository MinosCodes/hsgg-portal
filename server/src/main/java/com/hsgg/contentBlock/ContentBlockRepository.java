package com.hsgg.contentBlock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContentBlockRepository extends JpaRepository<ContentBlock, Long> {

    List<ContentBlock> findByTopic_IdOrderByPositionAsc(Long topicId);

    @Query("""
        SELECT b FROM ContentBlock b
        WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :q, '%'))
           OR (b.text IS NOT NULL AND LOWER(b.text) LIKE LOWER(CONCAT('%', :q, '%')))
    """)
    List<ContentBlock> search(@Param("q") String q);
}