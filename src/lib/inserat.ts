// Alles rund um Inserate: Beschriftungen, Schritte des Assistenten, Prüfung der Eingaben.
// Die Werte (z. B. 'halle-scheune') sind die Werte in der Datenbank. Bitte nur Titel ändern.

export const typTitel = { womo: 'Wohnmobil / Wohnwagen', lager: 'Lagerraum' } as const;

export const flaechenArten = {
  womo: [
    { wert: 'halle-scheune', titel: 'Halle oder Scheune' },
    { wert: 'stellplatz-ueberdacht', titel: 'Überdachter Platz (z. B. Carport, Unterstand)' },
    { wert: 'stellplatz-frei', titel: 'Hof- oder Freifläche' },
  ],
  lager: [
    { wert: 'lagerraum', titel: 'Keller oder Raum' },
    { wert: 'garage', titel: 'Garage (als Lager)' },
    { wert: 'halle-scheune', titel: 'Halle oder Scheune' },
  ],
} as const;

export const abstellarten = [
  { wert: 'halle', titel: 'Halle (geschlossen)' },
  { wert: 'ueberdacht', titel: 'Überdacht' },
  { wert: 'frei', titel: 'Freifläche' },
] as const;

export const zugaenge = [
  { wert: '24-7', titel: 'Rund um die Uhr (24/7)' },
  { wert: 'absprache', titel: 'Nach Absprache' },
] as const;

export const mietarten = [
  { wert: 'monatlich', titel: 'Monatlich', hilfe: 'Laufende Miete pro Monat.' },
  { wert: 'saisonal', titel: 'Saisonal', hilfe: 'Fester Zeitraum (z. B. 1.10. bis 30.4.) mit einem Preis für die ganze Saison.' },
] as const;

export const ausstattungen = [
  { wert: 'abschliessbar', titel: 'Abschließbar / umzäunt' },
  { wert: 'befestigt', titel: 'Befestigter Untergrund' },
  { wert: 'trocken', titel: 'Trocken' },
  { wert: 'ebenerdig', titel: 'Ebenerdig erreichbar' },
  { wert: 'beleuchtet', titel: 'Beleuchtet' },
] as const;

export const statusTitel: Record<string, string> = {
  entwurf: 'Entwurf',
  pruefung: 'In Prüfung',
  aktiv: 'Online',
  pausiert: 'Pausiert',
  gesperrt: 'Gesperrt',
  vermietet: 'Vermietet',
};

export const titelVon = (liste: readonly { wert: string; titel: string }[], wert?: string | null) =>
  liste.find((e) => e.wert === wert)?.titel ?? '';

// ---------------------------------------------------------------- Schritte
export const schritte = [
  { slug: 'lage', titel: 'Lage' },
  { slug: 'details', titel: 'Maße und Ausstattung' },
  { slug: 'preis', titel: 'Preis und Mietart' },
  { slug: 'beschreibung', titel: 'Titel und Beschreibung' },
  { slug: 'fotos', titel: 'Fotos' },
  { slug: 'pruefen', titel: 'Prüfen und einreichen' },
] as const;
export type SchrittSlug = (typeof schritte)[number]['slug'];
export const naechsterSchritt = (s: SchrittSlug) => schritte[schritte.findIndex((x) => x.slug === s) + 1]?.slug;
export const vorherigerSchritt = (s: SchrittSlug) => schritte[schritte.findIndex((x) => x.slug === s) - 1]?.slug;

// ---------------------------------------------------------------- Eingaben lesen
type Fehler = Record<string, string>;

