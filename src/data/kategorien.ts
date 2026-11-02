// Kategorieseiten für Mieter (/mieten/<kategorie>/). Nur praktische Hinweise, keine Kosten, keine Rechtsaussagen.
import type { SeitenSchluessel } from '../config/seiten';
import type { IconName } from '../lib/icons';
import { wohnmobilSatz } from './nachfrage';

export type Tipp = { titel: string; punkte: string[] };
export type Kategorie = {
  seite: SeitenSchluessel;
  art: string; // Wert für ?mieter_art= im Suchauftrag
  icon: IconName;
  bild?: string;
  kurz: string; // Kachel-Titel
  kachelText: string;
  titel: string; // <title>
  beschreibung: string;
  h1: [string, string, string]; // Text vor, markiert, nach
  einleitung: string;
  zahl?: string; // nur Wohnmobil
  plaetze: string[]; // Welche Plätze es gibt
  zufahrt: string[];
  masse: string[];
  zugang: string[];
  verwandt: SeitenSchluessel[];
};

export const kategorien: Kategorie[] = [
  {
    seite: 'mietenWohnmobil', art: 'wohnmobil-wohnwagen', icon: 'wohnmobil', bild: 'wohnmobil',
    kurz: 'Wohnmobil / Wohnwagen', kachelText: 'Winterplatz oder ganzjährig, unter Dach oder im Freien.',
    titel: 'Stellplatz für Wohnmobil und Wohnwagen mieten in Baden-Württemberg',
    beschreibung: 'Stellplatz oder Winterplatz für Wohnmobil und Wohnwagen bei Privatleuten in Baden-Württemberg: Halle, Scheune, überdacht oder im Freien. Worauf Sie bei Zufahrt, Maßen und Zugang achten sollten.',
    h1: ['Ein Platz für Ihr ', 'Wohnmobil', ', den ganzen Winter oder das ganze Jahr'],
    einleitung: 'In Scheunen, Hallen, auf Höfen und großen Grundstücken bei Privatleuten in Ihrer Nähe. Sie sagen uns Maße und Zeitraum, wir schlagen passende Plätze vor.',
    zahl: wohnmobilSatz,
    plaetze: ['Halle oder Scheune: bester Schutz vor Nässe, Schnee und Sonne', 'Überdachter Stellplatz: gut belüftet, Schutz von oben', 'Stellplatz im Freien: flexibel, für robuste Fahrzeuge und kürzere Zeiträume'],
    zufahrt: ['Ist genug Platz zum Rangieren, auch rückwärts mit Gespann?', 'Ist der Untergrund befestigt? Auf Wiese sinkt ein schweres Fahrzeug im Winter ein.', 'Gibt es Steigungen, enge Kurven oder Schotter, die bei Nässe oder Schnee schwierig werden?'],
    masse: ['Länge mit Deichsel, Fahrradträger und Heckaufbauten messen', 'Höhe mit Klimaanlage, Dachbox oder SAT-Antenne messen und mit Tor- oder Durchfahrtshöhe vergleichen', 'Breite mit ausgeklappten Spiegeln bedenken'],
    zugang: ['Kommen Sie jederzeit an Ihr Fahrzeug oder nur nach Absprache?', 'Gibt es Strom für die Erhaltungsladung der Batterie?', 'Klären Sie mit dem Vermieter, ob Gasflaschen im Fahrzeug bleiben dürfen.'],
    verwandt: ['winterplatzVergleich', 'einwinterung', 'mietenAnhaenger'],
  },
  {
    seite: 'mietenAnhaenger', art: 'anhaenger-boot', icon: 'anhaenger', bild: 'anhaenger',
    kurz: 'Anhänger / Boot', kachelText: 'Für Anhänger, Bootstrailer oder Pferdeanhänger.',
    titel: 'Stellplatz für Anhänger und Boot mieten in Baden-Württemberg',
    beschreibung: 'Stellplatz für Anhänger, Bootstrailer oder Pferdeanhänger bei Privatleuten in Baden-Württemberg. Worauf Sie bei Zufahrt, Maßen und Zugang achten sollten.',
    h1: ['Ein fester Platz für Ihren ', 'Anhänger', ' oder Ihr Boot'],
    einleitung: 'Oft reicht ein Platz in einer Einfahrt, auf einem Hof oder in einer Scheune in Ihrer Nähe. Sie sagen uns Maße und Zeitraum, wir schlagen passende Plätze vor.',
    plaetze: ['Einfahrt oder Hoffläche: oft ideal für kleinere Anhänger', 'Scheune oder Halle: Schutz für Boot, Polster und Elektrik', 'Überdachter Platz: Schutz vor Laub, Regen und Sonne'],
    zufahrt: ['Lässt sich der Anhänger dort abstellen, wo Sie ihn mit dem Zugfahrzeug erreichen?', 'Müssen Sie ihn von Hand rangieren? Dann zählt ein fester, ebener Untergrund.', 'Ist die Einfahrt breit genug für Zugfahrzeug und Anhänger zusammen?'],
    masse: ['Gesamtlänge mit Deichsel messen, beim Bootstrailer mit Bug und Außenborder', 'Höhe bei Booten mit Aufbau, Persenning oder gelegtem Mast prüfen', 'Breite des Trailers und Platz zum Ankuppeln einplanen'],
    zugang: ['Wie oft brauchen Sie den Anhänger? In der Saison oft jede Woche.', 'Kommen Sie früh morgens oder am Wochenende an den Platz?', 'Deichselschloss oder Radkralle mitbringen und absprechen, wo der Anhänger genau steht'],
    verwandt: ['mietenWohnmobil', 'winterplatzVergleich', 'mieten'],
  },
  {
    seite: 'mietenAuto', art: 'auto-motorrad', icon: 'einfahrt', bild: 'stellplatz',
    kurz: 'Auto / Motorrad', kachelText: 'Stellplatz oder Garage, draußen oder überdacht, nah an Ihrer Wohnung.',
    titel: 'Stellplatz oder Garage für Auto und Motorrad mieten in Baden-Württemberg',
    beschreibung: 'Stellplatz oder Garage für Auto, Motorrad oder Oldtimer bei Privatleuten in Baden-Württemberg. Worauf Sie bei Zufahrt, Maßen und Zugang achten sollten.',
    h1: ['Stellplatz oder Garage für Ihr ', 'Auto', ' in der Nähe'],
    einleitung: 'Ein freier Platz in der Einfahrt, ein Carport oder eine Garage bei Nachbarn. Sie sagen uns, wo und ab wann, wir schlagen passende Plätze vor.',
    plaetze: ['Garage: abschließbar und trocken, auch für Motorrad oder Oldtimer', 'Carport oder überdachter Stellplatz: Schutz von oben, schnell erreichbar', 'Stellplatz in der Einfahrt oder im Hof: oft am nächsten an Ihrer Wohnung'],
    zufahrt: ['Wie eng ist die Einfahrt, und müssen Sie rangieren?', 'Steht dort morgens ein anderes Auto im Weg?', 'Wie weit ist der Fußweg zu Ihrer Wohnung, gerade abends?'],
    masse: ['Ältere Garagen sind oft schmal. Reicht der Platz, um die Türen zu öffnen und auszusteigen?', 'Torhöhe bei SUV, Transporter oder Dachbox prüfen', 'Länge bei Kombi, Van oder mit Anhängerkupplung bedenken'],
    zugang: ['Kommen Sie jederzeit hinein, auch früh morgens und spät abends?', 'Gibt es Schlüssel, Handsender oder ein Schloss?', 'Ist der Platz beleuchtet?'],
    verwandt: ['mietenLager', 'mieten', 'regionen'],
  },
  {
    seite: 'mietenLager', art: 'lagerraum', icon: 'lager', bild: 'lager',
    kurz: 'Lagerraum', kachelText: 'Trockener Raum für Möbel, Reifen, Kisten oder Gartengeräte.',
    titel: 'Lagerraum privat mieten in Baden-Württemberg',
    beschreibung: 'Lagerraum, Keller oder Garage als Lager bei Privatleuten in Baden-Württemberg mieten: für Möbel, Reifen, Kisten oder Gartengeräte. Worauf Sie bei Zufahrt, Maßen und Zugang achten sollten.',
    h1: ['Ein trockener ', 'Lagerraum', ' in Ihrer Nähe'],
    einleitung: 'Ein Kellerraum, eine Garage oder ein Teil einer Scheune bei Privatleuten in Ihrer Nähe. Sie sagen uns, wie viel Platz Sie brauchen, wir schlagen passende Räume vor.',
    plaetze: ['Kellerraum: trocken und geschützt, gut für Kisten und Möbel', 'Garage als Lager: ebenerdig, gut für Reifen und Sperriges', 'Scheune oder Halle: viel Platz, auf Feuchtigkeit und Staub achten'],
    zufahrt: ['Wie nah kommen Sie mit dem Auto oder Transporter heran?', 'Gibt es Treppen, Engstellen oder einen Aufzug auf dem Weg zum Raum?', 'Wo können Sie zum Be- und Entladen kurz halten?'],
    masse: ['Fläche in m² und Raumhöhe: Wie hoch können Sie stapeln?', 'Tür- und Torbreite für Schränke, Sofas oder Waschmaschinen messen', 'Lieber etwas Platz für einen Gang lassen, damit Sie an alles herankommen'],
    zugang: ['Zu welchen Zeiten kommen Sie an Ihre Sachen?', 'Ist der Raum trocken und belüftet? Kartons und Polster nehmen Feuchtigkeit auf.', 'Klären Sie mit dem Vermieter, was eingelagert werden darf, etwa bei Benzin oder Lebensmitteln.'],
    verwandt: ['mietenAuto', 'mieten', 'regionen'],
  },
];
