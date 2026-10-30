import type { SeitenSchluessel } from '../config/seiten';
import type { IconName } from '../lib/icons';

type Art = { wert: string; titel: string; kurz: string; icon: IconName; nutzen: string; seite: SeitenSchluessel };

// Was Mieter suchen (Werte passen zu ?art= im Suchauftrag)
export const mietArten: Art[] = [
  { wert: 'garage-auto', titel: 'Garage und Auto-Stellplatz', kurz: 'Garage / Auto', icon: 'garage', nutzen: 'Für Auto, Motorrad oder Oldtimer, nah an Ihrer Wohnung.', seite: 'mietenGarage' },
  { wert: 'wohnmobil-wohnwagen', titel: 'Wohnmobil und Wohnwagen', kurz: 'Wohnmobil / Wohnwagen', icon: 'wohnmobil', nutzen: 'Winterplatz oder ganzjährig, unter Dach oder im Freien.', seite: 'mietenWohnmobil' },
  { wert: 'anhaenger-boot', titel: 'Anhänger und Boot', kurz: 'Anhänger / Boot', icon: 'anhaenger', nutzen: 'Stellplatz für Anhänger, Bootstrailer oder Pferdeanhänger.', seite: 'mietenAnhaenger' },
  { wert: 'lager', titel: 'Lagerraum', kurz: 'Lagerraum', icon: 'lager', nutzen: 'Trockener Raum für Möbel, Reifen, Kisten oder Gartengeräte.', seite: 'mietenLager' },
];

// Was Vermieter anbieten (Werte passen zu ?art= in „Platz anbieten“)
export const flaechenArten: Art[] = [
  { wert: 'garage', titel: 'Garage', kurz: 'Garage', icon: 'garage', nutzen: 'Für Auto oder Motorrad – oder als trockenes Lager.', seite: 'vermietenGarage' },
  { wert: 'einfahrt', titel: 'Einfahrt oder Stellplatz', kurz: 'Einfahrt / Stellplatz', icon: 'einfahrt', nutzen: 'Freie Fläche für Auto, Anhänger oder Wohnwagen.', seite: 'vermietenEinfahrt' },
  { wert: 'keller-raum', titel: 'Keller und Raum', kurz: 'Keller / Raum', icon: 'keller', nutzen: 'Trockener Raum für Kisten, Möbel oder Reifen.', seite: 'vermietenKeller' },
  { wert: 'scheune-hof', titel: 'Scheune und Hof', kurz: 'Scheune / Hof', icon: 'hof', nutzen: 'Platz für mehrere Autos, Anhänger oder Wohnmobile – laut unseren Richtwerten oft der höchste Ertrag.', seite: 'vermietenScheune' },
];

export const zeitraeume = [
  { wert: 'ab-sofort', titel: 'ab sofort' },
  { wert: 'ab-herbst', titel: 'ab Herbst' },
  { wert: 'ueber-winter', titel: 'über den Winter' },
  { wert: 'ganzjaehrig', titel: 'ganzjährig' },
];
