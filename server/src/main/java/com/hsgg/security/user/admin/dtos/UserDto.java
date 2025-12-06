package com.hsgg.security.user.admin.dtos;

public record UserDto(
		Long id,
		String firstname,
		String lastname,
		String username,
		String role
) {
}
