package com.hsgg.security.user.admin;

import com.hsgg.security.user.User;
import com.hsgg.security.user.UserRepository;
import com.hsgg.security.user.UserRole;
import com.hsgg.security.user.admin.dtos.CreateUserRequest;
import com.hsgg.security.user.admin.dtos.UpdateUserRoleRequest;
import com.hsgg.security.user.admin.dtos.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public void createUser(CreateUserRequest req) {
		if (userRepository.existsByUsername(req.username())) {
			throw new IllegalArgumentException("Username already exists");
		}

		User user = User.builder()
				.firstName(req.firstname())
				.lastName(req.lastname())
				.username(req.username())
				.password(passwordEncoder.encode(req.password()))
				.role(req.role())
				.build();

		userRepository.save(user);
	}

	public void updateUserRole(Long userId, UpdateUserRoleRequest req, Long actingAdminId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		UserRole newRole = UserRole.valueOf(req.role().toUpperCase());

		if (user.getId().equals(actingAdminId)) {
			throw new IllegalStateException("Admins cannot change their own role");
		}

		user.setRole(newRole);
		userRepository.save(user);
	}

	public List<UserDto> getAllUsers() {
		return userRepository.findAll().stream().map(this::toDto).toList();
	}

	public void deleteUser(Long userId, Long actingAdminId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		if (user.getId().equals(actingAdminId)) {
			throw new IllegalStateException("Admins cannot delete themselves");
		}

		userRepository.delete(user);
	}

	private UserDto toDto(User user) {
		return new UserDto(
				user.getId(),
				user.getFirstName(),
				user.getLastName(),
				user.getUsername(),
				user.getRole().toString()
		);
	}
}
