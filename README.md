# HSGG - Gruppe 4A 2

## Voraussetzungen

Die folgenden Tools werden zum Bauen dieses Projekts benötigt:

| Tool   | Version  |
| ------ | :------: |
| JDK    | `25.0.0` |
| Gradle | `9.0.0`  |
| Docker | `28.4.0` |

## Verwendung

### Schritt 1: Datenbank starten

Das Backend benötigt zwingend eine laufende MariaDB-Instanz.

```sh
docker-compose up -d
```

### Schritt 2: Server starten

```sh
gradle server:bootRun
```

Öffnen Sie <http://localhost:8080>, um die Anwendung zu starten.
