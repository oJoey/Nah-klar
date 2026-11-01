# Dienste für den Datenschutz-Generator

Stand: Website mit Netlify-Hosting, Netlify Forms und (vorbereitet) Resend. Bitte im Generator (z. B. e-recht24, Datenschutz-Generator.de) jeweils angeben.

| Dienst | Wofür | Anbieter / Sitz | Daten | Status |
|---|---|---|---|---|
| **Netlify Hosting** | Auslieferung der Website, CDN | Netlify, Inc., San Francisco, USA (EU-US Data Privacy Framework) | IP-Adresse, Browserdaten in Server-Logs | aktiv |
| **Netlify Forms** inkl. **Datei-Uploads** | Suchauftrag, Fläche melden, Löschanfrage; Fotos der Flächen | Netlify, Inc., USA (Speicherung der Dateien bei Netlify/AWS) | alle Formularangaben, Fotos, Adresse der Fläche | aktiv |
| **Netlify Functions** | Bestätigungsmail auslösen (`submission-created`) | Netlify, Inc., USA | Formularangaben (nur zur Weitergabe an Resend) | aktiv, versendet erst mit Schlüssel |
| **Resend** | Bestätigungsmails | Resend, Inc., USA – beim Einrichten **Region EU** wählen | E-Mail-Adresse, Vorname, Formularangaben | vorbereitet |
| **Umami Cloud** | Besucherstatistik ohne Cookies | Umami Software, Inc., USA (EU-Hosting wählbar) | anonymisierte Nutzungsdaten | nur wenn `umamiWebsiteId` gesetzt |
| **WhatsApp** (nur Link) | Kontakt per WhatsApp | WhatsApp Ireland Ltd. / Meta | erst beim Klick auf den Link | aktiv |
| **Stripe** | später: Lastschrift, Auszahlung | Stripe Payments Europe Ltd., Irland | Zahlungsdaten | später |
| Google Sheets | – | – | – | **nicht genutzt** |

**Nicht** anzugeben, weil nichts zur Laufzeit geladen wird: Schriften (Manrope liegt auf dem eigenen Server), Karte (OpenStreetMap-Daten sind als Bild eingebaut, nur Quellenhinweis).

## Angaben zu den Formularen

- **Zweck:** Vermittlung von Stellplätzen, Garagen und Lagerflächen zwischen Privatleuten.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines Vertrags). Keine Werbe-Einwilligung, kein Newsletter.
- **Benachrichtigungen** zu passenden Plätzen sind Teil des Suchauftrags, keine Werbung. Jede Mail enthält einen Link „Suchauftrag löschen“ (`/daten-loeschen/`).
- **Speicherdauer:** Suchaufträge ohne Rückmeldung werden nach **12 Monaten** gelöscht. Zum Start geschieht das von Hand (monatlich in Netlify → Forms prüfen). Automatik siehe `docs/plan-inserate.md`.
- **Löschanfragen** kommen über das Formular `loeschanfrage` und werden von Hand erledigt.
- **Empfänger:** Netlify (Speicherung), Resend (Mailversand). Die Adresse einer Fläche wird nie veröffentlicht; Interessenten erfahren nur den Ortsteil.

## Vor dem Livegang

- Impressum und Datenschutz füllen (`src/pages/impressum/`, `src/pages/datenschutz/`), danach `noindex` entfernen. Weitere Aufgaben vor dem Livegang: `docs/stripe-connect.md`.
- Auftragsverarbeitungsverträge (DPA) mit Netlify und Resend abschließen (beide online im Konto).
- Bei Resend die Absender-Domain bestätigen, `RESEND_API_KEY`, `MAIL_ABSENDER`, `NETLIFY_API_TOKEN` in Netlify setzen, dann in `src/config/site.ts` `bestaetigungsmail: true`.
