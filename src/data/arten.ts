import type { SeitenSchluessel } from '../config/seiten';
import type { IconName } from '../lib/icons';

type Art = { wert: string; titel: string; kurz: string; icon: IconName; nutzen: string; seite: SeitenSchluessel; bild?: string };

// Was Mieter suchen (Werte passen zu ?art= im Suchauftrag)
export const mietArten: Art[] = [
  { wert: 'auto-motorrad', titel: 'Garage und Auto-Stellplatz', kurz: 'Garage / Auto', icon: 'garage', nutzen: 'Für Auto, Motorrad oder Oldtimer, nah an Ihrer Wohnung.', seite: 'mietenGarage', bild: 'garage-einfahrt' },
  { wert: 'wohnmobil-wohnwagen', titel: 'Wohnmobil und Wohnwagen', kurz: 'Wohnmobil / Wohnwagen', icon: 'wohnmobil', nutzen: 'Winterplatz oder ganzjährig, unter Dach oder im Freien.', seite: 'mietenWohnmobil', bild: 'wohnmobil' },
  { wert: 'lagergut', titel: 'Lagerraum', kurz: 'Lagerraum', icon: 'lager', nutzen: 'Trockener Raum für Möbel, Reifen, Kisten oder Gartengeräte.', seite: 'mietenLager', bild: 'lager' },
  { wert: 'anhaenger-boot', titel: 'Anhänger und Boot', kurz: 'Anhänger / Boot', icon: 'anhaenger', nutzen: 'Stellplatz für Anhänger, Bootstrailer oder Pferdeanhänger.', seite: 'mietenAnhaenger', bild: 'anhaenger' },
];

// Was Vermieter anbieten (Werte passen zu ?art= in „Platz anbieten“)
export const flaechenArten: Art[] = [
  { wert: 'garage', titel: 'Garage', kurz: 'Garage', icon: 'garage', nutzen: 'Für Auto oder Motorrad – oder als trockenes Lager.', seite: 'vermietenGarage', bild: 'garage' },
  { wert: 'stellplatz-frei', titel: 'Einfahrt oder Stellplatz', kurz: 'Einfahrt / Stellplatz', icon: 'einfahrt', nutzen: 'Freie Fläche für Auto, Anhänger oder Wohnwagen.', seite: 'vermietenEinfahrt', bild: 'stellplatz' },
  { wert: 'lagerraum', titel: 'Keller und Raum', kurz: 'Keller / Raum', icon: 'keller', nutzen: 'Trockener Raum für Kisten, Möbel oder Reifen.', seite: 'vermietenKeller', bild: 'lager' },
  { wert: 'halle-scheune', titel: 'Scheune und Hof', kurz: 'Scheune / Hof', icon: 'hof', nutzen: 'Platz für mehrere Autos, Anhänger oder Wohnmobile – bringt oft den höchsten Ertrag, weil mehrere Plätze möglich sind.', seite: 'vermietenScheune', bild: 'hof' },
];
