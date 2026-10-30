# Platz Kompass – Website (Pilot)

Arbeitsname, wird später geändert (`src/config/site.ts`).

Astro-Website auf Netlify. Phase 1: persönlicher Suchservice, Vermittlung von Hand.

## Lokal starten

```bash
npm install
npm run dev
```

## Wo was steht

| Was | Datei |
|---|---|
| Name, Telefon, Domain, Antwortzeit, Schalter `zahlungLive`, Umami | `src/config/site.ts` |
| Welche Seiten live sind (Links passen sich automatisch an) | `src/config/seiten.ts` |
| Aktionsbalken (Text, Enddatum) | `src/config/aktion.json` |
| Servicegebühr, Kaution, Zahltage | `src/config/zahlung.ts` |
| Kennzahlen (erscheinen erst ab 3) | `src/data/kennzahlen.json` |
| Richtwerte Verdienstrechner | `src/data/richtwerte.json` |
| Bewertungen (leer = ausgeblendet) | `src/data/bewertungen.json` |
| FAQ-Texte | `src/content/faq/*.md` |
| Bestätigungsmails | `netlify/functions/submission-created.mjs` |
| Stripe-Vorbereitung | `docs/stripe-connect.md` |

Eine neue Seite live schalten: Seite anlegen und in `src/config/seiten.ts` `live: true` setzen.

Seiten mit `entwurf: true` sind Platzhalter (Text in `src/data/entwuerfe.ts`): verlinkt, aber `noindex` und nicht in der Sitemap. Wenn eine richtige Seite dafür gebaut ist, `entwurf` entfernen.

## Netlify einrichten

1. Formular-Erkennung aktivieren (Forms → Enable form detection).
2. Umgebungsvariablen: `RESEND_API_KEY`, `MAIL_ABSENDER`, `MAIL_ANTWORT` (optional), `MARKENNAME`, `NETLIFY_API_TOKEN`.
3. Bei Resend die Absender-Domain bestätigen.
4. Benachrichtigung über neue Einsendungen an Sie selbst: Forms → Form notifications.

## Fotos

Aktuell sind Übergangsfotos von Wikimedia Commons eingebaut (`src/assets/bilder/`, Nachweise in `src/data/bildnachweise.json`, Liste im Impressum).

Eigene Fotos (ohne Personen und Kennzeichen) haben Vorrang:
- `start.jpg` ersetzt das Bild im Kopfbereich der Startseite,
- `mieten.jpg` das auf `/mieten/`, `vermieten-hof.jpg` das im Hof-Abschnitt auf `/vermieten/`.

Für die Kacheln den Namen in `src/data/arten.ts` (Feld `bild`) anpassen. Wird ein Commons-Foto entfernt, auch den Eintrag in `bildnachweise.json` löschen.
