package com.hsgg.features.contentBlock;

import com.hsgg.features.contentBlock.dtos.ContentBlockDto;
import com.hsgg.features.contentBlock.dtos.textBlock.CreateTextBlockRequest;
import com.hsgg.features.contentBlock.dtos.textBlock.UpdateTextBlockRequest;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentBlockController {

	private final ContentBlockService contentBlockService;

	@GetMapping("/{blockId}")
	public ResponseEntity<ContentBlockDto> get(@PathVariable Long blockId) {
		ContentBlockDto dto = contentBlockService.get(blockId);
		return ResponseEntity.ok(dto);
	}

	@PostMapping("/text")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> createText(@RequestBody CreateTextBlockRequest req) {
		try {
			contentBlockService.createText(req);
		} catch (BadRequestException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PutMapping("/{blockId}")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> update(@PathVariable Long blockId, @RequestBody UpdateTextBlockRequest req) {
		try {
			contentBlockService.updateText(blockId, req);
		} catch (BadRequestException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/{blockId}")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public ResponseEntity<?> delete(@PathVariable Long blockId) {
		contentBlockService.delete(blockId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
