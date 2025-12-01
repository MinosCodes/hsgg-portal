package com.hsgg.security.auth;

import com.hsgg.security.auth.dtos.AuthResponseDto;
import com.hsgg.security.auth.dtos.LoginRequestDto;
import com.hsgg.security.auth.dtos.RegisterRequestDto;
import com.hsgg.security.jwt.JwtService;
import com.hsgg.security.user.User;
import com.hsgg.security.user.UserRepository;
import com.hsgg.security.user.UserRole;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
		User user = userRepository.findByUsername(request.username())
				.orElseThrow(() -> new RuntimeException("Invalid credentials"));

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			return ResponseEntity.status(401).body("Invalid credentials");
		}

		String token = jwtService.generateToken(user.getUsername(), user.getRole().toString());

		return ResponseEntity.ok(
				new AuthResponseDto(
						token,
						user.getRole().toString(),
						user.getFirstName(),
						user.getLastName()
				)
		);
	}

	public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {
		if (userRepository.existsByUsername(request.username())) {
			return ResponseEntity.badRequest().body("Username already taken.");
		}

		User user = toStudent(request);
		userRepository.save(user);

		String token = jwtService.generateToken(user.getUsername(), user.getRole().toString());

		return ResponseEntity.ok(
				new AuthResponseDto(
						token,
						user.getRole().toString(),
						user.getFirstName(),
						user.getLastName()
				)
		);
	}

	private User toStudent(RegisterRequestDto request) {
		return User.builder()
				.username(request.username())
				.password(passwordEncoder.encode(request.password()))
				.firstName(request.firstname())
				.lastName(request.lastname())
				.role(UserRole.STUDENT)
				.build();
	}
}
