CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE topics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_topics_subject
        FOREIGN KEY (subject_id)
            REFERENCES subjects(id)
            ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE content_blocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    topic_id BIGINT NOT NULL,
    type ENUM('text', 'reference', 'file') NOT NULL,
    position INT NOT NULL,
    title VARCHAR(255) NOT NULL,

    text TEXT NULL,
    reference_topic_id BIGINT NULL,
    file_id BIGINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_content_topic
        FOREIGN KEY (topic_id)
            REFERENCES topics(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_content_ref_topic
        FOREIGN KEY (reference_topic_id)
            REFERENCES topics(id)
            ON DELETE SET NULL,

    CONSTRAINT fk_content_file
        FOREIGN KEY (file_id)
            REFERENCES files(id)
            ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE related_topics (
    topic_id BIGINT NOT NULL,
    related_topic_id BIGINT NOT NULL,

    PRIMARY KEY (topic_id, related_topic_id),

    CONSTRAINT fk_related_topic_source
        FOREIGN KEY (topic_id)
            REFERENCES topics(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_related_topic_target
        FOREIGN KEY (related_topic_id)
            REFERENCES topics(id)
            ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE files (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   original_name VARCHAR(255) NOT NULL,
   stored_name VARCHAR(255) NOT NULL,
   mime_type VARCHAR(255) NOT NULL,
   size BIGINT NOT NULL,
   topic_id BIGINT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

   CONSTRAINT fk_files_topic
       FOREIGN KEY (topic_id)
           REFERENCES topics(id)
           ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(100) NOT NULL UNIQUE,
   password_hash VARCHAR(255) NOT NULL,
   role ENUM('EDITOR') NOT NULL DEFAULT 'EDITOR',
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
