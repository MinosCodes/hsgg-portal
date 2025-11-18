INSERT INTO users (first_name, last_name, username, password_hash, role)
VALUES ('System', 'Admin', 'admin', '$2a$10$6./B9e8k2t9uEJuY9Vc3hu0JYyheVQwWI4sJ0bbN4uAqN2oW9TQW6', 'ADMIN'),
       ('Default', 'Teacher', 'teacher', '$2a$10$z2rmP0v8wCkfrFyLBlntrODm7WvZnfcHykjc1sYk4A3zETgkthMby', 'TEACHER'),
       ('Default', 'Student', 'student', '$2a$10$88o9hMphT1TcWz2sWWkqQu1K1oF8LxzBm2i2dR9akZWCjkjU3Gv1K', 'STUDENT');
