package com.hsgg.features.files;

import com.hsgg.features.topics.Topic;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "files")
@Setter
@Getter
@NoArgsConstructor
public class FileEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "original_name", nullable = false)
	private String originalName;

	@Column(name = "stored_name", nullable = false)
	private String storedName;

	@Column(name = "mime_type", nullable = false)
	private String mimeType;

	@Column(nullable = false)
	private Long size;

	@ManyToOne
	@JoinColumn(name = "topic_id")
	private Topic topic;

	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}
}