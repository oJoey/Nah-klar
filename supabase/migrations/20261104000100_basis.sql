-- nahklar – Basis-Schema: Profile, Einstellungen, Orte, Inserate, Adressen, Fotos
-- Ausführen im Supabase-Dashboard: SQL Editor → New query → Inhalt einfügen → Run.
-- Reihenfolge der Dateien im Ordner supabase/migrations einhalten.

-- ===================================================================
-- Hilfsfunktionen
-- ===================================================================

-- Setzt aktualisiert_am bei jeder Änderung
create or replace function public.setze_aktualisiert_am()
returns trigger language plpgsql as $$
begin
  new.aktualisiert_am := now();
  return new;
end $$;

-- ===================================================================
-- Profile (ein Konto kann Mieter und Vermieter zugleich sein)
-- ===================================================================
create table public.profile (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  anzeigename text check (char_length(anzeigename) <= 60),
  telefon text check (char_length(telefon) <= 30),
  ist_admin boolean not null default false,
  erstellt_am timestamptz not null default now(),
  aktualisiert_am timestamptz not null default now()
);
create trigger profile_aktualisiert before update on public.profile
  for each row execute function public.setze_aktualisiert_am();

-- Admin-Prüfung für RLS. security definer, damit sie die Tabelle profile ohne RLS lesen kann.
create or replace function public.ist_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select ist_admin from public.profile where id = auth.uid()), false);
$$;

-- Profil automatisch anlegen, sobald sich jemand zum ersten Mal anmeldet
create or replace function public.neues_profil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profile (id, email) values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger auth_neues_profil after insert on auth.users
  for each row execute function public.neues_profil();

-- ist_admin darf nur ein Admin ändern (sonst könnte sich jeder selbst zum Admin machen)
create or replace function public.schuetze_admin_feld()
returns trigger language plpgsql as $$
begin
  if new.ist_admin is distinct from old.ist_admin and not public.ist_admin()
     and current_user not in ('postgres', 'service_role', 'supabase_admin') then
    raise exception 'ist_admin darf nur von einem Admin geändert werden';
  end if;
  return new;
end $$;
create trigger profile_admin_schutz before update on public.profile
  for each row execute function public.schuetze_admin_feld();

alter table public.profile enable row level security;
create policy "eigenes Profil lesen" on public.profile for select using (id = auth.uid() or public.ist_admin());
create policy "eigenes Profil ändern" on public.profile for update using (id = auth.uid() or public.ist_admin());

-- ===================================================================
-- Einstellungen (Gebühren usw.), im Admin-Bereich änderbar
-- ===================================================================
create table public.einstellungen (
  schluessel text primary key,
  wert jsonb not null,
  beschreibung text,
  aktualisiert_am timestamptz not null default now()
);
create trigger einstellungen_aktualisiert before update on public.einstellungen
  for each row execute function public.setze_aktualisiert_am();

insert into public.einstellungen (schluessel, wert, beschreibung) values
  ('servicegebuehr', '{"satz": 0.10}', 'Servicegebühr vom Mieter, laufend, im Gesamtpreis enthalten (0.10 = 10 %)'),
  ('vermieter_provision', '{"art": "prozent", "wert": 0.5}', 'Einmalige Provision vom Vermieter, Abzug von der ersten Auszahlung. art: prozent (Anteil der ersten Miete) oder betrag (Euro)'),
  ('provision_anzeigen', 'false', 'Provision im Inserat-Formular zeigen (erst mit aktiver Zahlungsabwicklung)'),
  ('zahlung_aktiv', 'false', 'Zahlungsabwicklung über Zahlungsdienstleister aktiv (nicht Teil des MVP)');

alter table public.einstellungen enable row level security;
create policy "Einstellungen lesen" on public.einstellungen for select using (true);
create policy "Einstellungen ändern (Admin)" on public.einstellungen for update using (public.ist_admin());

create or replace function public.servicegebuehr_satz()
returns numeric language sql stable set search_path = public as $$
  select coalesce((select (wert ->> 'satz')::numeric from public.einstellungen where schluessel = 'servicegebuehr'), 0.10);
$$;

-- Gesamtpreis für Mieter: Wunschbetrag + Servicegebühr, auf volle Euro aufgerundet
create or replace function public.gesamtpreis(vermieterpreis numeric)
returns integer language sql stable set search_path = public as $$
  select ceil(round(vermieterpreis * (1 + public.servicegebuehr_satz()), 2))::integer;
