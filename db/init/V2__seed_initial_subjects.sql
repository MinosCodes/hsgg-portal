INSERT INTO subjects (id, name, description)
VALUES (1, 'Mathematik', 'Nachhilfematerial für die fünfte Klasse')
    ON DUPLICATE KEY UPDATE name = VALUES(name);