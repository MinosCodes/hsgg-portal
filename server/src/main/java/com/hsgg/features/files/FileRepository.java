package com.hsgg.features.files;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
}