# Einrichtung Supabase + Netlify (Etappe a)

## 1. Datenbank anlegen
1. Supabase-Projekt (Region Frankfurt) öffnen → **SQL Editor** → **New query**.
2. Inhalt von `supabase/migrations/20261104000100_basis.sql` einfügen → **Run**.
3. Danach genauso `supabase/migrations/20261104000200_vorbereitet_zahlung_bewertung.sql`.

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
