-- nahklar – vorbereitete Tabellen ohne Oberfläche: Buchungen, Zahlungen, Auszahlungen,
-- Konten beim Zahlungsdienstleister, Bewertungen.
-- Zahlung, Zahlungsgarantie und Mahnung sind NICHT Teil des MVP. Geld fließt später
-- ausschließlich über einen Zahlungsdienstleister (z. B. Stripe Connect), nie über uns.
-- Schreiben dürfen hier nur der Server (service_role) bzw. Admins, Nutzer nur lesen.

-- Buchung: entsteht nach der Besichtigung. Gebührensätze werden beim Buchen eingefroren,
-- damit spätere Änderungen in „einstellungen“ laufende Mietverhältnisse nicht verändern.
create table public.buchungen (
  id uuid primary key default gen_random_uuid(),
  inserat_id uuid not null references public.inserate (id) on delete restrict,
  mieter_id uuid not null references public.profile (id) on delete restrict,
  vermieter_id uuid not null references public.profile (id) on delete restrict,
  status text not null default 'angelegt'
    check (status in ('angelegt', 'zahlung_offen', 'aktiv', 'gekuendigt', 'beendet', 'storniert')),
  mietart text not null check (mietart in ('monatlich', 'saisonal')),
  beginn date not null,
  ende date,
  vermieterpreis numeric(8, 2) not null check (vermieterpreis > 0),
  servicegebuehr_satz numeric(5, 4) not null,
  gesamtpreis integer not null,
  provision_art text not null check (provision_art in ('prozent', 'betrag')),
  provision_wert numeric(8, 4) not null,
  provision_betrag numeric(8, 2) not null,
  provision_abgezogen boolean not null default false,
  erstellt_am timestamptz not null default now(),
  aktualisiert_am timestamptz not null default now()
);
create trigger buchungen_aktualisiert before update on public.buchungen
  for each row execute function public.setze_aktualisiert_am();

-- Konto des Vermieters beim Zahlungsdienstleister (z. B. Stripe Connect Express)
create table public.zahlungskonten (
  profil_id uuid primary key references public.profile (id) on delete cascade,
  anbieter text not null default 'stripe',
  konto_id text not null unique,
  auszahlungen_aktiv boolean not null default false,
  erstellt_am timestamptz not null default now()
);

-- Zahlung des Mieters (eine Zeile pro Monat bzw. Saison), Referenzen des Zahlungsdienstleisters
create table public.zahlungen (
  id uuid primary key default gen_random_uuid(),
  buchung_id uuid not null references public.buchungen (id) on delete restrict,
  zeitraum_von date not null,
  zeitraum_bis date not null,
  betrag numeric(8, 2) not null,
  servicegebuehr numeric(8, 2) not null,
  status text not null default 'offen' check (status in ('offen', 'bezahlt', 'fehlgeschlagen', 'erstattet')),
  anbieter_referenz text unique,
  erstellt_am timestamptz not null default now()
);

-- Auszahlung an den Vermieter. Bei der ersten Auszahlung wird die Provision abgezogen.
create table public.auszahlungen (
  id uuid primary key default gen_random_uuid(),
  buchung_id uuid not null references public.buchungen (id) on delete restrict,
  zahlung_id uuid references public.zahlungen (id) on delete restrict,
  betrag numeric(8, 2) not null,
  provision_abzug numeric(8, 2) not null default 0,
  status text not null default 'geplant' check (status in ('geplant', 'ausgezahlt', 'fehlgeschlagen')),
  anbieter_referenz text unique,
  erstellt_am timestamptz not null default now()
);

-- Bewertungen (Phase 2): nur nach einer Buchung, je Seite eine Bewertung pro Buchung
create table public.bewertungen (
  id uuid primary key default gen_random_uuid(),
  buchung_id uuid not null references public.buchungen (id) on delete cascade,
  von_id uuid not null references public.profile (id) on delete cascade,
  fuer_id uuid not null references public.profile (id) on delete cascade,
  inserat_id uuid references public.inserate (id) on delete set null,
  sterne smallint not null check (sterne between 1 and 5),
  text text check (char_length(text) <= 2000),
  status text not null default 'pruefung' check (status in ('pruefung', 'sichtbar', 'verborgen')),
  erstellt_am timestamptz not null default now(),
  unique (buchung_id, von_id)
);

alter table public.buchungen enable row level security;
alter table public.zahlungskonten enable row level security;
alter table public.zahlungen enable row level security;
alter table public.auszahlungen enable row level security;
alter table public.bewertungen enable row level security;

create policy "Buchungen lesen" on public.buchungen for select
  using (mieter_id = auth.uid() or vermieter_id = auth.uid() or public.ist_admin());
create policy "Zahlungskonto lesen" on public.zahlungskonten for select
  using (profil_id = auth.uid() or public.ist_admin());
create policy "Zahlungen lesen" on public.zahlungen for select
  using (exists (select 1 from public.buchungen b where b.id = buchung_id
                 and (b.mieter_id = auth.uid() or b.vermieter_id = auth.uid() or public.ist_admin())));
create policy "Auszahlungen lesen" on public.auszahlungen for select
  using (exists (select 1 from public.buchungen b where b.id = buchung_id
                 and (b.vermieter_id = auth.uid() or public.ist_admin())));
create policy "sichtbare Bewertungen lesen" on public.bewertungen for select
  using (status = 'sichtbar' or von_id = auth.uid() or public.ist_admin());
