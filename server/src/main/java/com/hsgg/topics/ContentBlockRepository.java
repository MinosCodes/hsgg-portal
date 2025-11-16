package com.hsgg.topics;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentBlockRepository extends JpaRepository<ContentBlock, Long> {

    List<ContentBlock> findByTopic_IdOrderByPositionAsc(Long topicId);
}