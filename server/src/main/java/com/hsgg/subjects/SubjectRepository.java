package com.hsgg.subjects;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    @Query("""
        SELECT s FROM Subject s
        WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(s.description) LIKE LOWER(CONCAT('%', :q, '%'))
        """)
    List<Subject> search(@Param("q") String q);
}