INSERT INTO topics (subject_id, title, slug, description)
VALUES
    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Addition und Subtraktion grosser Zahlen',
     'addition-subtraktion',
     'Rechnen mit grossen Zahlen (Addition und Subtraktion)'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Multiplikation und Division',
     'multiplikation-division',
     'Rechnen mit grossen Zahlen (Multiplikation und Division)'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Bruchrechnung: Einfuehrung',
     'bruchrechnung-einfuehrung',
     'Grundlagen der Bruchrechnung'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Erweitern und Kuetzen von Bruechen',
     'brueche-erweitern-kuerzen',
     'Brueche erweitern und kuerzen'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Geometrie: Rechtecke und Quadrate',
     'geometrie-rechtecke-quadrate',
     'Berechnung von Flaecheninhalten'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Geometrie: Umfang von Figuren',
     'geometrie-umfang-figuren',
     'Berechnung des Umfangs von Rechtecken und Quadraten'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Geometrie: Flaecheninhalt von Dreiecken',
     'geometrie-flaecheninhalt-dreiecke',
     'Flaechenberechnung bei Dreiecken'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Geometrie: Kreise',
     'geometrie-kreise',
     'Umfang und Flaeche von Kreisen'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Geometrie: Volumen von Quadern',
     'geometrie-volumen-quader',
     'Volumenberechnung bei Quadern'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Dezimalsystem: Einfuehrung',
     'dezimalsystem-einfuehrung',
     'Grundbegriffe des Dezimalsystems'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Dezimalzahlen: Runden',
     'dezimalzahlen-runden',
     'Dezimalzahlen auf bestimmte Stellen runden'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Prozentrechnung: Einfuehrung',
     'prozentrechnung-einfuehrung',
     'Grundlegende Prozentrechnung'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Zinsrechnung',
     'zinsrechnung',
     'Einfache Zinsrechnung'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Wahrscheinlichkeitsrechnung: Einfuehrung',
     'wahrscheinlichkeit-einfuehrung',
     'Grundbegriffe der Wahrscheinlichkeitsrechnung'),

    ((SELECT id FROM subjects WHERE slug = 'mathematik'),
     'Graphen und Diagramme',
     'graphen-diagramme',
     'Einfache Darstellung von Daten');