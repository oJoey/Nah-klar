# Plan für später: Inserate, Konten, Abgleich

**Nicht gebaut.** Zum Start läuft die Vermittlung von Hand: Suchaufträge und Flächenmeldungen kommen über Netlify Forms, der Abgleich und die Rückmeldung an beide Seiten passieren persönlich.

## Ziel

1. Öffentliche Inserate (ohne Adresse, nur Ortsteil) nach Freigabe von Hand
2. Vermieter melden sich per E-Mail-Link an (kein Passwort) und pflegen ihre Flächen
3. Automatischer Abgleich: neue Fläche ↔ offene Suchaufträge → Vorschlagsliste für die Freigabe
4. Löschung nach 12 Monaten automatisch (Weg b)

## Technik

- **Supabase**, Region **EU (Frankfurt, eu-central-1)**: Postgres, Auth (Magic Link), Storage für Fotos, Row Level Security
- Website bleibt Astro auf Netlify; Formulare schreiben über eine Netlify Function in Supabase (Service-Key nur in der Funktion)
- Mails weiter über Resend

## Datenmodell

Die Spalten heißen wie die heutigen Formularfelder – Netlify-Einsendungen lassen sich per CSV-Export 1:1 übernehmen.
Werte siehe `src/data/optionen.json`.

**suchauftraege**
`id uuid`, `erstellt_am`, `status` (offen · vorschlag · vermittelt · geloescht), `mieter_art`, `laenge_max`, `hoehe_max`, `flaeche_max`, `ort`, `plz` (aus `ort` abgeleitet), `umkreis_km`, `wuensche text[]`, `budget_max`, `ab_wann`, `vorname`, `email`, `telefon`, `quelle`, `letzte_rueckmeldung_am`, `loeschen_ab` (= letzte Rückmeldung + 12 Monate)

**flaechen**
`id`, `erstellt_am`, `vermieter_id → vermieter`, `status` (gemeldet · geprueft · veroeffentlicht · vermietet · pausiert), `flaechen_art`, `geeignet_fuer text[]`, `laenge_klasse` (5 · 7 · 9 · ueber-9), `breite_klasse`, `durchfahrt_hoehe`, `flaeche_qm`, `anzahl_plaetze`, `ausstattung text[]`, `wunschpreis`, `strasse`, `plz`, `ort`, `ortsteil` (öffentlich), `lat`/`lng` (für Umkreissuche, nicht öffentlich), `geprueft_am`, `geprueft_von`

**fotos** – `id`, `flaeche_id`, `pfad` (Supabase Storage, privat bis zur Freigabe), `reihenfolge`

**vermieter** – `id` (= Supabase-Auth-Nutzer), `vorname`, `nachname`, `email`, `telefon`, `erstellt_am`

**vorschlaege** – `id`, `suchauftrag_id`, `flaeche_id`, `punkte` (Abgleich), `status` (neu · freigegeben · verworfen · gesendet · angenommen), `erstellt_am`

## Abgleich (Regeln)

Zuordnung aus `optionen.json`: jede `mieter_art` nennt die passenden `flaechen_art` und ein `geeignet_fuer` (z. B. Garage → `flaechen_art` garage, `geeignet_fuer` auto-motorrad; Lagerraum → lagerraum/garage/halle-scheune, lagergut).

Passend, wenn: `flaechen_art` der Fläche in der Liste der `mieter_art` und `geeignet_fuer` enthält den Wert der `mieter_art` · Länge/Höhe/Fläche reicht · Entfernung ≤ `umkreis_km` (PostGIS oder Haversine) · Preis ≤ `budget_max` (oder egal) · Wünsche erfüllt (weiche Bewertung, erhöht `punkte`).

## Seiten

- `/inserate/` – Liste mit Filtern (Art, Ort, Umkreis), nur freigegebene Flächen
- `/inserate/<ortsteil>-<id>/` – Detail ohne Adresse, Button „Anfragen“ (legt Suchauftrag/Vorschlag an)
- `/konto/` – Vermieter: Anmeldung per E-Mail-Link, eigene Flächen bearbeiten, pausieren
- `/admin/freigabe/` – nur für dich: neue Flächen prüfen, Vorschläge freigeben

## Ablauf

Fläche gemeldet → Prüfung von Hand (Fotos, Angaben) → freigegeben → Abgleich erzeugt Vorschläge → du gibst frei → Mail an Mieter mit Fotos, Preis, Ortsteil → Besichtigung → Vertrag.

## Löschung (Weg b)

- Täglicher Job (Supabase `pg_cron` oder Netlify Scheduled Function): Suchaufträge mit `loeschen_ab < heute` löschen, Fotos verwaiste Flächen entfernen
- „Suchauftrag löschen“-Link mit signiertem Token statt Formular → sofortige Löschung
- Übergangsweise mit Netlify Forms: Scheduled Function löscht Einsendungen > 12 Monate über die Netlify-API (braucht `NETLIFY_API_TOKEN`)
