package com.hsgg.subjects;

import com.hsgg.topics.Topic;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
public class Subject {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false)
   private String name;

   private String description;

   @Column(name = "created_at", updatable = false)
   private LocalDateTime createdAt;

   @Column(name = "updated_at")
   private LocalDateTime updatedAt;

   @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
   private List<Topic> topics;

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