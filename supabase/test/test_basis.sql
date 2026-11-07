-- Lokaler Test der Regeln (RLS, Trigger, Suche). Bricht beim ersten Fehler ab.
\set ON_ERROR_STOP on
set client_min_messages = warning;

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'vermieter@test.de'),
  ('00000000-0000-0000-0000-00000000000b', 'mieter@test.de'),
  ('00000000-0000-0000-0000-00000000000c', 'admin@test.de');
update public.profile set ist_admin = true where email = 'admin@test.de';

-- Hilfsprozedur: als Nutzer handeln
create or replace function pg_temp.als(uid text) returns void language plpgsql as $$
begin
  if uid is null then
    perform set_config('request.jwt.claim.sub', '', false);
    execute 'set role anon';
  else
    perform set_config('request.jwt.claim.sub', uid, false);
    execute 'set role authenticated';
  end if;
end $$;

-- 1) Vermieter legt Entwurf an; Status/Lage lassen sich nicht vorgeben
select pg_temp.als('00000000-0000-0000-0000-00000000000a');
insert into public.inserate (id, vermieter_id, typ, status, lat, lng, titel, ort_id)
values ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-00000000000a', 'womo', 'aktiv', 1, 1,
        'Hallenplatz für Wohnmobil', (select id from public.orte where slug = 'sindelfingen'));
do $$ begin
  assert (select status from public.inserate where id = '11111111-1111-1111-1111-111111111111') = 'entwurf', 'Status muss entwurf sein';
  assert (select abs(lat - 48.7133) < 0.01 and lat <> 48.7133 from public.inserate where id = '11111111-1111-1111-1111-111111111111'), 'Lage muss ungefähr Ortsmitte sein';
end $$;

-- Adresse mit exaktem Punkt → öffentliche Lage 250–500 m daneben
insert into public.inserat_adressen (inserat_id, strasse, hausnummer, plz, lat, lng)
values ('11111111-1111-1111-1111-111111111111', 'Teststraße', '1', '71063', 48.7000, 9.0000);
do $$ declare d double precision; begin
  select public.entfernung_km(48.7, 9.0, lat, lng) into d from public.inserate where id = '11111111-1111-1111-1111-111111111111';
  assert d between 0.24 and 0.51, format('Verschiebung %s km', d);
end $$;

-- Einreichen ohne Pflichtangaben scheitert
do $$ begin
  begin
    update public.inserate set status = 'pruefung' where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'hätte scheitern müssen';
  exception when others then
    if sqlerrm = 'hätte scheitern müssen' then raise; end if;
  end;
end $$;

-- Pflichtangaben + Foto ergänzen, dann einreichen
update public.inserate set flaechen_art = 'halle-scheune', mietart = 'saisonal', saison_von = '2026-10-01', saison_bis = '2027-04-30',
  vermieterpreis = 330, abstellart = 'halle', einfahrtshoehe_cm = 350, max_laenge_cm = 750, zugang = 'absprache', strom = true
where id = '11111111-1111-1111-1111-111111111111';
insert into public.inserat_fotos (inserat_id, pfad) values ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111/a.jpg');
update public.inserate set status = 'pruefung' where id = '11111111-1111-1111-1111-111111111111';

-- Selbst freigeben ist verboten
do $$ begin
  begin
    update public.inserate set status = 'aktiv' where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'hätte scheitern müssen';
  exception when others then
    if sqlerrm = 'hätte scheitern müssen' then raise; end if;
  end;
end $$;

-- Selbst zum Admin machen ist verboten
do $$ begin
  begin
    update public.profile set ist_admin = true where id = auth.uid();
    raise exception 'hätte scheitern müssen';
  exception when others then
    if sqlerrm = 'hätte scheitern müssen' then raise; end if;
  end;
end $$;

-- 2) Gast sieht nichts (noch nicht freigegeben), auch keine Adresse
select pg_temp.als(null);
do $$ begin
  assert (select count(*) from public.inserate_oeffentlich) = 0, 'Gast darf Entwurf/Prüfung nicht sehen';
end $$;

-- 3) Admin gibt frei
select pg_temp.als('00000000-0000-0000-0000-00000000000c');
update public.inserate set status = 'aktiv' where id = '11111111-1111-1111-1111-111111111111';

-- 4) Servicegebühr aus (Standard): Mieter sehen 330 €. An: 330 € + 10 % = 363 €
select pg_temp.als(null);
do $$ begin
  assert (select gesamtpreis from public.inserate_oeffentlich where id = '11111111-1111-1111-1111-111111111111') = 330, 'ohne Servicegebühr';
