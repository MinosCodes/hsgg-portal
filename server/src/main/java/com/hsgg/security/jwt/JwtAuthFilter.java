package com.hsgg.security.jwt;

import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	public JwtAuthFilter(JwtService jwtService) {
		this.jwtService = jwtService;
	}

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain
	) throws ServletException, IOException {

		String header = request.getHeader("Authorization");
		if (header == null || !header.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = header.substring(7);

		try {
			DecodedJWT jwt = jwtService.verifyToken(token);

			Long userId = Long.valueOf(jwt.getSubject());
			String role = jwt.getClaim("role").asString();

			var authToken = new UsernamePasswordAuthenticationToken(
					userId,
					null,
					List.of(new SimpleGrantedAuthority("ROLE_" + role))
			);

			authToken.setDetails(
					new WebAuthenticationDetailsSource().buildDetails(request)
			);

			SecurityContextHolder.getContext().setAuthentication(authToken);
		} catch (Exception _) {
		}

		filterChain.doFilter(request, response);
	}
}