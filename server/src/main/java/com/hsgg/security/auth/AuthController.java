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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthController(UserRepository userRepository,
						  PasswordEncoder passwordEncoder,
						  JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {
		System.out.println(request.username());
		System.out.println(request.password());
		if (userRepository.existsByUsername(request.username())) {
			return ResponseEntity.badRequest().body("Username already taken.");
		}

		User user = new User();
		user.setUsername(request.username());
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setRole(UserRole.STUDENT);
		user.setFirstName(request.firstname());
		user.setLastName(request.lastname());

		userRepository.save(user);

		return ResponseEntity.ok("Registered successfully");
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {

		User user = userRepository.findByUsername(request.username())
				.orElseThrow(() -> new RuntimeException("Invalid credentials"));

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			return ResponseEntity.status(401).body("Invalid credentials");
		}

		String token = jwtService.generateToken(user.getId(), user.getRole().toString());

		return ResponseEntity.ok(new AuthResponseDto(token, user.getRole().toString()));
	}
}