$$;

-- ===================================================================
-- Orte (für Suche, Umkreis und SEO-Seiten)
-- ===================================================================
create table public.orte (
  id serial primary key,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  kreis text not null,
  lat double precision not null,
  lng double precision not null,
  aktiv boolean not null default true
);
alter table public.orte enable row level security;
create policy "Orte lesen" on public.orte for select using (true);
create policy "Orte pflegen (Admin)" on public.orte for all using (public.ist_admin()) with check (public.ist_admin());

-- Ungefähre Mittelpunkte (WGS84). Bei Bedarf im Admin bzw. per SQL ergänzen.
insert into public.orte (slug, name, kreis, lat, lng) values
  ('boeblingen', 'Böblingen', 'Landkreis Böblingen', 48.6833, 9.0167),
  ('sindelfingen', 'Sindelfingen', 'Landkreis Böblingen', 48.7133, 9.0028),
  ('herrenberg', 'Herrenberg', 'Landkreis Böblingen', 48.5967, 8.8708),
  ('leonberg', 'Leonberg', 'Landkreis Böblingen', 48.8000, 9.0167),
  ('holzgerlingen', 'Holzgerlingen', 'Landkreis Böblingen', 48.6392, 9.0108),
  ('renningen', 'Renningen', 'Landkreis Böblingen', 48.7656, 8.9339),
  ('weil-der-stadt', 'Weil der Stadt', 'Landkreis Böblingen', 48.7508, 8.8708),
  ('gaertringen', 'Gärtringen', 'Landkreis Böblingen', 48.6417, 8.9000),
  ('ehningen', 'Ehningen', 'Landkreis Böblingen', 48.6586, 8.9411),
  ('schoenaich', 'Schönaich', 'Landkreis Böblingen', 48.6597, 9.0631),
  ('weil-im-schoenbuch', 'Weil im Schönbuch', 'Landkreis Böblingen', 48.6214, 9.0636),
  ('magstadt', 'Magstadt', 'Landkreis Böblingen', 48.7428, 8.9650),
  ('aidlingen', 'Aidlingen', 'Landkreis Böblingen', 48.6786, 8.8975),
  ('grafenau', 'Grafenau', 'Landkreis Böblingen', 48.7147, 8.9047),
  ('rutesheim', 'Rutesheim', 'Landkreis Böblingen', 48.8086, 8.9450),
  ('weissach', 'Weissach', 'Landkreis Böblingen', 48.8469, 8.9281),
  ('waldenbuch', 'Waldenbuch', 'Landkreis Böblingen', 48.6383, 9.1311),
  ('steinenbronn', 'Steinenbronn', 'Landkreis Böblingen', 48.6667, 9.1167),
  ('stuttgart', 'Stuttgart', 'Stuttgart', 48.7758, 9.1829),
  ('leinfelden-echterdingen', 'Leinfelden-Echterdingen', 'Landkreis Esslingen', 48.6928, 9.1428),
  ('filderstadt', 'Filderstadt', 'Landkreis Esslingen', 48.6667, 9.2167),
  ('ostfildern', 'Ostfildern', 'Landkreis Esslingen', 48.7228, 9.2631),
  ('esslingen', 'Esslingen am Neckar', 'Landkreis Esslingen', 48.7406, 9.3108),
  ('ludwigsburg', 'Ludwigsburg', 'Landkreis Ludwigsburg', 48.8975, 9.1919),
  ('ditzingen', 'Ditzingen', 'Landkreis Ludwigsburg', 48.8264, 9.0667),
  ('gerlingen', 'Gerlingen', 'Landkreis Ludwigsburg', 48.7997, 9.0631),
  ('korntal-muenchingen', 'Korntal-Münchingen', 'Landkreis Ludwigsburg', 48.8306, 9.1214),
  ('waiblingen', 'Waiblingen', 'Rems-Murr-Kreis', 48.8306, 9.3169);

-- Entfernung in km (Haversine). Für eine Region reicht das völlig, PostGIS ist nicht nötig.
create or replace function public.entfernung_km(lat1 double precision, lng1 double precision, lat2 double precision, lng2 double precision)
returns double precision language sql immutable as $$
  select 6371 * 2 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2) +
    cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lng2 - lng1) / 2), 2)
  ));
