package com.hsgg.security.user.admin;

import com.hsgg.security.user.admin.dtos.CreateUserRequest;
import com.hsgg.security.user.admin.dtos.UpdateUserRoleRequest;
import com.hsgg.security.user.admin.dtos.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

	private final AdminUserService adminUserService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> createUser(@RequestBody CreateUserRequest req) {
		adminUserService.createUser(req);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PutMapping("/{userId}/role")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> updateUserRole(
			@PathVariable Long userId,
			@RequestBody UpdateUserRoleRequest req,
			Authentication auth
	) {
		Long actingAdminId = (Long) auth.getPrincipal();
		adminUserService.updateUserRole(userId, req, actingAdminId);
		return ResponseEntity.ok().build();
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<UserDto> getAllUsers() {
		return adminUserService.getAllUsers();
	}
}
