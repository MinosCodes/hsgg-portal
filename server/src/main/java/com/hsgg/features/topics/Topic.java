package com.hsgg.features.topics;

import com.hsgg.features.contentBlock.ContentBlock;
import com.hsgg.features.files.FileEntity;
import com.hsgg.features.subjects.Subject;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

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
	
	@OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
	private List<ContentBlock> blocks;

	@OneToMany(mappedBy = "topic")
	private List<FileEntity> files;

	@CreatedDate
	@Column(nullable = false, name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(nullable = false, name = "updated_at", insertable = false)
	private LocalDateTime modifiedAt;
}