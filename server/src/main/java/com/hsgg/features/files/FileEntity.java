package com.hsgg.features.files;

import com.hsgg.features.topics.Topic;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

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
	@JoinColumn(name = "topic_id", nullable = false)
	private Topic topic;

	@CreatedDate
	@Column(nullable = false, name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(nullable = false, name = "updated_at", insertable = false)
	private LocalDateTime modifiedAt;
}