$$;

-- ===================================================================
-- Inserate
-- ===================================================================
create table public.inserate (
  id uuid primary key default gen_random_uuid(),
  vermieter_id uuid not null references public.profile (id) on delete cascade,
  status text not null default 'entwurf'
    check (status in ('entwurf', 'pruefung', 'aktiv', 'pausiert', 'gesperrt', 'vermietet')),

  -- Art: womo = Wohnmobil/Wohnwagen, lager = Lagerraum
  typ text not null check (typ in ('womo', 'lager')),
  flaechen_art text check (flaechen_art in ('halle-scheune', 'stellplatz-ueberdacht', 'stellplatz-frei', 'garage', 'lagerraum')),
  titel text check (char_length(titel) between 5 and 80),
  beschreibung text check (char_length(beschreibung) <= 3000),

  -- Lage: öffentlich nur Ort, Ortsteil und verschobene Koordinaten. Adresse steht in inserat_adressen.
  ort_id integer references public.orte (id),
  ortsteil text check (char_length(ortsteil) <= 60),
  lat double precision,
  lng double precision,
  zufahrt text check (char_length(zufahrt) <= 1000),

  -- Preis: Wunschbetrag des Vermieters. Der Gesamtpreis wird immer berechnet (public.gesamtpreis).
  mietart text check (mietart in ('monatlich', 'saisonal')),
  saison_von date,
  saison_bis date,
  vermieterpreis numeric(8, 2) check (vermieterpreis > 0 and vermieterpreis < 100000),
  verfuegbar_ab date,
  mindestmietdauer_monate smallint check (mindestmietdauer_monate between 1 and 60),
  anzahl_plaetze smallint not null default 1 check (anzahl_plaetze between 1 and 50),

  -- Wohnmobil/Wohnwagen
  abstellart text check (abstellart in ('halle', 'ueberdacht', 'frei')),
  einfahrtshoehe_cm smallint check (einfahrtshoehe_cm between 100 and 800),
  einfahrtsbreite_cm smallint check (einfahrtsbreite_cm between 100 and 1500),
  max_laenge_cm smallint check (max_laenge_cm between 200 and 2500),
  strom boolean,
  zugang text check (zugang in ('24-7', 'absprache')),

  -- Lagerraum
  flaeche_qm numeric(6, 1) check (flaeche_qm > 0 and flaeche_qm < 10000),
  volumen_m3 numeric(7, 1) check (volumen_m3 > 0 and volumen_m3 < 100000),
  raumhoehe_cm smallint check (raumhoehe_cm between 50 and 1500),

  -- weitere Merkmale, z. B. abschliessbar, befestigt, trocken, ebenerdig
  ausstattung text[] not null default '{}',

  -- Verwaltung
  sperrgrund text, -- Begründung an den Vermieter bei Sperrung (Art. 17 DSA)
  eingereicht_am timestamptz,
  freigegeben_am timestamptz,
  erstellt_am timestamptz not null default now(),
  aktualisiert_am timestamptz not null default now(),

  constraint saison_vollstaendig check (
    mietart is distinct from 'saisonal' or (saison_von is not null and saison_bis is not null and saison_bis > saison_von)
  ),
  -- Ab der Einreichung müssen die Pflichtangaben vollständig sein
  constraint pflichtangaben check (
    status = 'entwurf' or (
      titel is not null and ort_id is not null and mietart is not null and vermieterpreis is not null
      and flaechen_art is not null
      and (typ <> 'womo' or (abstellart is not null and einfahrtshoehe_cm is not null and max_laenge_cm is not null and zugang is not null and strom is not null))
      and (typ <> 'lager' or flaeche_qm is not null)
    )
  )
);
create index inserate_status_typ on public.inserate (status, typ);
create index inserate_vermieter on public.inserate (vermieter_id);
create index inserate_ort on public.inserate (ort_id);
create trigger inserate_aktualisiert before update on public.inserate
  for each row execute function public.setze_aktualisiert_am();

-- Regeln für Statuswechsel: Freigeben und Sperren nur durch Admins.
-- Ändert ein Vermieter Inhalte eines freigegebenen Inserats, geht es erneut in die Prüfung.
create or replace function public.pruefe_inserat_aenderung()
returns trigger language plpgsql as $$
declare
  admin boolean := public.ist_admin() or current_user in ('postgres', 'service_role', 'supabase_admin');
  inhalt_geaendert boolean;
