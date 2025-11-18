package com.hsgg.features.topics;

import com.hsgg.features.contentBlock.ContentBlock;
import com.hsgg.features.files.FileEntity;
import com.hsgg.features.subjects.Subject;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
public class Topic {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "subject_id", nullable = false)
	private Subject subject;

	@Column(nullable = false)
	private String title;

	private String description;

	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
	private List<ContentBlock> blocks;

	@OneToMany(mappedBy = "topic")
	private List<FileEntity> files;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = this.createdAt;
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}
}