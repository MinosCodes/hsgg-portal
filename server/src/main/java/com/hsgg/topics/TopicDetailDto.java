package com.hsgg.topics;

import com.hsgg.subjects.SubjectDto;

public record TopicDetailDto(Long id, String title, String description, SubjectDto subject) {}
