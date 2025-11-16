package com.hsgg.topics;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TopicRepository extends JpaRepository<Topic, Long> {

    Optional<Topic> findBySlug(String slug);

    List<Topic> findBySubject_SlugOrderByIdAsc(String subjectSlug);

    @Query("""
        SELECT t FROM Topic t
        WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :q, '%'))
           OR (t.description IS NOT NULL AND LOWER(t.description) LIKE LOWER(CONCAT('%', :q, '%')))
           OR LOWER(t.slug) LIKE LOWER(CONCAT('%', :q, '%'))
        """)
    List<Topic> search(@Param("q") String q);
}