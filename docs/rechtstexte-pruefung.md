# Rechtstexte: Entwurf und Fragen für die anwaltliche Prüfung

Stand: November 2026. Impressum (`/impressum/`), Datenschutzerklärung (`/datenschutz/`) und AGB mit Widerrufsbelehrung (`/agb/`) sind **Entwürfe**, geschrieben ohne anwaltliche Beratung. Sie sollen die Prüfung verkürzen, nicht ersetzen.

Die Seiten bleiben `noindex` und stehen nicht in der Sitemap, bis in `src/config/site.ts` → `betreiber.name` ein echter Name steht.

## Geschäftsmodell in Kürze (für die Prüfung)

- Einzelunternehmen, Kleinunternehmer nach § 19 UStG, Sitz in Baden-Württemberg.
- Mieter und Vermieter zusammenbringen (Vorschläge, Mustervertrag, Betreuung) für Mietverträge über Stellplätze, Garagen, Hallen/Scheunen und Lagerräume **zwischen Privatpersonen**. Kein Inserateportal: Anfrage per Formular, Vermittlung von Hand per WhatsApp und E-Mail.
- Vermieter zahlen nichts. Mieter zahlen
  - eine **Abschlussgebühr** von 19 € bzw. 39 €, nur wenn ein Mietvertrag zustande kommt (Startaktion: entfällt bis 31.01.2027),
  - eine monatliche **Servicegebühr** von 10 % der Miete für die Dauer des Mietverhältnisses (Betreuung, Zahlungserinnerung, Vorlagen, Nachvermittlung).
- Miete und Kaution fließen direkt zwischen Mieter und Vermieter. Später geplant: Einzug der Miete über Stripe Connect (dann DAC7-Meldung, Empfangsvollmacht usw., siehe `docs/stripe-connect.md`).
- Mustermietvertrag wird gestellt (noch nicht erstellt).

## Wichtigste offene Fragen (nach Risiko sortiert)

1. **Erlaubnis nach § 34c GewO?** Hinweis: Auf der Website heißt es nicht mehr „Vermittlung“, sondern „zusammenbringen“, „Abschlussgebühr“ usw. Ob § 34c greift, hängt aber von der tatsächlichen Tätigkeit ab (Nachweis bzw. Vermittlung gegen Entgelt), nicht vom Wort. Die Frage bleibt also offen.
    § 34c Abs. 1 Nr. 1 erfasst die Vermittlung von Verträgen über „Grundstücke, grundstücksgleiche Rechte, gewerbliche Räume, Wohnräume“. Fällt die gewerbsmäßige Vermittlung von Mietverträgen über Stellplätze, Garagen und Lagerräume darunter? Falls ja: Erlaubnis, Sachkunde-/Zuverlässigkeitsnachweise, Angabe der Aufsichtsbehörde im Impressum (Schalter `betreiber.erlaubnis` ist vorbereitet), ggf. MaBV-Pflichten. **Vor dem Start klären** (IHK oder Gewerbeamt fragen kostet nichts).
2. **Widerrufsrecht und Vertragsschluss.** Wann und wie kommt der entgeltliche Vertrag mit dem Mieter zustande (Formular, E-Mail, WhatsApp, Unterschrift beim Mietvertrag)? Davon hängt ab:
   - ob ein Fernabsatzvertrag vorliegt und die Belehrung wie im Entwurf passt,
   - wie das ausdrückliche Verlangen nach Leistungsbeginn vor Fristende (§ 356 Abs. 4, § 357a BGB) eingeholt wird; sonst kann der Mieter nach Vertragsschluss widerrufen und schuldet ggf. nichts,
   - ob die **Widerrufsfunktion** („Widerrufsbutton“, seit 19.06.2026 aufgrund der Richtlinie (EU) 2023/2673) nötig ist, wenn Verträge über die Website geschlossen werden,
   - ob der **Kündigungsbutton** (§ 312k BGB) für die laufende Servicegebühr nötig ist,
   - ob die Muster-Widerrufsbelehrung im Entwurf der aktuell gültigen Fassung (Anlage 1 zu Art. 246a § 1 Abs. 2 EGBGB) entspricht.