begin
  if tg_op = 'INSERT' then
    if not admin then
      new.status := 'entwurf';
      new.sperrgrund := null;
      new.freigegeben_am := null;
      new.lat := null; -- öffentliche Lage setzt nur die Datenbank (setze_oeffentliche_lage)
      new.lng := null;
    end if;
    return new;
  end if;

  if admin then
    if new.status = 'aktiv' and old.status <> 'aktiv' and new.freigegeben_am is null then
      new.freigegeben_am := now();
    end if;
    return new;
  end if;

  -- ab hier: Vermieter
  if new.vermieter_id <> old.vermieter_id then
    raise exception 'Vermieter kann nicht geändert werden';
  end if;
  if old.status = 'gesperrt' then
    raise exception 'Gesperrte Inserate können nicht geändert werden';
  end if;
  new.sperrgrund := old.sperrgrund;
  new.freigegeben_am := old.freigegeben_am;
  new.lat := old.lat;
  new.lng := old.lng;

  inhalt_geaendert := (to_jsonb(new) - array['status', 'aktualisiert_am', 'eingereicht_am', 'freigegeben_am', 'lat', 'lng'])
                   <> (to_jsonb(old) - array['status', 'aktualisiert_am', 'eingereicht_am', 'freigegeben_am', 'lat', 'lng']);

  if new.status <> old.status then
    if not (
      (old.status = 'entwurf' and new.status = 'pruefung') or
      (old.status = 'pruefung' and new.status = 'entwurf') or
      (old.status = 'aktiv' and new.status in ('pausiert', 'vermietet')) or
      (old.status in ('pausiert', 'vermietet') and new.status in ('aktiv', 'pausiert', 'vermietet'))
    ) then
      raise exception 'Statuswechsel von % nach % nicht erlaubt', old.status, new.status;
    end if;
  end if;

  if new.status = 'pruefung' and old.status <> 'pruefung' then
    if not exists (select 1 from public.inserat_fotos where inserat_id = new.id) then
      raise exception 'Bitte mindestens ein Foto hochladen';
    end if;
    new.eingereicht_am := now();
  end if;

  -- Inhalt eines bereits freigegebenen Inserats geändert → erneut prüfen
  if inhalt_geaendert and old.status in ('aktiv', 'pausiert', 'vermietet') then
    new.status := 'pruefung';
    new.eingereicht_am := now();
  end if;
  return new;
end $$;
create trigger inserate_regeln before insert or update on public.inserate
  for each row execute function public.pruefe_inserat_aenderung();

alter table public.inserate enable row level security;
create policy "aktive Inserate sind öffentlich" on public.inserate for select
  using (status = 'aktiv' or vermieter_id = auth.uid() or public.ist_admin());
create policy "eigene Inserate anlegen" on public.inserate for insert
  with check (vermieter_id = auth.uid());
create policy "eigene Inserate ändern" on public.inserate for update
  using (vermieter_id = auth.uid() or public.ist_admin())
  with check (vermieter_id = auth.uid() or public.ist_admin());
create policy "eigene Entwürfe löschen" on public.inserate for delete
  using ((vermieter_id = auth.uid() and status in ('entwurf', 'pruefung', 'pausiert')) or public.ist_admin());

-- ===================================================================
-- Adressen (privat): nur Vermieter und Admin. Mieter erst nach bestätigtem
-- Besichtigungstermin (Policy folgt mit den Anfragen in Etappe b).
-- ===================================================================
create table public.inserat_adressen (
  inserat_id uuid primary key references public.inserate (id) on delete cascade,
  strasse text check (char_length(strasse) <= 100),
  hausnummer text check (char_length(hausnummer) <= 10),
  plz text check (plz ~ '^[0-9]{5}$'),
  lat double precision check (lat between 47 and 56),
  lng double precision check (lng between 5 and 16),
  aktualisiert_am timestamptz not null default now()
);
create trigger adressen_aktualisiert before update on public.inserat_adressen
  for each row execute function public.setze_aktualisiert_am();

create or replace function public.ist_eigenes_inserat(p_inserat uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.inserate where id = p_inserat and vermieter_id = auth.uid());
$$;

