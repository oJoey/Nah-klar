import type { SeitenSchluessel } from '../config/seiten';
import type { IconName } from '../lib/icons';

type Art = { wert: string; titel: string; kurz: string; icon: IconName; nutzen: string; seite: SeitenSchluessel; bild?: string };

// Was Mieter suchen (Werte passen zu ?art= im Suchauftrag)
export const mietArten: Art[] = [
  { wert: 'wohnmobil-wohnwagen', titel: 'Abstellplatz für Wohnmobil oder Wohnwagen', kurz: 'Wohnmobil / Wohnwagen', icon: 'wohnmobil', nutzen: 'Winterplatz oder ganzjährig, in der Halle, überdacht oder im Freien.', seite: 'mietenWohnmobil' },
  { wert: 'lagerraum', titel: 'Lagerraum', kurz: 'Lagerraum', icon: 'lager', nutzen: 'Keller, Garage oder Halle für Möbel, Reifen, Kisten oder Gartengeräte.', seite: 'mietenLager' },
];

// Was Vermieter anbieten (Werte passen zu ?art= in „Platz anbieten“)
export const flaechenArten: Art[] = [
  { wert: 'halle-scheune', titel: 'Halle und Scheune', kurz: 'Halle / Scheune', icon: 'hof', nutzen: 'Trockene Winterplätze für Wohnmobile und Wohnwagen. Bringt oft den höchsten Ertrag, weil mehrere Plätze möglich sind.', seite: 'vermietenScheune', bild: 'hof' },
  { wert: 'stellplatz-frei', titel: 'Hof- und Freifläche', kurz: 'Hof / Freifläche', icon: 'einfahrt', nutzen: 'Befestigte Fläche im Freien oder überdacht für Wohnmobil oder Wohnwagen.', seite: 'vermietenEinfahrt', bild: 'stellplatz' },
  { wert: 'garage', titel: 'Garage als Lager', kurz: 'Garage', icon: 'garage', nutzen: 'Abschließbar und ebenerdig, für Reifen, Möbel oder Kisten.', seite: 'vermietenGarage', bild: 'garage' },
  { wert: 'lagerraum', titel: 'Keller und Raum', kurz: 'Keller / Raum', icon: 'keller', nutzen: 'Trockener Raum für Kisten, Möbel oder Reifen.', seite: 'vermietenKeller', bild: 'lager' },
];
