-- 1. Addition und Subtraktion (Seite 1)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'addition-subtraktion'),
     'text', 1, 'Erklaerung',
     'Bei der Addition und Subtraktion grosser Zahlen hilft es, die Zahlen stellengerecht untereinander zu schreiben.'
    ),

    ((SELECT id FROM topics WHERE slug = 'addition-subtraktion'),
     'text', 2, 'Beispiel',
     '7421 + 5634 = 13055\n9876 - 1234 = 8642'
    ),

    ((SELECT id FROM topics WHERE slug = 'addition-subtraktion'),
     'text', 3, 'Uebungsaufgaben',
     '1. 6342 + 9873 = ?\n2. 4521 - 1234 = ?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'addition-subtraktion'),
     'reference', 4, 'Verweis',
     'Schauen Sie sich auch Multiplikation und Division auf Seite 2 an.',
     (SELECT id FROM topics WHERE slug = 'multiplikation-division')
    );


-- 2. Multiplikation und Division (Seite 2)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'multiplikation-division'),
     'text', 1, 'Erklaerung',
     'Bei der Multiplikation und Division grosser Zahlen ist es wichtig, Schritt fuer Schritt vorzugehen. Nutze das Einmaleins als Grundlage.'
    ),

    ((SELECT id FROM topics WHERE slug = 'multiplikation-division'),
     'text', 2, 'Beispiel',
     '234 × 12 = 2808\n144 ÷ 12 = 12'
    ),

    ((SELECT id FROM topics WHERE slug = 'multiplikation-division'),
     'text', 3, 'Uebungsaufgaben',
     '1. 432 × 23 = ?\n2. 560 ÷ 7 = ?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'multiplikation-division'),
     'reference', 4, 'Verweis',
     'Ueberpruefen Sie die Grundlagen der Addition und Subtraktion auf Seite 1.',
     (SELECT id FROM topics WHERE slug = 'addition-subtraktion')
    );


-- 3. Bruchrechnung: Einfuehrung (Seite 3)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'bruchrechnung-einfuehrung'),
     'text', 1, 'Erklaerung',
     'Ein Bruch zeigt einen Teil eines Ganzen. Der Zaehler steht oben und der Nenner unten.'
    ),

    ((SELECT id FROM topics WHERE slug = 'bruchrechnung-einfuehrung'),
     'text', 2, 'Beispiel',
     '1/2 + 1/4 = 3/4'
    ),

    ((SELECT id FROM topics WHERE slug = 'bruchrechnung-einfuehrung'),
     'text', 3, 'Uebungsaufgaben',
     '1. 3/5 + 1/5 = ?\n2. 4/7 - 2/7 = ?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'bruchrechnung-einfuehrung'),
     'reference', 4, 'Verweis',
     'Vertiefung der Bruchrechnung auf Seite 4.',
     (SELECT id FROM topics WHERE slug = 'brueche-erweitern-kuerzen')
    );


-- 4. Erweitern und Kuetzen von Bruechen (Seite 4)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'brueche-erweitern-kuerzen'),
     'text', 1, 'Erklaerung',
     'Zum Erweitern multipliziere Zaehler und Nenner mit der gleichen Zahl. Zum Kuerzen dividiere sie durch den groessten gemeinsamen Teiler.'
    ),

    ((SELECT id FROM topics WHERE slug = 'brueche-erweitern-kuerzen'),
     'text', 2, 'Beispiel',
     '2/4 = 1/2\n3/6 = 1/2'
    ),

    ((SELECT id FROM topics WHERE slug = 'brueche-erweitern-kuerzen'),
     'text', 3, 'Uebungsaufgaben',
     '1. Kuerze 6/9.\n2. Erweitere 1/3 mit 5.'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'brueche-erweitern-kuerzen'),
     'reference', 4, 'Verweis',
     'Verknuepft mit Addition und Subtraktion von Bruechen auf Seite 3.',
     (SELECT id FROM topics WHERE slug = 'bruchrechnung-einfuehrung')
    );


-- 5. Rechtecke & Quadrate (Seite 5)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-rechtecke-quadrate'),
     'text', 1, 'Erklaerung',
     'Die Flaeche eines Rechtecks oder Quadrats berechnet sich durch Laenge × Breite. Formel: A = l × b.'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-rechtecke-quadrate'),
     'text', 2, 'Beispiel',
     'Rechteck: l = 5 cm, b = 3 cm → A = 5 × 3 = 15 cm²'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-rechtecke-quadrate'),
     'text', 3, 'Uebungsaufgaben',
     '1. Quadrat mit Seitenlaenge 4 cm → Flaeche?\n2. Rechteck l = 7 cm, b = 2 cm → Flaeche?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-rechtecke-quadrate'),
     'reference', 4, 'Verweis',
     'Naechster Schritt: Umfang von Figuren auf Seite 6.',
     (SELECT id FROM topics WHERE slug = 'geometrie-umfang-figuren')
    );