alter table public.inserat_adressen enable row level security;
create policy "Adresse lesen (Vermieter, Admin)" on public.inserat_adressen for select
  using (public.ist_eigenes_inserat(inserat_id) or public.ist_admin());
create policy "Adresse anlegen (Vermieter)" on public.inserat_adressen for insert
  with check (public.ist_eigenes_inserat(inserat_id));
create policy "Adresse ändern (Vermieter, Admin)" on public.inserat_adressen for update
  using (public.ist_eigenes_inserat(inserat_id) or public.ist_admin());

-- Öffentliche Koordinaten: exakter Punkt (oder Ortsmitte) um 250–500 m verschoben.
-- Die Verschiebung hängt fest an der Inserat-ID, damit man den Punkt nicht durch
-- mehrfaches Speichern „herausmitteln“ kann.
create or replace function public.setze_oeffentliche_lage(p_inserat uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  basis_lat double precision;
  basis_lng double precision;
  h bytea := decode(md5(p_inserat::text), 'hex');
  winkel double precision := (get_byte(h, 0) * 256 + get_byte(h, 1)) / 65536.0 * 2 * pi();
  abstand_m double precision := 250 + (get_byte(h, 2) / 255.0) * 250;
begin
  select a.lat, a.lng into basis_lat, basis_lng from public.inserat_adressen a where a.inserat_id = p_inserat;
  if basis_lat is null then
    select o.lat, o.lng into basis_lat, basis_lng
      from public.inserate i join public.orte o on o.id = i.ort_id where i.id = p_inserat;
  end if;
  if basis_lat is null then
    return;
  end if;
  update public.inserate set
    lat = round((basis_lat + (abstand_m * cos(winkel)) / 111320.0)::numeric, 5),
    lng = round((basis_lng + (abstand_m * sin(winkel)) / (111320.0 * cos(radians(basis_lat))))::numeric, 5)
  where id = p_inserat;
end $$;

create or replace function public.adresse_geaendert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.setze_oeffentliche_lage(new.inserat_id);
  return new;
end $$;
create trigger adresse_lage after insert or update of lat, lng on public.inserat_adressen
  for each row execute function public.adresse_geaendert();

create or replace function public.ort_geaendert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.ort_id is distinct from old.ort_id then
    perform public.setze_oeffentliche_lage(new.id);
  end if;
  return null;
end $$;
create trigger inserat_ort_lage after insert or update of ort_id on public.inserate
  for each row execute function public.ort_geaendert();

-- ===================================================================
-- Fotos (Dateien im Storage-Bucket „inserat-fotos“, Pfad: <inserat_id>/<datei>)
-- ===================================================================
create table public.inserat_fotos (
  id uuid primary key default gen_random_uuid(),
  inserat_id uuid not null references public.inserate (id) on delete cascade,
  pfad text not null unique,
  reihenfolge smallint not null default 0,
  breite smallint,
  hoehe smallint,
  erstellt_am timestamptz not null default now()
);
create index fotos_inserat on public.inserat_fotos (inserat_id, reihenfolge);

alter table public.inserat_fotos enable row level security;
create policy "Fotos lesen" on public.inserat_fotos for select
  using (exists (select 1 from public.inserate i where i.id = inserat_id
                 and (i.status = 'aktiv' or i.vermieter_id = auth.uid() or public.ist_admin())));
create policy "Fotos anlegen" on public.inserat_fotos for insert
  with check (public.ist_eigenes_inserat(inserat_id) and pfad like inserat_id::text || '/%');
create policy "Fotos ändern" on public.inserat_fotos for update
  using (public.ist_eigenes_inserat(inserat_id) or public.ist_admin());
create policy "Fotos löschen" on public.inserat_fotos for delete
  using (public.ist_eigenes_inserat(inserat_id) or public.ist_admin());

-- Höchstens 12 Fotos pro Inserat
create or replace function public.foto_limit()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.inserat_fotos where inserat_id = new.inserat_id) >= 12 then
    raise exception 'Höchstens 12 Fotos pro Inserat';
  end if;
  return new;
end $$;
create trigger fotos_limit before insert on public.inserat_fotos
  for each row execute function public.foto_limit();

