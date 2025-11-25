package com.hsgg.security.user.admin;

import com.hsgg.security.user.User;
import com.hsgg.security.user.UserRepository;
import com.hsgg.security.user.UserRole;
import com.hsgg.security.user.admin.dtos.CreateUserRequestDto;
import com.hsgg.security.user.admin.dtos.UpdateUserRoleRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public User createUser(CreateUserRequestDto req) {
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

		return userRepository.save(user);
	}

	public User updateUserRole(Long userId, UpdateUserRoleRequestDto req, Long actingAdminId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		UserRole newRole = UserRole.valueOf(req.role().toUpperCase());

		if (user.getId().equals(actingAdminId)) {
			throw new IllegalStateException("Admins cannot change their own role");
		}

		user.setRole(newRole);
		return userRepository.save(user);
	}

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}
}
