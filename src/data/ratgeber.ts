// Ratgeber-Artikel für die Übersicht /ratgeber/ und Teaser.
import type { SeitenSchluessel } from '../config/seiten';
import type { IconName } from '../lib/icons';

export const ratgeberArtikel: { seite: SeitenSchluessel; icon: IconName; art: string; text: string }[] = [
  { seite: 'diebstahlschutz', icon: 'schild', art: 'Ratgeber', text: 'Wohnwagen, Wohnmobil oder Anhänger sicher abstellen: Platzwahl, Schlösser, Tracker und was Sie vorher ausräumen sollten.' },
  { seite: 'einwinterung', icon: 'liste', art: 'Checkliste', text: 'Wohnmobil und Wohnwagen winterfest machen: Punkt für Punkt zum Abhaken und Ausdrucken.' },
  { seite: 'winterplatzVergleich', icon: 'hof', art: 'Vergleich', text: 'Halle, Garage, überdacht oder im Freien: Vor- und Nachteile und Richtpreise im Vergleich.' },
];
