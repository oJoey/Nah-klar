# Einrichtung Supabase + Netlify (Etappe a)

## 1. Datenbank anlegen
1. Supabase-Projekt (Region Frankfurt) öffnen → **SQL Editor** → **New query**.
2. Inhalt von `supabase/migrations/20261104000100_basis.sql` einfügen → **Run**.
3. Danach genauso `supabase/migrations/20261104000200_vorbereitet_zahlung_bewertung.sql`
   und `supabase/migrations/20261107000300_pruefung_und_servicegebuehr.sql` (immer in dieser Reihenfolge).

## 2. Login per 6-stelligem Code
1. **Authentication → Sign In / Providers → Email**: aktiv lassen, „Confirm email“ an.
2. **Authentication → Emails → Templates → Magic Link** UND **Confirm signup**: Text ersetzen durch z. B.
   `Ihr Anmeldecode für nahklar: {{ .Token }}` (wichtig: `{{ .Token }}`, nicht `{{ .ConfirmationURL }}`).
3. Code-Länge: **Authentication → Providers → Email → Email OTP Length = 6**.
4. Vor dem Livegang eigenen Mailversand einrichten (**Authentication → SMTP**, z. B. Resend). Der Supabase-Standardversand schafft nur wenige Mails pro Stunde.

## 3. Schlüssel bei Netlify eintragen
Supabase: **Project Settings → API**. Bei Netlify: **Site configuration → Environment variables**:
- `PUBLIC_SUPABASE_URL` = Project URL
- `PUBLIC_SUPABASE_ANON_KEY` = anon/public bzw. „publishable“ Key (NICHT den service_role/secret Key)
- `PUBLIC_KARTE_KEY` = Schlüssel von maptiler.com (optional; ohne ihn gibt es nur die Liste)

Danach neu deployen.

## 4. Sich selbst zum Admin machen
Einmal auf der Website anmelden (`/konto/anmelden/`), dann im SQL Editor:
```sql
update public.profile set ist_admin = true where email = 'DEINE@EMAIL.DE';
```
Freigabe der Inserate: `/admin/inserate/`.

## Lokal testen (optional)
`.env.example` nach `.env` kopieren, Werte eintragen, `npm run dev`.
Die Datenbankregeln lassen sich ohne Supabase mit einem normalen Postgres testen: `supabase/test/` (stubs.sql, dann Migrationen, dann test_basis.sql).

## 5. Mails bei Anfragen (Übergang bis Etappe b)
„Besichtigung anfragen“ und „Platz anbieten“ laufen vorerst über Netlify Forms.
Netlify: **Forms → Form notifications → Add notification → Email notification**, Formular „Any form“, deine E-Mail-Adresse.
Formular-Erkennung muss an sein (**Forms → Enable form detection**).

## 6. Mailversand mit Resend

**Ja, beides ist nötig:**
- `RESEND_API_KEY`: ohne Schlüssel nimmt Resend keine Mails an.
- **Verifizierte Absender-Domain**: Ohne sie lässt Resend nur Testmails an die eigene Konto-Adresse zu, nicht an Mieter und Vermieter.

Resend wird an zwei Stellen gebraucht:
1. **Anmeldecodes** (Supabase verschickt sie). Der Standardversand von Supabase ist nur zum Testen gedacht: sehr wenige Mails pro Stunde und je nach Projekt nur an Adressen von Mitgliedern deines Supabase-Teams. **Kommt beim Test kein Code an, liegt es meist daran.**
2. **Benachrichtigungen** (neue Anfrage, Termin, später Nachricht) und Bestätigungsmails der Formulare, verschickt von der Website über Netlify.

### Schritte
1. Konto bei resend.com anlegen.
2. **Domains → Add Domain**: am besten eine Unterdomain wie `mail.deine-domain.de`. Als Region **EU** wählen, falls angeboten.
3. Die DNS-Einträge, die Resend anzeigt (SPF, DKIM, meist auch MX für Rückläufer), bei deinem Domain-Anbieter eintragen. Warten, bis Resend „Verified“ zeigt. Das dauert Minuten bis einige Stunden.
4. Empfohlen: einen DMARC-Eintrag für die Domain anlegen (Resend zeigt ein Beispiel). Ohne ihn landen Mails eher im Spam.
5. **API Keys → Create API Key**, Berechtigung „Sending access“, auf die Domain beschränkt.
6. Bei Resend den Vertrag zur Auftragsverarbeitung (DPA) abschließen. Die Datenschutzerklärung muss Resend als Dienst nennen (Platzhalter folgt mit Etappe b).