end $$;
reset role;
update public.einstellungen set wert = 'true' where schluessel = 'servicegebuehr_aktiv';
select pg_temp.als(null);
do $$ begin
  assert (select gesamtpreis from public.inserate_oeffentlich where id = '11111111-1111-1111-1111-111111111111') = 363, 'Gesamtpreis';
  assert (select count(*) from public.inserat_adressen) = 0, 'Adresse darf nicht sichtbar sein';
  assert (select count(*) from public.suche_inserate(p_ort_slug => 'boeblingen', p_radius_km => 10, p_typ => 'womo')) = 1, 'Suche Umkreis';
  assert (select count(*) from public.suche_inserate(p_ort_slug => 'herrenberg', p_radius_km => 5)) = 0, 'zu weit weg';
  assert (select count(*) from public.suche_inserate(p_min_hoehe_cm => 360)) = 0, 'Filter Höhe';
  assert (select count(*) from public.suche_inserate(p_min_hoehe_cm => 340, p_strom => true, p_abstellart => array['halle'])) = 1, 'Filter kombiniert';
end $$;
-- Rundung: 93,50 → 94 (85 € + 10 % = 93,50 €)
do $$ begin assert public.gesamtpreis(85) = 94, 'Aufrunden'; assert public.gesamtpreis(70) = 77, 'glatt'; end $$;

-- 5) Mieter sieht keine fremde Adresse und kann nichts ändern
select pg_temp.als('00000000-0000-0000-0000-00000000000b');
do $$ begin
  assert (select count(*) from public.inserat_adressen) = 0, 'Mieter darf Adresse nicht sehen';
  update public.inserate set titel = 'gekapert' where id = '11111111-1111-1111-1111-111111111111';
  assert (select titel from public.inserate where id = '11111111-1111-1111-1111-111111111111') <> 'gekapert', 'fremdes Inserat geändert';
end $$;

-- 6a) Preis, verfügbar ab, Maße und Pausieren gehen ohne Prüfung durch
select pg_temp.als('00000000-0000-0000-0000-00000000000a');
update public.inserate set vermieterpreis = 350, verfuegbar_ab = '2026-12-01', einfahrtshoehe_cm = 360 where id = '11111111-1111-1111-1111-111111111111';
update public.inserate set status = 'pausiert' where id = '11111111-1111-1111-1111-111111111111';
update public.inserate set status = 'aktiv' where id = '11111111-1111-1111-1111-111111111111';
update public.inserat_fotos set reihenfolge = 3 where inserat_id = '11111111-1111-1111-1111-111111111111';
do $$ begin
  assert (select status from public.inserate where id = '11111111-1111-1111-1111-111111111111') = 'aktiv', 'Preis/Pause darf nicht in Prüfung';
end $$;

-- 6b) Neues Foto → Prüfung
insert into public.inserat_fotos (inserat_id, pfad) values ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111/b.jpg');
do $$ begin
  assert (select status from public.inserate where id = '11111111-1111-1111-1111-111111111111') = 'pruefung', 'Foto → Prüfung';
end $$;
select pg_temp.als('00000000-0000-0000-0000-00000000000c');
update public.inserate set status = 'aktiv' where id = '11111111-1111-1111-1111-111111111111';

-- 6c) Adresse geändert → Prüfung
select pg_temp.als('00000000-0000-0000-0000-00000000000a');
update public.inserat_adressen set hausnummer = '2' where inserat_id = '11111111-1111-1111-1111-111111111111';
do $$ begin
  assert (select status from public.inserate where id = '11111111-1111-1111-1111-111111111111') = 'pruefung', 'Adresse → Prüfung';
end $$;
select pg_temp.als('00000000-0000-0000-0000-00000000000c');
update public.inserate set status = 'aktiv' where id = '11111111-1111-1111-1111-111111111111';

-- 6d) Vermieter ändert Text eines aktiven Inserats → zurück in Prüfung
select pg_temp.als('00000000-0000-0000-0000-00000000000a');
update public.inserate set titel = 'Hallenplatz mit Strom' where id = '11111111-1111-1111-1111-111111111111';
do $$ begin
  assert (select status from public.inserate where id = '11111111-1111-1111-1111-111111111111') = 'pruefung', 'zurück in Prüfung';
end $$;

-- 7) Fotos nur in eigenen Ordner
do $$ begin
  begin
    insert into public.inserat_fotos (inserat_id, pfad) values ('11111111-1111-1111-1111-111111111111', 'anderer-ordner/x.jpg');
    raise exception 'hätte scheitern müssen';
  exception when others then
    if sqlerrm = 'hätte scheitern müssen' then raise; end if;
  end;
end $$;

reset role;
select 'ALLE TESTS OK' as ergebnis;
