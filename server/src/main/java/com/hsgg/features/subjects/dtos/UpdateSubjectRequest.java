package com.hsgg.features.subjects.dtos;

import java.util.Optional;

public record UpdateSubjectRequest(
		Optional<String> newName,
		Optional<String> newDescription) {
}
