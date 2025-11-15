INSERT INTO subjects (name, slug, description)
VALUES ('Mathematik', 'mathematik', 'Nachhilfematerial für die fünfte Klasse')
    ON DUPLICATE KEY UPDATE name = VALUES(name);