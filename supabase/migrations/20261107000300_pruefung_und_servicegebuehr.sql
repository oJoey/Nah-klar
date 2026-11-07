-- nahklar – Änderungen nach Entscheidung vom 07.11.2026
-- 1) Erneute Prüfung nur bei Änderung von Fotos, Text (Titel, Beschreibung, Zufahrt), Typ und Adresse/Ort.
--    Preis, Mietart, Saison, „verfügbar ab“, Maße, Ausstattung und Pausieren gehen direkt durch.
-- 2) Schalter servicegebuehr_aktiv (Standard aus): solange aus, sehen Mieter den Vermieterpreis ohne Aufschlag.
-- Kann gefahrlos auch dann ausgeführt werden, wenn 0100 und 0200 schon gelaufen sind.

-- ---------------------------------------------------------------- 2) Servicegebühr-Schalter
insert into public.einstellungen (schluessel, wert, beschreibung) values
  ('servicegebuehr_aktiv', 'false', 'Servicegebühr erheben. Aus: Mieter sehen den Vermieterpreis ohne Aufschlag, keine Provision. Beim Umschalten auch src/config/zahlung.ts anpassen und neu veröffentlichen.')
on conflict (schluessel) do nothing;

create or replace function public.servicegebuehr_satz()
returns numeric language sql stable set search_path = public as $$
  select case
    when coalesce((select wert::text = 'true' from public.einstellungen where schluessel = 'servicegebuehr_aktiv'), false)
    then coalesce((select (wert ->> 'satz')::numeric from public.einstellungen where schluessel = 'servicegebuehr'), 0.10)
    else 0
  end;
$$;

-- ---------------------------------------------------------------- 1) Prüfregeln
create or replace function public.ist_admin_oder_system()
returns boolean language sql stable as $$
  select public.ist_admin() or current_user in ('postgres', 'service_role', 'supabase_admin');
$$;

-- Freigegebenes eigenes Inserat zurück in die Prüfung (aufgerufen von den Triggern unten)
create or replace function public.erneut_pruefen(p_inserat uuid)
returns void language sql security definer set search_path = public as $$
  update public.inserate set status = 'pruefung', eingereicht_am = now()
  where id = p_inserat and vermieter_id = auth.uid() and status in ('aktiv', 'pausiert', 'vermietet');
$$;
revoke execute on function public.erneut_pruefen(uuid) from public, anon;
grant execute on function public.erneut_pruefen(uuid) to authenticated;

create or replace function public.pruefe_inserat_aenderung()
returns trigger language plpgsql as $$
declare
  admin boolean := public.ist_admin_oder_system();
  -- nur diese Felder lösen eine erneute Prüfung aus
  pruefrelevant text[] := array['typ', 'titel', 'beschreibung', 'zufahrt', 'ort_id', 'ortsteil'];
  geaendert boolean := false;
  feld text;
begin
  if tg_op = 'INSERT' then
    if not admin then
      new.status := 'entwurf';
      new.sperrgrund := null;
      new.freigegeben_am := null;
      new.lat := null;
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
  new.sperrgrund := case when old.status = 'entwurf' then old.sperrgrund else null end;
  new.freigegeben_am := old.freigegeben_am;
  new.lat := old.lat;
  new.lng := old.lng;

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

  foreach feld in array pruefrelevant loop
    if (to_jsonb(new) -> feld) is distinct from (to_jsonb(old) -> feld) then
      geaendert := true;
    end if;
  end loop;

  if geaendert and old.status in ('aktiv', 'pausiert', 'vermietet') then
    new.status := 'pruefung';
    new.eingereicht_am := now();
  end if;
  return new;
end $$;

-- Fotos hinzugefügt oder gelöscht → erneut prüfen (Reihenfolge ändern nicht)
-- Trigger laufen mit den Rechten des Aufrufers, damit erkennbar ist, wer geändert hat
create or replace function public.fotos_geaendert()
returns trigger language plpgsql set search_path = public as $$
begin
  if not public.ist_admin_oder_system() then
    perform public.erneut_pruefen(coalesce(new.inserat_id, old.inserat_id));
  end if;
  return null;
end $$;
drop trigger if exists fotos_pruefung on public.inserat_fotos;
create trigger fotos_pruefung after insert or delete on public.inserat_fotos
  for each row execute function public.fotos_geaendert();

-- Adresse geändert → erneut prüfen
create or replace function public.adresse_pruefung()
returns trigger language plpgsql set search_path = public as $$
begin
  if not public.ist_admin_oder_system()
     and (tg_op = 'INSERT' or (new.strasse, new.hausnummer, new.plz, new.lat, new.lng)
                              is distinct from (old.strasse, old.hausnummer, old.plz, old.lat, old.lng)) then
    perform public.erneut_pruefen(new.inserat_id);
  end if;
  return null;
end $$;
drop trigger if exists adresse_pruefung on public.inserat_adressen;
create trigger adresse_pruefung after insert or update on public.inserat_adressen
  for each row execute function public.adresse_pruefung();
