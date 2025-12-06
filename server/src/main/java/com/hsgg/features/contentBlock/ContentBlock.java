package com.hsgg.features.contentBlock;

import com.hsgg.features.files.FileEntity;
import com.hsgg.features.topics.Topic;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "content_blocks")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ContentBlock {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "topic_id", nullable = false)
	private Topic topic;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ContentBlockType type;

	@Column(nullable = false)
	private Integer position;

	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String text;

	@ManyToOne
	@JoinColumn(name = "reference_topic_id")
	private Topic referenceTopic;

	@ManyToOne
	@JoinColumn(name = "file_id")
	private FileEntity file;

	@CreatedDate
	@Column(nullable = false, name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(nullable = false, name = "updated_at", insertable = false)
	private LocalDateTime modifiedAt;
}