class Leser {
  fehler: Fehler = {};
  constructor(private form: FormData) {}
  text(name: string, { pflicht = false, max = 200, min = 0, titel = 'Dieses Feld' } = {}) {
    const v = String(this.form.get(name) ?? '').trim();
    if (!v) { if (pflicht) this.fehler[name] = `${titel} fehlt.`; return null; }
    if (v.length < min) this.fehler[name] = `${titel} ist zu kurz (mindestens ${min} Zeichen).`;
    if (v.length > max) this.fehler[name] = `${titel} ist zu lang (höchstens ${max} Zeichen).`;
    return v;
  }
  zahl(name: string, { pflicht = false, min = 0, max = 1e9, titel = 'Dieser Wert', ganz = true } = {}) {
    const roh = String(this.form.get(name) ?? '').trim().replace(',', '.');
    if (!roh) { if (pflicht) this.fehler[name] = `${titel} fehlt.`; return null; }
    const n = Number(roh);
    if (!Number.isFinite(n) || (ganz && !Number.isInteger(n))) { this.fehler[name] = `${titel}: bitte eine ${ganz ? 'ganze ' : ''}Zahl eingeben.`; return null; }
    if (n < min || n > max) { this.fehler[name] = `${titel}: bitte einen Wert zwischen ${min} und ${max} eingeben.`; return null; }
    return n;
  }
  wahl<T extends string>(name: string, erlaubt: readonly T[], { pflicht = false, titel = 'Bitte' } = {}): T | null {
    const v = String(this.form.get(name) ?? '');
    if (!v) { if (pflicht) this.fehler[name] = `${titel} auswählen.`; return null; }
    if (!erlaubt.includes(v as T)) { this.fehler[name] = 'Ungültige Auswahl.'; return null; }
    return v as T;
  }
  liste<T extends string>(name: string, erlaubt: readonly T[]) {
    return this.form.getAll(name).map(String).filter((v): v is T => erlaubt.includes(v as T));
  }
  datum(name: string, { pflicht = false, titel = 'Datum' } = {}) {
    const v = String(this.form.get(name) ?? '').trim();
    if (!v) { if (pflicht) this.fehler[name] = `${titel} fehlt.`; return null; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v))) { this.fehler[name] = `${titel} ist ungültig.`; return null; }
    return v;
  }
  jaNein(name: string, { pflicht = false, titel = 'Bitte' } = {}) {
    const v = String(this.form.get(name) ?? '');
    if (v === 'ja') return true;
    if (v === 'nein') return false;
    if (pflicht) this.fehler[name] = `${titel} auswählen.`;
    return null;
  }
}

export type Inserat = Record<string, any> & { id: string; typ: 'womo' | 'lager'; status: string };

