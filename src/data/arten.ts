import type { SeitenSchluessel } from '../config/seiten';
import type { IconName } from '../lib/icons';

type Art = { wert: string; titel: string; kurz: string; icon: IconName; nutzen: string; seite: SeitenSchluessel; bild?: string };

// Was Mieter suchen (Werte passen zu ?art= im Suchauftrag)
export const mietArten: Art[] = [
  { wert: 'auto-motorrad', titel: 'Stellplatz für Auto oder Motorrad', kurz: 'Auto / Motorrad', icon: 'einfahrt', nutzen: 'Draußen oder überdacht, nah an Ihrer Wohnung.', seite: 'mietenAuto' },
  { wert: 'garage', titel: 'Garage', kurz: 'Garage', icon: 'garage', nutzen: 'Abschließbar und trocken, für Auto, Motorrad oder Oldtimer.', seite: 'mietenGarage' },
  { wert: 'wohnmobil-wohnwagen', titel: 'Stellplatz für Wohnmobil oder Wohnwagen', kurz: 'Wohnmobil / Wohnwagen', icon: 'wohnmobil', nutzen: 'Winterplatz oder ganzjährig, unter Dach oder im Freien.', seite: 'mietenWohnmobil' },
  { wert: 'anhaenger-boot', titel: 'Stellplatz für Anhänger oder Boot', kurz: 'Anhänger / Boot', icon: 'anhaenger', nutzen: 'Für Anhänger, Bootstrailer oder Pferdeanhänger.', seite: 'mietenAnhaenger' },
  { wert: 'lagerraum', titel: 'Lagerraum', kurz: 'Lagerraum', icon: 'lager', nutzen: 'Trockener Raum für Möbel, Reifen, Kisten oder Gartengeräte.', seite: 'mietenLager' },
];

// Was Vermieter anbieten (Werte passen zu ?art= in „Platz anbieten“)
export const flaechenArten: Art[] = [
  { wert: 'garage', titel: 'Garage', kurz: 'Garage', icon: 'garage', nutzen: 'Für Auto oder Motorrad oder als trockenes Lager.', seite: 'vermietenGarage', bild: 'garage' },
  { wert: 'stellplatz-frei', titel: 'Einfahrt oder Stellplatz', kurz: 'Einfahrt / Stellplatz', icon: 'einfahrt', nutzen: 'Freie Fläche für Auto, Anhänger oder Wohnwagen.', seite: 'vermietenEinfahrt', bild: 'stellplatz' },
  { wert: 'lagerraum', titel: 'Keller und Raum', kurz: 'Keller / Raum', icon: 'keller', nutzen: 'Trockener Raum für Kisten, Möbel oder Reifen.', seite: 'vermietenKeller', bild: 'lager' },
  { wert: 'halle-scheune', titel: 'Scheune und Hof', kurz: 'Scheune / Hof', icon: 'hof', nutzen: 'Platz für mehrere Autos, Anhänger oder Wohnmobile. Bringt oft den höchsten Ertrag, weil mehrere Plätze möglich sind.', seite: 'vermietenScheune', bild: 'hof' },
];
