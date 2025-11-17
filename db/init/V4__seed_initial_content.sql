-- 1. Addition und Subtraktion (Seite 1)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (1,
     'text', 1, 'Erklaerung',
     'Bei der Addition und Subtraktion grosser Zahlen hilft es, die Zahlen stellengerecht untereinander zu schreiben.'
    ),

    (1,
     'text', 2, 'Beispiel',
     '7421 + 5634 = 13055\n9876 - 1234 = 8642'
    ),

    (1,
     'text', 3, 'Uebungsaufgaben',
     '1. 6342 + 9873 = ?\n2. 4521 - 1234 = ?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (1,
     'reference', 4, 'Verweis',
     'Schauen Sie sich auch Multiplikation und Division auf Seite 2 an.',
     2
    );


-- 2. Multiplikation und Division (Seite 2)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (2,
     'text', 1, 'Erklaerung',
     'Bei der Multiplikation und Division grosser Zahlen ist es wichtig, Schritt fuer Schritt vorzugehen. Nutze das Einmaleins als Grundlage.'
    ),

    (2,
     'text', 2, 'Beispiel',
     '234 × 12 = 2808\n144 ÷ 12 = 12'
    ),

    (2,
     'text', 3, 'Uebungsaufgaben',
     '1. 432 × 23 = ?\n2. 560 ÷ 7 = ?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (2,
     'reference', 4, 'Verweis',
     'Ueberpruefen Sie die Grundlagen der Addition und Subtraktion auf Seite 1.',
     1
    );


-- 3. Bruchrechnung: Einfuehrung (Seite 3)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (3,
     'text', 1, 'Erklaerung',
     'Ein Bruch zeigt einen Teil eines Ganzen. Der Zaehler steht oben und der Nenner unten.'
    ),

    (3,
     'text', 2, 'Beispiel',
     '1/2 + 1/4 = 3/4'
    ),

    (3,
     'text', 3, 'Uebungsaufgaben',
     '1. 3/5 + 1/5 = ?\n2. 4/7 - 2/7 = ?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (3,
     'reference', 4, 'Verweis',
     'Vertiefung der Bruchrechnung auf Seite 4.',
     4
    );


