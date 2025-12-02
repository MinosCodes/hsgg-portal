package com.hsgg.security.auth.dtos;

public record AuthResponseDto(String token, String role, String firstname, String lastname) {
}
