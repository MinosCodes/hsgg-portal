package com.hsgg.security.user.admin.dtos;

import com.hsgg.security.user.UserRole;

public record CreateUserRequestDto(String firstname, String lastname, String username, String password, UserRole role) {
}