-- Storage-Bucket: öffentlich lesbar (zufällige Pfade), Hochladen nur in eigene Inserat-Ordner
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('inserat-fotos', 'inserat-fotos', true, 5242880, array['image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "Fotos hochladen (eigene Inserate)" on storage.objects for insert to authenticated
  with check (bucket_id = 'inserat-fotos'
              and public.ist_eigenes_inserat(((storage.foldername(name))[1])::uuid));
create policy "Fotos löschen (eigene Inserate)" on storage.objects for delete to authenticated
  using (bucket_id = 'inserat-fotos'
         and (public.ist_eigenes_inserat(((storage.foldername(name))[1])::uuid) or public.ist_admin()));

-- ===================================================================
-- Ansicht für Suche und Detailseite: nur öffentliche Spalten + Gesamtpreis
-- security_invoker: es gelten die RLS-Regeln von inserate (öffentlich nur „aktiv“)
-- ===================================================================
create view public.inserate_oeffentlich with (security_invoker = true) as
select
  i.id, i.status, i.typ, i.flaechen_art, i.titel, i.beschreibung,
  i.ort_id, o.slug as ort_slug, o.name as ort_name, o.kreis, i.ortsteil, i.lat, i.lng, i.zufahrt,
  i.mietart, i.saison_von, i.saison_bis, public.gesamtpreis(i.vermieterpreis) as gesamtpreis,
  i.verfuegbar_ab, i.mindestmietdauer_monate, i.anzahl_plaetze,
  i.abstellart, i.einfahrtshoehe_cm, i.einfahrtsbreite_cm, i.max_laenge_cm, i.strom, i.zugang,
  i.flaeche_qm, i.volumen_m3, i.raumhoehe_cm, i.ausstattung,
  i.freigegeben_am, i.aktualisiert_am,
  (select f.pfad from public.inserat_fotos f where f.inserat_id = i.id order by f.reihenfolge, f.erstellt_am limit 1) as titelfoto
from public.inserate i
left join public.orte o on o.id = i.ort_id;

-- Umkreissuche: aktive Inserate im Radius um einen Ort, mit Filtern. Alles optional.
create or replace function public.suche_inserate(
  p_ort_slug text default null,
  p_radius_km integer default 15,
  p_typ text default null,
  p_min_hoehe_cm integer default null,
  p_min_laenge_cm integer default null,
  p_abstellart text[] default null,
  p_strom boolean default null,
  p_zugang text default null,
  p_min_flaeche_qm numeric default null,
  p_min_volumen_m3 numeric default null,
  p_mietart text default null,
  p_max_preis integer default null,
  p_limit integer default 50,
  p_offset integer default 0
)
returns table (inserat public.inserate_oeffentlich, entfernung_km double precision)
language sql stable security invoker set search_path = public as $$
  with mitte as (select lat, lng from public.orte where slug = p_ort_slug)
  select v, case when m.lat is null then null else round(public.entfernung_km(m.lat, m.lng, v.lat, v.lng)::numeric, 1)::double precision end
  from public.inserate_oeffentlich v
  left join mitte m on true
  where v.status = 'aktiv'
    and (p_typ is null or v.typ = p_typ)
    and (m.lat is null or public.entfernung_km(m.lat, m.lng, v.lat, v.lng) <= least(greatest(p_radius_km, 1), 100))
    and (p_min_hoehe_cm is null or v.einfahrtshoehe_cm >= p_min_hoehe_cm)
    and (p_min_laenge_cm is null or v.max_laenge_cm >= p_min_laenge_cm)
    and (p_abstellart is null or v.abstellart = any (p_abstellart))
    and (p_strom is null or p_strom = false or v.strom = true)
    and (p_zugang is null or v.zugang = p_zugang)
    and (p_min_flaeche_qm is null or v.flaeche_qm >= p_min_flaeche_qm)
    and (p_min_volumen_m3 is null or v.volumen_m3 >= p_min_volumen_m3)
    and (p_mietart is null or v.mietart = p_mietart)
    and (p_max_preis is null or v.gesamtpreis <= p_max_preis)
  order by 2 nulls last, v.freigegeben_am desc
  limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0);
$$;

-- Rechte für die Rollen der Website (anon = nicht angemeldet, authenticated = angemeldet)
grant select on public.inserate_oeffentlich to anon, authenticated;
grant execute on function public.suche_inserate to anon, authenticated;
grant execute on function public.gesamtpreis to anon, authenticated;
