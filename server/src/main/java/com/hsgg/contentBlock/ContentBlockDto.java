package com.hsgg.contentBlock;

public record ContentBlockDto(
        Long id,
        String type,               // "text", "reference", "file"
        String title,
        int position,
        String text,               // nullable for text-blocks only
        String referenceTopicSlug, // nullable for reference-blocks only
        String fileUrl             // nullable for file-blocks
) {}