/** Liest einen Schritt. Gibt die Änderungen für inserate (und ggf. inserat_adressen) zurück. */
export function leseSchritt(schritt: SchrittSlug, form: FormData, inserat: Inserat, ortIds: number[]) {
  const l = new Leser(form);
  const daten: Record<string, unknown> = {};
  let adresse: Record<string, unknown> | null = null;

  if (schritt === 'lage') {
    const ort = l.zahl('ort_id', { pflicht: true, titel: 'Ort' });
    if (ort !== null && !ortIds.includes(ort)) l.fehler.ort_id = 'Bitte einen Ort aus der Liste wählen.';
    daten.ort_id = ort;
    daten.ortsteil = l.text('ortsteil', { max: 60, titel: 'Ortsteil' });
    daten.zufahrt = l.text('zufahrt', { max: 1000, titel: 'Zufahrt' });
    const plz = l.text('plz', { pflicht: true, max: 5, titel: 'Postleitzahl' });
    if (plz && !/^\d{5}$/.test(plz)) l.fehler.plz = 'Die Postleitzahl hat 5 Ziffern.';
    const lat = l.zahl('lat', { min: 47, max: 56, ganz: false });
    const lng = l.zahl('lng', { min: 5, max: 16, ganz: false });
    adresse = {
      inserat_id: inserat.id,
      strasse: l.text('strasse', { pflicht: true, max: 100, titel: 'Straße' }),
      hausnummer: l.text('hausnummer', { pflicht: true, max: 10, titel: 'Hausnummer' }),
      plz,
      lat: lat !== null && lng !== null ? lat : null,
      lng: lat !== null && lng !== null ? lng : null,
    };
  }

  if (schritt === 'details') {
    const arten = flaechenArten[inserat.typ].map((a) => a.wert);
    daten.flaechen_art = l.wahl('flaechen_art', arten, { pflicht: true, titel: 'Art der Fläche' });
    daten.ausstattung = l.liste('ausstattung', ausstattungen.map((a) => a.wert));
    daten.zugang = l.wahl('zugang', zugaenge.map((z) => z.wert), { pflicht: inserat.typ === 'womo', titel: 'Zugang' });
    if (inserat.typ === 'womo') {
      // Abstellart (Filter in der Suche) ergibt sich aus der Art der Fläche
      daten.abstellart = { 'halle-scheune': 'halle', 'stellplatz-ueberdacht': 'ueberdacht', 'stellplatz-frei': 'frei' }[String(daten.flaechen_art)] ?? null;
      daten.einfahrtshoehe_cm = l.zahl('einfahrtshoehe_cm', { pflicht: true, min: 100, max: 800, titel: 'Einfahrtshöhe (cm)' });
      daten.einfahrtsbreite_cm = l.zahl('einfahrtsbreite_cm', { min: 100, max: 1500, titel: 'Einfahrtsbreite (cm)' });
      daten.max_laenge_cm = l.zahl('max_laenge_cm', { pflicht: true, min: 200, max: 2500, titel: 'Maximale Fahrzeuglänge (cm)' });
      daten.strom = l.jaNein('strom', { pflicht: true, titel: 'Strom: bitte' });
      daten.anzahl_plaetze = l.zahl('anzahl_plaetze', { min: 1, max: 50, titel: 'Anzahl Plätze' }) ?? 1;
    } else {
      daten.flaeche_qm = l.zahl('flaeche_qm', { pflicht: true, min: 1, max: 9999, titel: 'Fläche (m²)', ganz: false });
      daten.volumen_m3 = l.zahl('volumen_m3', { min: 1, max: 99999, titel: 'Volumen (m³)', ganz: false });
      daten.raumhoehe_cm = l.zahl('raumhoehe_cm', { min: 50, max: 1500, titel: 'Raumhöhe (cm)' });
    }
  }

  if (schritt === 'preis') {
    const mietart = l.wahl('mietart', ['monatlich', 'saisonal'] as const, { pflicht: true, titel: 'Mietart' });
    daten.mietart = mietart;
    daten.vermieterpreis = l.zahl('vermieterpreis', { pflicht: true, min: 1, max: 99999, titel: 'Ihr Wunschbetrag', ganz: false });
    if (typeof daten.vermieterpreis === 'number') daten.vermieterpreis = Math.round(daten.vermieterpreis * 100) / 100;
    daten.verfuegbar_ab = l.datum('verfuegbar_ab', { titel: 'Verfügbar ab' });
    if (mietart === 'saisonal') {
      daten.saison_von = l.datum('saison_von', { pflicht: true, titel: 'Saisonbeginn' });
      daten.saison_bis = l.datum('saison_bis', { pflicht: true, titel: 'Saisonende' });
      if (daten.saison_von && daten.saison_bis && String(daten.saison_bis) <= String(daten.saison_von)) l.fehler.saison_bis = 'Das Saisonende muss nach dem Beginn liegen.';
      daten.mindestmietdauer_monate = null;
    } else {
      daten.saison_von = null;
      daten.saison_bis = null;
      daten.mindestmietdauer_monate = l.zahl('mindestmietdauer_monate', { min: 1, max: 60, titel: 'Mindestmietdauer (Monate)' });
    }
  }

  if (schritt === 'beschreibung') {
    daten.titel = l.text('titel', { pflicht: true, min: 5, max: 80, titel: 'Titel' });
    daten.beschreibung = l.text('beschreibung', { max: 3000, titel: 'Beschreibung' });
  }

  return { daten, adresse, fehler: l.fehler };
}

