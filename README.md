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

## Netlify einrichten

1. Formular-Erkennung aktivieren (Forms → Enable form detection).
2. Umgebungsvariablen: `RESEND_API_KEY`, `MAIL_ABSENDER`, `MAIL_ANTWORT` (optional), `MARKENNAME`, `NETLIFY_API_TOKEN`.
3. Bei Resend die Absender-Domain bestätigen.
4. Benachrichtigung über neue Einsendungen an Sie selbst: Forms → Form notifications.

## Eigene Fotos einbauen

Fotos (ohne Personen) als `start.jpg` bzw. `mieten.jpg` nach `src/assets/bilder/` legen.
Sie ersetzen dann automatisch die Karten-Illustration im Kopfbereich und werden beim Bauen verkleinert und optimiert.