-- 4. Erweitern und Kuetzen von Bruechen (Seite 4)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (4,
     'text', 1, 'Erklaerung',
     'Zum Erweitern multipliziere Zaehler und Nenner mit der gleichen Zahl. Zum Kuerzen dividiere sie durch den groessten gemeinsamen Teiler.'
    ),

    (4,
     'text', 2, 'Beispiel',
     '2/4 = 1/2\n3/6 = 1/2'
    ),

    (4,
     'text', 3, 'Uebungsaufgaben',
     '1. Kuerze 6/9.\n2. Erweitere 1/3 mit 5.'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (4,
     'reference', 4, 'Verweis',
     'Verknuepft mit Addition und Subtraktion von Bruechen auf Seite 3.',
     3
    );


-- 5. Rechtecke & Quadrate (Seite 5)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (5,
     'text', 1, 'Erklaerung',
     'Die Flaeche eines Rechtecks oder Quadrats berechnet sich durch Laenge × Breite. Formel: A = l × b.'
    ),

    (5,
     'text', 2, 'Beispiel',
     'Rechteck: l = 5 cm, b = 3 cm → A = 5 × 3 = 15 cm²'
    ),

    (5,
     'text', 3, 'Uebungsaufgaben',
     '1. Quadrat mit Seitenlaenge 4 cm → Flaeche?\n2. Rechteck l = 7 cm, b = 2 cm → Flaeche?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (5,
     'reference', 4, 'Verweis',
     'Naechster Schritt: Umfang von Figuren auf Seite 6.',
     6
    );


-- 6. Umfang von Figuren (Seite 6)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (6,
     'text', 1, 'Formel',
     'Formel: U = 2 × (l + b)'
    ),

    (6,
     'text', 2, 'Beispiel',
     'Rechteck: l = 5 cm, b = 3 cm → U = 2 × (5 + 3) = 16 cm'
    ),

    (6,
     'text', 3, 'Uebungsaufgaben',
     '1. Umfang eines Quadrats a = 6 cm\n2. Umfang Rechteck: l = 8 cm, b = 4 cm'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (6,
     'reference', 4, 'Verweis',
     'Siehe Flaecheninhalt von Dreiecken auf Seite 7.',
     7
    );


-- 7. Flaecheninhalt Dreiecke (Seite 7)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (7,
     'text', 1, 'Formel',
     'Formel: A = (1/2) × Grundlinie × Hoehe'
    ),

    (7,
     'text', 2, 'Beispiel',
     'Grundlinie = 6 cm, Hoehe = 4 cm → A = 12 cm²'
    ),

    (7,
     'text', 3, 'Uebungsaufgaben',
     '1. Grundlinie = 8 cm, Hoehe = 5 cm\n2. Grundlinie = 10 cm, Hoehe = 7 cm'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (7,
     'reference', 4, 'Verweis',
     'Siehe Kreise: Umfang und Flaeche auf Seite 8.',
     8
    );

-- 8. Kreise (Seite 8)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (8,
     'text', 1, 'Formel',
     'Formel: U = 2 × π × r\nFormel: A = π × r²'
    ),

    (8,
     'text', 2, 'Beispiel',
     'Kreis mit r = 3 cm:\nU = 2 × 3.14 × 3 = 18.84 cm\nA = 3.14 × 9 = 28.26 cm²'
    ),

    (8,
     'text', 3, 'Uebungsaufgaben',
     '1. Radius = 4 cm → Umfang?\n2. Radius = 5 cm → Flaeche?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (8,
     'reference', 4, 'Verweis',
     'Siehe Volumen von Quadern auf Seite 9.',
     9
    );


-- 9. Volumen von Quadern (Seite 9)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (9,
     'text', 1, 'Formel',
     'Formel: V = l × b × h'
    ),

    (9,
     'text', 2, 'Beispiel',
     'Ein Quader:\nl = 5 cm, b = 3 cm, h = 2 cm → V = 30 cm³'
    ),

    (9,
     'text', 3, 'Uebungsaufgaben',
     '1. l=4, b=3, h=2 cm\n2. l=6, b=4, h=3 cm'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (9,
     'reference', 4, 'Verweis',
     'Siehe Einfuehrung in das Dezimalsystem auf Seite 10.',
     10
    );


-- 10. Dezimalsystem (Seite 10)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (10,
     'text', 1, 'Erklaerung',
     'Das Dezimalsystem verwendet die Basis 10. Jede Stelle repraesentiert eine Potenz von 10.'
    ),

    (10,
     'text', 2, 'Beispiel',
     '435.12 bedeutet:\n4×100 + 3×10 + 5×1 + 1×0.1 + 2×0.01'
    ),

    (10,
     'text', 3, 'Uebungsaufgaben',
     '1. Zerlege 732.45\n2. Bedeutung von 56.789'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (10,
     'reference', 4, 'Verweis',
     'Weiter mit Runden von Dezimalzahlen auf Seite 11.',
     11
    );


-- 11. Dezimalzahlen Runden (Seite 11)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (11,
     'text', 1, 'Erklaerung',
     'Runde auf oder ab, je nachdem ob die naechste Stelle ≥ 5 ist.'
    ),

    (11,
     'text', 2, 'Beispiel',
     '3.146 auf zwei Stellen gerundet → 3.15'
    ),

    (11,
     'text', 3, 'Uebungsaufgaben',
     '1. Runde 2.849 auf 2 Stellen\n2. Runde 7.235 auf 1 Stelle'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (11,
     'reference', 4, 'Verweis',
     'Siehe Prozentrechnung: Einfuehrung auf Seite 12.',
     12
    );


-- 12. Prozentrechnung (Seite 12)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (12,
     'text', 1, 'Formel',
     'Prozentsatz = (Teil / Ganzes) × 100'
    ),

    (12,
     'text', 2, 'Beispiel',
     '20 von 100 Schuelern haben eine Eins → 20%'
    ),

    (12,
     'text', 3, 'Uebungsaufgaben',
     '1. 25 von 200 → ?\n2. 15 von 60 → ?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (12,
     'reference', 4, 'Verweis',
     'Vertiefung in Zinsrechnung auf Seite 13.',
     13
    );


-- 13. Zinsrechnung (Seite 13)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (13,
     'text', 1, 'Formel',
     'Zinsen = (Kapital × Zinssatz × Zeit) / 100'
    ),

    (13,
     'text', 2, 'Beispiel',
     'Kapital 1000€, 5% für 1 Jahr → Zinsen = 50€'
    ),

    (13,
     'text', 3, 'Uebungsaufgaben',
     '1. 2000€, 4%, 2 Jahre\n2. 1500€, 3%, 1 Jahr'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (13,
     'reference', 4, 'Verweis',
     'Siehe Einfuehrung Wahrscheinlichkeitsrechnung auf Seite 14.',
     14
    );


-- 14. Wahrscheinlichkeitsrechnung (Seite 14)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (14,
     'text', 1, 'Formel',
     'Wahrscheinlichkeit = (Gewuenschte Ereignisse / Moegliche Ereignisse)'
    ),

    (14,
     'text', 2, 'Beispiel',
     'Wuerfel: Chance fuer eine 6 = 1/6'
    ),

    (14,
     'text', 3, 'Uebungsaufgaben',
     '1. Gerade Zahl beim Wuerfeln?\n2. Rote Karte aus 52 Karten?'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (14,
     'reference', 4, 'Verweis',
     'Verknuepft mit Graphen und Diagrammen auf Seite 15.',
     15
    );


-- 15. Graphen und Diagramme (Seite 15)
INSERT INTO content_blocks (topic_id, type, position, title, text)
VALUES
    (15,
     'text', 1, 'Erklaerung',
     'Graphen und Diagramme stellen Daten visuell dar.'
    ),

    (15,
     'text', 2, 'Beispiel',
     'Balkendiagramm: Anzahl Schüler pro Klasse\nA=20, B=18, C=22'
    ),

    (15,
     'text', 3, 'Uebungsaufgaben',
     '1. Kreisdiagramm für Lieblingstiere\nHund 40%, Katze 30%, Vogel 20%, Fisch 10%'
    );

INSERT INTO content_blocks (topic_id, type, position, title, text, reference_topic_id)
VALUES
    (15,
     'reference', 4, 'Verweis',
     'Weitere Verknuepfung zu Prozentrechnung (Seite 12).',
     12
    );