-- 6. Umfang von Figuren (Seite 6)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-umfang-figuren'),
     'text', 1, 'Formel',
     'Formel: U = 2 × (l + b)'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-umfang-figuren'),
     'text', 2, 'Beispiel',
     'Rechteck: l = 5 cm, b = 3 cm → U = 2 × (5 + 3) = 16 cm'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-umfang-figuren'),
     'text', 3, 'Uebungsaufgaben',
     '1. Umfang eines Quadrats a = 6 cm\n2. Umfang Rechteck: l = 8 cm, b = 4 cm'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-umfang-figuren'),
     'reference', 4, 'Verweis',
     'Siehe Flaecheninhalt von Dreiecken auf Seite 7.',
     (SELECT id FROM topics WHERE slug = 'geometrie-flaecheninhalt-dreiecke')
    );


-- 7. Flaecheninhalt Dreiecke (Seite 7)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-flaecheninhalt-dreiecke'),
     'text', 1, 'Formel',
     'Formel: A = (1/2) × Grundlinie × Hoehe'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-flaecheninhalt-dreiecke'),
     'text', 2, 'Beispiel',
     'Grundlinie = 6 cm, Hoehe = 4 cm → A = 12 cm²'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-flaecheninhalt-dreiecke'),
     'text', 3, 'Uebungsaufgaben',
     '1. Grundlinie = 8 cm, Hoehe = 5 cm\n2. Grundlinie = 10 cm, Hoehe = 7 cm'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-flaecheninhalt-dreiecke'),
     'reference', 4, 'Verweis',
     'Siehe Kreise: Umfang und Flaeche auf Seite 8.',
     (SELECT id FROM topics WHERE slug = 'geometrie-kreise')
    );

-- 8. Kreise (Seite 8)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-kreise'),
     'text', 1, 'Formel',
     'Formel: U = 2 × π × r\nFormel: A = π × r²'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-kreise'),
     'text', 2, 'Beispiel',
     'Kreis mit r = 3 cm:\nU = 2 × 3.14 × 3 = 18.84 cm\nA = 3.14 × 9 = 28.26 cm²'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-kreise'),
     'text', 3, 'Uebungsaufgaben',
     '1. Radius = 4 cm → Umfang?\n2. Radius = 5 cm → Flaeche?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-kreise'),
     'reference', 4, 'Verweis',
     'Siehe Volumen von Quadern auf Seite 9.',
     (SELECT id FROM topics WHERE slug = 'geometrie-volumen-quader')
    );


-- 9. Volumen von Quadern (Seite 9)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-volumen-quader'),
     'text', 1, 'Formel',
     'Formel: V = l × b × h'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-volumen-quader'),
     'text', 2, 'Beispiel',
     'Ein Quader:\nl = 5 cm, b = 3 cm, h = 2 cm → V = 30 cm³'
    ),

    ((SELECT id FROM topics WHERE slug = 'geometrie-volumen-quader'),
     'text', 3, 'Uebungsaufgaben',
     '1. l=4, b=3, h=2 cm\n2. l=6, b=4, h=3 cm'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'geometrie-volumen-quader'),
     'reference', 4, 'Verweis',
     'Siehe Einfuehrung in das Dezimalsystem auf Seite 10.',
     (SELECT id FROM topics WHERE slug = 'dezimalsystem-einfuehrung')
    );


-- 10. Dezimalsystem (Seite 10)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'dezimalsystem-einfuehrung'),
     'text', 1, 'Erklaerung',
     'Das Dezimalsystem verwendet die Basis 10. Jede Stelle repraesentiert eine Potenz von 10.'
    ),

    ((SELECT id FROM topics WHERE slug = 'dezimalsystem-einfuehrung'),
     'text', 2, 'Beispiel',
     '435.12 bedeutet:\n4×100 + 3×10 + 5×1 + 1×0.1 + 2×0.01'
    ),

    ((SELECT id FROM topics WHERE slug = 'dezimalsystem-einfuehrung'),
     'text', 3, 'Uebungsaufgaben',
     '1. Zerlege 732.45\n2. Bedeutung von 56.789'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'dezimalsystem-einfuehrung'),
     'reference', 4, 'Verweis',
     'Weiter mit Runden von Dezimalzahlen auf Seite 11.',
     (SELECT id FROM topics WHERE slug = 'dezimalzahlen-runden')
    );