### Eintragen bei Supabase (Anmeldecodes)
**Authentication → Emails → SMTP Settings → Enable custom SMTP:**
- Host `smtp.resend.com`, Port `465`, Benutzername `resend`, Passwort = der Resend-API-Schlüssel
- Absender: z. B. `anmeldung@mail.deine-domain.de`, Name „nahklar“

Danach unter **Authentication → Rate Limits** das Limit für E-Mails nach Bedarf erhöhen.

### Eintragen bei Netlify (Benachrichtigungen)
**Site configuration → Environment variables:**

| Name | Wert | Wofür |
|---|---|---|
| `RESEND_API_KEY` | Resend-Schlüssel | Versand |
| `MAIL_ABSENDER` | `nahklar <hallo@mail.deine-domain.de>` | Absender, Domain muss verifiziert sein |
| `MAIL_ANTWORT` | optional, z. B. deine normale Adresse | Antworten landen dort |
| `MAIL_ADMIN` | deine Adresse | Kopie jeder neuen Anfrage an dich (ab Etappe b1) |
| `MARKENNAME` | `nahklar` | Name in den Mails |
| `NETLIFY_API_TOKEN` | Netlify → User settings → Applications → Personal access tokens | Schutz der Bestätigungsmails vor Missbrauch |

Danach neu veröffentlichen. Die Bestätigungsmails der Formulare schaltest du mit `bestaetigungsmail: true` in `src/config/site.ts` ein.

## 7. Checkliste: Servicegebühr später einschalten

Erst einschalten, wenn die Zahlungsabwicklung über den Zahlungsdienstleister läuft und AGB, Preisseite und Datenschutzerklärung angepasst sind.

**Vorher**
- [ ] Satz prüfen: `select wert from public.einstellungen where schluessel = 'servicegebuehr';` (Standard `{"satz": 0.10}`)
- [ ] Gleicher Satz in `src/config/zahlung.ts` (`servicegebuehr: 0.1`)
- [ ] Provision prüfen (`vermieter_provision`), und ob sie im Formular erscheinen soll (`provision_anzeigen` in der Datenbank und `provisionAnzeigen` in `zahlung.ts`)

**Umschalten (beide Stellen, direkt nacheinander)**
1. [ ] Datenbank: `update public.einstellungen set wert = 'true' where schluessel = 'servicegebuehr_aktiv';`
2. [ ] `src/config/zahlung.ts`: `servicegebuehrAktiv: true`, committen und neu veröffentlichen

Zwischen Schritt 1 und dem fertigen Deploy zeigen Suche und Inserate schon den neuen Preis, die Info-Seiten noch den alten Text. Deshalb beides zügig hintereinander erledigen.

**Danach prüfen**
- [ ] `/admin/inserate/`: keine rote Warnung „Schalter … stimmt nicht überein“
- [ ] Ein Inserat mit 85 € Wunschbetrag zeigt in Suche und Detailseite **94 €** (85 € + 10 % = 93,50 €, aufgerundet)
- [ ] Unter dem Preis steht „Gesamtpreis inklusive Servicegebühr“ statt „Endpreis ohne weitere Gebühren“
- [ ] `/preise/` und FAQ „Was kostet die Miete?“ nennen die Servicegebühr
- [ ] Im Inserat-Assistenten, Schritt Preis: „Mieter sehen den Gesamtpreis inklusive Servicegebühr“, die Provision nur, wenn `provision_anzeigen` an ist
- [ ] Laufende Mietverhältnisse: Die Buchungen speichern Gebührensatz und Provision beim Abschluss. Bestehende Buchungen ändern sich nicht.

**Zurückschalten:** dieselben zwei Stellen auf `false` setzen, dann dieselbe Prüfung.
