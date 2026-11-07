# Plan Etappe b1 (abgestimmt, noch nicht gebaut)

## Anfrage mit Anmeldung in einem Schritt
- Im Inserat: Vorname (Pflicht), E-Mail, Nachricht → „Anfrage senden“ → Code-Eingabe auf derselben Seite → Konto entsteht automatisch, Anfrage wird gespeichert.
- Bereits angemeldet: nur Nachricht (Vorname aus dem Profil).
- Ersetzt das Übergangsformular (Netlify Forms) und das alte „Platz anbieten“-Formular.

## Kontaktdaten
- **Vermieter:** voller Name und Telefon sind Pflicht beim Anlegen des ersten Inserats (im Profil gespeichert). Wer schon Entwürfe ohne diese Angaben hat, wird beim Einreichen danach gefragt.
- **Mieter:** voller Name und Telefon sind Pflicht beim Bestätigen eines Termins (im Profil gespeichert).
- Vor der Bestätigung sieht der Vermieter nur den Vornamen des Mieters.
- **Freigabe pro Anfrage:** Erst nach bestätigtem Termin sehen beide Seiten dieser Anfrage voneinander vollen Namen und Telefon, der Mieter zusätzlich die Adresse **dieses** Inserats.
- Angezeigt wird immer der aktuelle Stand aus dem Profil, keine Kopie.
- Umsetzung in der Datenbank (Zugriffsregeln bzw. abgesicherte Funktion), nicht nur in der Anzeige.

## Datenbanktests (Pflicht)
- Mieter ohne bestätigten Termin: weder Name/Telefon des Vermieters noch Adresse abrufbar.
- Mieter mit bestätigtem Termin bei Vermieter X: sieht X, aber **nicht** die Daten von Vermieter Y.
- Gleicher Mieter, zweites Inserat von X ohne bestätigten Termin: Adresse dieses Inserats nicht abrufbar.
- Vermieter sieht nur Mieter seiner eigenen Anfragen, vor der Bestätigung nur den Vornamen.
- Telefonänderung im Profil wird sofort angezeigt.

## Termine
- Vermieter schlägt einen oder mehrere Termine vor, Mieter bestätigt einen (oder lehnt ab, Vermieter schlägt neu vor).
- Absagen auf beiden Seiten möglich.

## Dashboards
- Mieter: eigene Anfragen mit Status, Terminvorschläge, bestätigte Termine mit Kontaktdaten.
- Vermieter: Anfragen je Inserat, Termine vorschlagen, bestätigte Termine mit Kontaktdaten.

## Mails (Resend)
- Neue Anfrage → Vermieter, Kopie an `MAIL_ADMIN`
- Terminvorschlag → Mieter
- Termin bestätigt / abgesagt → beide
- „Neue Nachricht“ folgt mit b2 (Nachrichten, Ausblenden von Kontaktdaten).