3. **Preisdarstellung.** Mieter sehen überall nur den Gesamtpreis pro Monat (Miete + 10 % Servicegebühr). Vor dem Abschluss gibt es eine Aufschlüsselung (Miete, Servicegebühr, Gesamt, Abschlussgebühr, Kaution). Passt das zur Preisangabenverordnung, auch weil Miete und Servicegebühr im Übergang an verschiedene Empfänger gehen?
4. **Servicegebühr als Dauerschuldverhältnis.** Wirksamkeit der Kopplung an die Laufzeit des Mietvertrags (§ 309 Nr. 9 BGB) und der Leistungsbeschreibung in § 2 Abs. 2. Reicht die Gegenleistung, damit die Gebühr nicht als verdeckte Provision ohne Leistung gilt?
5. **Umgehungsklausel** (§ 6 Abs. 2 bzw. 3 AGB: Gebühr auch bei Vertragsschluss ohne uns binnen 12 Monaten). Mit Maklerrecht (§ 652 BGB, Kausalität) und AGB-Recht vereinbar?
6. **Rechtsdienstleistungsgesetz.** Zahlungserinnerungen im Auftrag des Vermieters und Hilfe bei Problemen zwischen den Parteien: wo ist die Grenze zur erlaubnispflichtigen Rechtsdienstleistung oder zum Inkasso? Der Entwurf vermeidet „Streitschlichtung“ bewusst.
7. **Herkunfts-Speicherung im Session Storage** (`src/layouts/Basis.astro`, für UTM- und Flyer-Parameter). Nach § 25 TDDDG braucht jede Speicherung auf dem Endgerät eine Einwilligung, außer sie ist unbedingt erforderlich. Das ist hier fraglich. Alternativen: entfernen (Umami erfasst UTM-Parameter ohnehin) oder Einwilligung einholen. **Ich empfehle das Entfernen.**
8. **Datenweitergabe an die Gegenseite** (Datenschutz, Abschnitt „Weitergabe“) beschreibt den *geplanten* Ablauf (erst Ortsteil, Vorname, dann Name und Adresse nach Zustimmung beider). Er muss genau der Praxis entsprechen.
9. **Mahnpauschale 2,50 €** (§ 7 Abs. 3 AGB): Höhe und Formulierung nach § 309 Nr. 5 BGB.
10. **Haftungsklausel** (§ 9): Standardformulierung, bitte auf aktuelle Rechtsprechung prüfen.

## Vom Betreiber selbst zu erledigen

- [ ] `betreiber` in `src/config/site.ts` ausfüllen (Name, ladungsfähige Anschrift; Wirtschafts-ID, sobald zugeteilt)
- [ ] `site.email`, WhatsApp-Nummer und Domain eintragen
- [ ] Gewerbe anmelden
- [ ] Auftragsverarbeitungsverträge abschließen: Netlify, Umami, später Resend (jeweils im Konto)
- [ ] Prüfen, ob Netlify auf der Liste des EU-US Data Privacy Framework steht (dataprivacyframework.gov), sonst Text anpassen
- [ ] Mustermietvertrag erstellen und mitprüfen lassen
- [ ] Nach der Prüfung: „Stand“-Datum in Datenschutz und AGB anpassen

## Bewusst weggelassen

- **Link zur OS-Plattform der EU:** Die Plattform wurde am 20.07.2025 abgeschaltet, der Link ist nicht mehr Pflicht und sollte nicht mehr verwendet werden.
- **Pauschale „Haftung für Inhalte und Links“** im Impressum: Sie ist rechtlich weitgehend wirkungslos.
- **Datenschutzbeauftragter:** Er ist erst ab 20 Personen nötig, die ständig mit Daten arbeiten.
