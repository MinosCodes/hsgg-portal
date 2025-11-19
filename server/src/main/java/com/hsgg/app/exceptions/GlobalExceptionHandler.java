package com.hsgg.app.exceptions;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler({
			IllegalArgumentException.class,
			MethodArgumentNotValidException.class
	})
	public ResponseEntity<Void> handleBadRequest(Exception e) {
		return ResponseEntity.badRequest().build();
	}

	@ExceptionHandler({
			IllegalStateException.class,
			AccessDeniedException.class
	})
	public ResponseEntity<Void> handleForbidden(Exception e) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	}

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<Void> handleNotFound(Exception e) {
		return ResponseEntity.notFound().build();
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Void> handleGeneric(Exception e) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	}
}