/** Was fehlt noch zum Einreichen? (gleiche Regeln wie in der Datenbank) */
export function fehlendeAngaben(i: Inserat, adresse: Record<string, any> | null, fotoAnzahl: number): { schritt: SchrittSlug; text: string }[] {
  const f: { schritt: SchrittSlug; text: string }[] = [];
  if (!i.ort_id) f.push({ schritt: 'lage', text: 'Ort' });
  if (!adresse?.strasse || !adresse?.plz) f.push({ schritt: 'lage', text: 'Adresse' });
  if (!i.flaechen_art) f.push({ schritt: 'details', text: 'Art der Fläche' });
  if (i.typ === 'womo' && (!i.abstellart || !i.einfahrtshoehe_cm || !i.max_laenge_cm || !i.zugang || i.strom === null))
    f.push({ schritt: 'details', text: 'Maße, Abstellart, Strom und Zugang' });
  if (i.typ === 'lager' && !i.flaeche_qm) f.push({ schritt: 'details', text: 'Fläche' });
  if (!i.mietart || !i.vermieterpreis) f.push({ schritt: 'preis', text: 'Preis und Mietart' });
  if (!i.titel) f.push({ schritt: 'beschreibung', text: 'Titel' });
  if (fotoAnzahl < 1) f.push({ schritt: 'fotos', text: 'Mindestens ein Foto' });
  return f;
}

// ---------------------------------------------------------------- Anzeige
const datumKurz = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric', year: 'numeric' });
export const euro = (n: number) => `${n.toLocaleString('de-DE')} €`;

/** „77 € pro Monat“ bzw. „363 € pro Saison (1.10.2026–30.4.2027)“ */
export function preisZeile(i: { gesamtpreis: number; mietart: string; saison_von?: string | null; saison_bis?: string | null }) {
  if (i.mietart === 'saisonal') {
    const zeitraum = i.saison_von && i.saison_bis ? ` (${datumKurz(i.saison_von)}–${datumKurz(i.saison_bis)})` : '';
    return { betrag: euro(i.gesamtpreis), zusatz: `pro Saison${zeitraum}` };
  }
  return { betrag: euro(i.gesamtpreis), zusatz: 'pro Monat' };
}

export const meter = (cm?: number | null) => (cm ? `${(cm / 100).toLocaleString('de-DE', { maximumFractionDigits: 2 })} m` : '');
export const datumText = (d?: string | null) => (d ? datumKurz(d) : '');

/** Eckdaten als Liste [Titel, Wert] für Karten und Detailseite. */
export function eckdaten(i: Record<string, any>): [string, string][] {
  const z: [string, string][] = [];
  if (i.typ === 'womo') {
    if (i.abstellart) z.push(['Abstellart', titelVon(abstellarten, i.abstellart)]);
    if (i.einfahrtshoehe_cm) z.push(['Einfahrtshöhe', meter(i.einfahrtshoehe_cm)]);
    if (i.einfahrtsbreite_cm) z.push(['Einfahrtsbreite', meter(i.einfahrtsbreite_cm)]);
    if (i.max_laenge_cm) z.push(['Fahrzeuglänge bis', meter(i.max_laenge_cm)]);
    if (i.strom !== null && i.strom !== undefined) z.push(['Strom', i.strom ? 'Ja' : 'Nein']);
    if (i.anzahl_plaetze > 1) z.push(['Plätze', String(i.anzahl_plaetze)]);
  } else {
    if (i.flaeche_qm) z.push(['Fläche', `${Number(i.flaeche_qm).toLocaleString('de-DE')} m²`]);
    if (i.volumen_m3) z.push(['Volumen', `${Number(i.volumen_m3).toLocaleString('de-DE')} m³`]);
    if (i.raumhoehe_cm) z.push(['Raumhöhe', meter(i.raumhoehe_cm)]);
  }
  if (i.zugang) z.push(['Zugang', titelVon(zugaenge, i.zugang)]);
  return z;
}
