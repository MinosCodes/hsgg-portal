package com.hsgg.features.files;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long> {

	List<FileEntity> findByTopicId(Long topicId);
}