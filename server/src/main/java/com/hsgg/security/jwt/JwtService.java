package com.hsgg.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

	private static final long EXPIRATION_MS = 1000 * 60 * 60 * 24;

	private final Algorithm algorithm;

	public JwtService(@Value("${jwt.secret}") String secret) {
		this.algorithm = Algorithm.HMAC256(secret);
	}

	public String generateToken(Long userId, String role) {
		return JWT.create()
				.withSubject(userId.toString())
				.withClaim("role", role)
				.withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_MS))
				.sign(algorithm);
	}

	public DecodedJWT verifyToken(String token) {
		return JWT.require(algorithm)
				.build()
				.verify(token);
	}
}