-- 11. Dezimalzahlen Runden (Seite 11)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'dezimalzahlen-runden'),
     'text', 1, 'Erklaerung',
     'Runde auf oder ab, je nachdem ob die naechste Stelle ≥ 5 ist.'
    ),

    ((SELECT id FROM topics WHERE slug = 'dezimalzahlen-runden'),
     'text', 2, 'Beispiel',
     '3.146 auf zwei Stellen gerundet → 3.15'
    ),

    ((SELECT id FROM topics WHERE slug = 'dezimalzahlen-runden'),
     'text', 3, 'Uebungsaufgaben',
     '1. Runde 2.849 auf 2 Stellen\n2. Runde 7.235 auf 1 Stelle'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'dezimalzahlen-runden'),
     'reference', 4, 'Verweis',
     'Siehe Prozentrechnung: Einfuehrung auf Seite 12.',
     (SELECT id FROM topics WHERE slug = 'prozentrechnung-einfuehrung')
    );


-- 12. Prozentrechnung (Seite 12)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'prozentrechnung-einfuehrung'),
     'text', 1, 'Formel',
     'Prozentsatz = (Teil / Ganzes) × 100'
    ),

    ((SELECT id FROM topics WHERE slug = 'prozentrechnung-einfuehrung'),
     'text', 2, 'Beispiel',
     '20 von 100 Schuelern haben eine Eins → 20%'
    ),

    ((SELECT id FROM topics WHERE slug = 'prozentrechnung-einfuehrung'),
     'text', 3, 'Uebungsaufgaben',
     '1. 25 von 200 → ?\n2. 15 von 60 → ?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'prozentrechnung-einfuehrung'),
     'reference', 4, 'Verweis',
     'Vertiefung in Zinsrechnung auf Seite 13.',
     (SELECT id FROM topics WHERE slug = 'zinsrechnung')
    );


-- 13. Zinsrechnung (Seite 13)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'zinsrechnung'),
     'text', 1, 'Formel',
     'Zinsen = (Kapital × Zinssatz × Zeit) / 100'
    ),

    ((SELECT id FROM topics WHERE slug = 'zinsrechnung'),
     'text', 2, 'Beispiel',
     'Kapital 1000€, 5% für 1 Jahr → Zinsen = 50€'
    ),

    ((SELECT id FROM topics WHERE slug = 'zinsrechnung'),
     'text', 3, 'Uebungsaufgaben',
     '1. 2000€, 4%, 2 Jahre\n2. 1500€, 3%, 1 Jahr'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'zinsrechnung'),
     'reference', 4, 'Verweis',
     'Siehe Einfuehrung Wahrscheinlichkeitsrechnung auf Seite 14.',
     (SELECT id FROM topics WHERE slug = 'wahrscheinlichkeit-einfuehrung')
    );


-- 14. Wahrscheinlichkeitsrechnung (Seite 14)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'wahrscheinlichkeit-einfuehrung'),
     'text', 1, 'Formel',
     'Wahrscheinlichkeit = (Gewuenschte Ereignisse / Moegliche Ereignisse)'
    ),

    ((SELECT id FROM topics WHERE slug = 'wahrscheinlichkeit-einfuehrung'),
     'text', 2, 'Beispiel',
     'Wuerfel: Chance fuer eine 6 = 1/6'
    ),

    ((SELECT id FROM topics WHERE slug = 'wahrscheinlichkeit-einfuehrung'),
     'text', 3, 'Uebungsaufgaben',
     '1. Gerade Zahl beim Wuerfeln?\n2. Rote Karte aus 52 Karten?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'wahrscheinlichkeit-einfuehrung'),
     'reference', 4, 'Verweis',
     'Verknuepft mit Graphen und Diagrammen auf Seite 15.',
     (SELECT id FROM topics WHERE slug = 'graphen-diagramme')
    );


-- 15. Graphen und Diagramme (Seite 15)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    ((SELECT id FROM topics WHERE slug = 'graphen-diagramme'),
     'text', 1, 'Erklaerung',
     'Graphen und Diagramme stellen Daten visuell dar.'
    ),

    ((SELECT id FROM topics WHERE slug = 'graphen-diagramme'),
     'text', 2, 'Beispiel',
     'Balkendiagramm: Anzahl Schüler pro Klasse\nA=20, B=18, C=22'
    ),

    ((SELECT id FROM topics WHERE slug = 'graphen-diagramme'),
     'text', 3, 'Uebungsaufgaben',
     '1. Kreisdiagramm für Lieblingstiere\nHund 40%, Katze 30%, Vogel 20%, Fisch 10%'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    ((SELECT id FROM topics WHERE slug = 'graphen-diagramme'),
     'reference', 4, 'Verweis',
     'Weitere Verknuepfung zu Prozentrechnung (Seite 12).',
     (SELECT id FROM topics WHERE slug = 'prozentrechnung-einfuehrung')
    );