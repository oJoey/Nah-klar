# Richtwerte abgleichen (Landkreis Böblingen)

Die Richtpreise in `src/data/richtwerte.json` erscheinen auf Preise-Seite, Kategorieseiten, Regionsseite, Winterplatz-Vergleich und im Verdienstrechner. Falsche Werte schrecken Mieter oder Vermieter ab.

**Stand:** Nur Garage bis 5 m und Pkw-Außenstellplatz bis 5 m sind mit echten Angeboten abgeglichen (22 Immowelt-Angebote im Kreis Böblingen, 11/2026). Alle anderen Werte sind geschätzt.

Ein automatischer Abruf von Kleinanzeigen hat nicht funktioniert: Der Ortsfilter greift beim Abruf nicht, es kommen nur Ergebnisse aus ganz Deutschland. Der Abgleich muss deshalb von Hand im Browser erfolgen (ca. 30 Minuten).

## So geht's

1. kleinanzeigen.de → Kategorie „Garagen & Stellplätze“, Ort **Böblingen**, Umkreis **20 km**, Filter **Angebote** und **Mieten**.
2. Suchbegriffe nacheinander: `Wohnmobil`, `Wohnwagen`, `Halle`, `Scheune`, `Carport`, `überdacht`, `Garage`, `Stellplatz`, `Lager`. Für Lagerräume zusätzlich die Kategorie „Lagerräume“.
3. Pro Angebot eintragen: Art, Fahrzeuglänge (falls genannt), Monatspreis. Weglassen: Gesuche, Kaufangebote, „VB“ ohne Betrag, gewerbliche Self-Storage-Ketten mit Lockpreisen.
4. Mindestens 5 Angebote pro Zeile sammeln, sonst den Wert als geschätzt stehen lassen.
5. In `richtwerte.json` als Spanne das untere und obere Viertel eintragen (nicht Minimum und Maximum, Ausreißer verzerren).

## Tabelle zum Ausfüllen

| Art | Klasse | aktuell | Angebote (Preise) | neu |
|---|---|---|---|---|
| Stellplatz im Freien | bis 7 m | 45 bis 70 € | | |
| Stellplatz im Freien | bis 9 m | 55 bis 85 € | | |
| Stellplatz überdacht | bis 5 m | 45 bis 65 € | | |
| Stellplatz überdacht | bis 7 m | 65 bis 95 € | | |
| Stellplatz überdacht | bis 9 m | 80 bis 115 € | | |
| Garage | bis 7 m | 90 bis 130 € | | |
| Halle / Scheune | bis 7 m | 80 bis 120 € | | |
| Halle / Scheune | bis 9 m | 100 bis 145 € | | |
| Halle / Scheune | über 9 m | 120 bis 170 € | | |
| Lagerraum | pro m² | 7 bis 13 € | | |

## Darstellung (entschieden)

Die Spannen erscheinen auf Mieter- und Vermieter-Seiten gleich, beschriftet als „Übliche Monatsmiete in der Region (Richtwert)“. Es wird nichts umgerechnet, also keine 10 % auf- oder abgeschlagen. Gesammelte Marktpreise deshalb direkt als Spanne eintragen.
