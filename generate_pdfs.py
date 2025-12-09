from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
import os

# Content for each PDF
contents = {
    "bspl1.pdf": ("Deutsch Grammatik - Jahr 5", """
Satzglieder und Wortarten

Die deutsche Grammatik befasst sich mit der Struktur der Sprache. Ein wichtiges Konzept sind Satzglieder - die einzelnen Komponenten eines Satzes.

Satzglieder:
- Subjekt: Das Subjekt ist der Träger der Handlung
- Prädikat: Das Prädikat beschreibt die Handlung oder den Zustand
- Objekt: Das Objekt wird durch die Handlung beeinflusst
- Adverbiale Bestimmungen: Geben Informationen zu Zeit, Ort, Art und Weise

Wortarten:
1. Substantiv (Nomen): Bezeichnen Personen, Orte oder Dinge
2. Verb: Beschreiben Handlungen oder Zustände
3. Adjektiv: Beschreiben Eigenschaften
4. Adverb: Modifizieren Verben oder andere Wörter
5. Präposition: Zeigen Beziehungen zwischen Wörtern
6. Konjunktion: Verbinden Sätze oder Satzteile

Zeitformen:
- Präsens: Gegenwart (ich gehe)
- Präteritum: Vergangenheit (ich ging)
- Perfekt: Vollendete Gegenwart (ich bin gegangen)
- Futur: Zukunft (ich werde gehen)
    """),
    
    "bspl2.pdf": ("Deutsche Literatur - Jahr 6", """
Günter Grass: Die Blechtrommel - Auszug und Analyse

Die Blechtrommel ist eines der bedeutendsten Werke der deutschen Nachkriegsliteratur. Der Roman wird aus der Perspektive von Oskar Matzerath erzählt, einem Mann mit außergewöhnlichen Fähigkeiten.

Hauptcharaktere:
- Oskar Matzerath: Der Protagonist, der aufhört zu wachsen
- Maria Matzerath: Seine Mutter
- Alfred Matzerath: Sein Vater
- Großmutter Koljaiczek: Seine Großmutter

Themen:
- Der Aufstieg und Fall des Dritten Reiches
- Persönliche Freiheit vs. historischer Determinismus
- Die Unschuld der Kindheit in einer korrupten Welt
- Musik und Kunst als Form des Widerstands

Symbolik der Blechtrommel:
Die Blechtrommel selbst ist ein Symbol für Oskar's Widerstand gegen die Erwachsenenwelt und die Geschichte seiner Zeit. Das Trommeln ist seine Stimme, seine Art, sich gegen eine ungerechte Welt zu wehren.
    """),
    
    "bspl3.pdf": ("Mathematik: Bruchrechnung - Jahr 6", """
Grundlagen der Bruchrechnung

Ein Bruch ist eine Darstellung einer Zahl, die aus einem Zähler und einem Nenner besteht.

Schreibweise: Zähler/Nenner

Arten von Brüchen:
- Echter Bruch: Zähler < Nenner (1/2, 3/4)
- Unechter Bruch: Zähler ≥ Nenner (5/3, 7/4)
- Gemischte Zahl: Ganze Zahl + Bruch (1 1/2)

Bruchrechnung Operationen:

1. Kürzen: Zähler und Nenner durch die gleiche Zahl teilen
   Beispiel: 6/8 = 3/4

2. Erweitern: Zähler und Nenner mit der gleichen Zahl multiplizieren
   Beispiel: 2/3 = 4/6

3. Addition: Brüche mit gleichem Nenner addieren
   1/4 + 2/4 = 3/4

4. Multiplikation: Zähler mit Zähler, Nenner mit Nenner multiplizieren
   1/2 × 2/3 = 2/6 = 1/3

5. Division: Mit dem Kehrwert des Divisors multiplizieren
   1/2 ÷ 1/3 = 1/2 × 3/1 = 3/2
    """),
    
    "bspl4.pdf": ("Biologie: Zellaufbau - Jahr 7", """
Die Pflanzenzelle und ihre Organellen

Alle lebenden Organismen bestehen aus Zellen. Eine Zelle ist die kleinste Funktionseinheit des Lebens.

Pflanzenzelle Struktur:

Zellkern:
- Enthält genetisches Material (DNA)
- Kontrolliert alle Zellaktivitäten

Mitochondrien:
- Kraftwerk der Zelle
- Produziert Energie (ATP)

Chloroplasten:
- Nur in Pflanzenzellen
- Führt Photosynthese durch
- Produziert Zucker und Sauerstoff

Endoplasmatisches Retikulum (ER):
- Raues ER: Mit Ribosomen besetzt, produziert Proteine
- Glattes ER: Produziert Lipide

Golgi-Apparat:
- Sortiert und verpackt Proteine

Vakuolen:
- Speichern Wasser und Nährstoffe
- Große zentrale Vakuole in Pflanzenzellen

Zellmembran:
- Kontroliert Ein- und Ausstrom von Stoffen

Zellwand:
- Nur in Pflanzenzellen
- Gibt der Zelle Struktur und Stabilität
    """),
    
    "bspl5.pdf": ("Physik: Fadenpendel Experiment - Jahr 8", """
Versuchsanleitung: Das Fadenpendel

Objective: Die Periode eines Fadenpendels untersuchen und verstehen

Materialien:
- Ein Fadenpendel (Kugel an einem Faden)
- Verschiedene Längen des Fadens (30cm, 50cm, 100cm)
- Stoppuhr
- Messstab
- Verschiedene Massen (100g, 200g, 500g)

Versuchsdurchführung:

1. Längeneinflusss auf die Periode:
   - Befestigen Sie den Faden mit verschiedenen Längen
   - Lenken Sie das Pendel aus (kleine Auslenkung < 15°)
   - Messen Sie die Zeit für 10 Schwingungen
   - Wiederholen Sie 3 mal und berechnen Sie den Durchschnitt

2. Masseneinfluss:
   - Wiederholen Sie mit verschiedenen Massen
   - Beobachten Sie, ob sich die Periode ändert

Beobachtungen:
- Die Periode hängt von der Fadenlänge ab
- Längere Fäden führen zu längeren Perioden
- Die Masse hat keinen signifikanten Einfluss

Formel: T = 2π√(L/g)
Wobei T = Periode, L = Fadenlänge, g = Gravitationsbeschleunigung
    """),
    
    "bspl6.pdf": ("Chemie: Reaktionsgleichungen - Jahr 9", """
Chemische Reaktionsgleichungen ausgleichen

Chemische Reaktionsgleichungen zeigen, welche Stoffe reagieren und welche entstehen.

Struktur einer Reaktionsgleichung:
Eductants → Products
2H₂ + O₂ → 2H₂O

Wichtige Konzepte:

Atombilanz:
- Auf beiden Seiten muss die gleiche Anzahl jedes Atoms vorhanden sein
- Das Gesetz der Massenerhaltung muss eingehalten werden

Schritte zum Ausgleichen:

1. Schreiben Sie die Formeln auf
2. Zählen Sie die Atome auf jeder Seite
3. Verwenden Sie Koeffizienten (Zahlen vor den Formeln), um auszugleichen
4. Überprüfen Sie, ob alle Atome bilanziert sind

Beispiele:

1. Verbrennung von Kohlenstoff:
   2C + O₂ → 2CO
   
2. Bildung von Wasser:
   2H₂ + O₂ → 2H₂O
   
3. Eisenoxidation:
   4Fe + 3O₂ → 2Fe₂O₃

Tipps:
- Beginnen Sie mit dem komplexesten Atom
- Metalle und Nichtmetalle zuletzt ausgleichen
- Verwenden Sie kleine ganze Zahlen als Koeffizienten
    """),
    
    "bspl7.pdf": ("Politik: Demokratietheorie - Jahr 9", """
Grundprinzipien der Demokratie

Demokratie bedeutet "Herrschaft des Volkes". Es ist ein Regierungssystem, in dem die Macht beim Volk liegt.

Kernprinzipien:

1. Volkssouveränität:
   - Das Volk ist die Quelle aller Macht
   - Bürger haben das Recht, durch Wahlen zu entscheiden

2. Gewaltenteilung:
   - Legislative: Macht der Gesetze (Parlament)
   - Exekutive: Ausführende Macht (Regierung)
   - Judikative: Rechtsprechende Macht (Gerichte)

3. Rechtsstaatlichkeit:
   - Alle, einschließlich der Regierung, sind an die Gesetze gebunden
   - Unabhängige Gerichte
   - Schutz der Menschenrechte

4. Meinungsfreiheit:
   - Recht auf freie Äußerung
   - Pressefreiheit
   - Versammlungsfreiheit

5. Wahlen und Abstimmungen:
   - Regelmäßige freie Wahlen
   - Gleiches Wahlrecht für alle
   - Geheime Abstimmung

Arten von Demokratie:

Direkte Demokratie:
- Bürger entscheiden direkt (z.B. Volksabstimmungen)

Repräsentative Demokratie:
- Bürger wählen Vertreter, die Entscheidungen treffen

Herausforderungen:
- Korruption bekämpfen
- Partizipation der Bürger erhöhen
- Schutz von Minderheiten
    """),
    
    "bspl8.pdf": ("Informatik: Algorithmen und Big O - Jahr 10", """
Grundlagen von Algorithmen und Komplexitätsanalyse

Ein Algorithmus ist eine Schritt-für-Schritt-Anleitung zur Lösung eines Problems.

Eigenschaften guter Algorithmen:
1. Korrektheit: Löst das Problem richtig
2. Effizienz: Verwendet minimale Ressourcen
3. Verständlichkeit: Ist leicht zu verstehen
4. Terminierung: Endet nach endlicher Zeit

Big O Notation:

Big O beschreibt die Leistung eines Algorithmus bei großen Eingabemengen.

Häufige Komplexitätsklassen:

1. O(1) - Konstante Zeit:
   - Unabhängig von der Eingabegröße
   - Beispiel: Array-Zugriff

2. O(log n) - Logarithmisch:
   - Beispiel: Binäre Suche

3. O(n) - Linear:
   - Proportional zur Eingabegröße
   - Beispiel: Lineare Suche

4. O(n²) - Quadratisch:
   - Doppelte Schleife
   - Beispiel: Bubble Sort

5. O(n³) - Kubisch:
   - Dreifache Schleife

6. O(2ⁿ) - Exponentiell:
   - Sehr ineffizient

7. O(n!) - Faktoriell:
   - Äußerst ineffizient

Beispiel-Algorithmen:

Lineare Suche:
```
for i = 0 to n-1:
    if array[i] == target:
        return i
return -1
```
Komplexität: O(n)

Binäre Suche:
```
left = 0, right = n-1
while left <= right:
    mid = (left + right) / 2
    if array[mid] == target: return mid
    if array[mid] < target: left = mid + 1
    else: right = mid - 1
```
Komplexität: O(log n)

Wichtige Erkenntnisse:
- Algorithmuseffizienz wird kritisch bei großen Datenmengen
- Wahl des richtigen Algorithmus ist entscheidend
- Raumkomplexität ist ebenso wichtig wie Zeitkomplexität
    """),
}

# Create PDFs
output_dir = "client/content"
os.makedirs(output_dir, exist_ok=True)

styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=16,
    textColor=HexColor('#236C93'),
    spaceAfter=12,
)
body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['BodyText'],
    fontSize=10,
    spaceAfter=6,
)

for filename, (title, content) in contents.items():
    filepath = os.path.join(output_dir, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    story = []
    
    # Add title
    story.append(Paragraph(title, title_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Add content (split by lines)
    for line in content.strip().split('\n'):
        if line.strip():
            story.append(Paragraph(line.strip(), body_style))
        else:
            story.append(Spacer(1, 0.1*inch))
    
    # Build PDF
    doc.build(story)
    print(f"Created {filepath}")

print("\nAll PDFs generated successfully!")
