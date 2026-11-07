// Kategorieseiten für Mieter (/mieten/<kategorie>/). Nur praktische Hinweise, keine Kosten, keine Rechtsaussagen.
import type { SeitenSchluessel } from '../config/seiten';
import type { IconName } from '../lib/icons';
import { wohnmobilSatz } from './nachfrage';

// Gemeinsame FAQ für alle Kategorien
const faqSuchauftrag = { frage: 'Was passiert, wenn gerade kein Platz frei ist?', antwort: 'Mit einem Suchauftrag müssen Sie nicht immer wieder nachsehen. Wir melden uns, sobald ein passender Platz in Ihrer Nähe frei wird. Der Suchauftrag ist kostenlos und unverbindlich.' };
const faqBesichtigung = { frage: 'Kann ich den Platz vorher ansehen?', antwort: 'Ja. Im Inserat sehen Sie Fotos und den Ortsteil. Wenn der Platz passt, vereinbaren wir einen Besichtigungstermin, dann erfahren Sie auch die genaue Adresse.' };

export type Tipp = { titel: string; punkte: string[] };
export type Kategorie = {
  seite: SeitenSchluessel;
  keyword: string; // Haupt-Keyword der Seite (steht in Title, H1 und Beschreibung)
  startseite?: boolean; // als Kachel und in der Suche auf der Startseite (Standard: ja)
  richtwerte: { arten?: string[]; klassen?: string[]; lager?: boolean };
  faq: { frage: string; antwort: string }[];
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
    seite: 'mietenWohnmobil', keyword: 'Wohnmobil Stellplatz mieten',
    richtwerte: { klassen: ['7', '9', 'ueber-9'], lager: false },
    faq: [
      { frage: 'Ab wann sollte ich einen Winterplatz suchen?', antwort: 'Viele suchen ab dem Spätsommer. Je früher Sie Ihren Suchauftrag anlegen, desto mehr Zeit bleibt für die Besichtigung, bevor die Saison endet.' },
      { frage: 'Welche Maße brauchen Sie von mir?', antwort: 'Länge mit Deichsel und Heckträger, Höhe mit Dachaufbauten wie Klimaanlage oder SAT-Antenne und die Breite. Damit schlagen wir nur Plätze vor, deren Zufahrt und Tor passen.' },
      faqBesichtigung, faqSuchauftrag,
    ],
    art: 'wohnmobil-wohnwagen', icon: 'wohnmobil', bild: 'wohnmobil',
    kurz: 'Wohnmobil / Wohnwagen', kachelText: 'Winterplatz oder ganzjährig, unter Dach oder im Freien.',
    titel: 'Wohnmobil Stellplatz mieten im Raum Stuttgart und Böblingen',
    beschreibung: 'Wohnmobil Stellplatz oder Winterplatz bei Privatleuten im Raum Stuttgart und Böblingen mieten: Halle, Scheune, überdacht oder im Freien. Mit Richtpreisen und Checkliste.',
    h1: ['', 'Stellplatz für Wohnmobil', ' und Wohnwagen mieten'],
    einleitung: 'In Scheunen, Hallen, auf Höfen und großen Grundstücken bei Privatleuten in Ihrer Nähe. Sie sagen uns Maße und Zeitraum, wir schlagen passende Plätze vor.',
    zahl: wohnmobilSatz,
    plaetze: ['Halle oder Scheune: bester Schutz vor Nässe, Schnee und Sonne', 'Überdachter Stellplatz: gut belüftet, Schutz von oben', 'Stellplatz im Freien: flexibel, für robuste Fahrzeuge und kürzere Zeiträume'],
    zufahrt: ['Ist genug Platz zum Rangieren, auch rückwärts mit Gespann?', 'Ist der Untergrund befestigt? Auf Wiese sinkt ein schweres Fahrzeug im Winter ein.', 'Gibt es Steigungen, enge Kurven oder Schotter, die bei Nässe oder Schnee schwierig werden?'],
    masse: ['Länge mit Deichsel, Fahrradträger und Heckaufbauten messen', 'Höhe mit Klimaanlage, Dachbox oder SAT-Antenne messen und mit Tor- oder Durchfahrtshöhe vergleichen', 'Breite mit ausgeklappten Spiegeln bedenken'],
    zugang: ['Kommen Sie jederzeit an Ihr Fahrzeug oder nur nach Absprache?', 'Gibt es Strom für die Erhaltungsladung der Batterie?', 'Klären Sie mit dem Vermieter, ob Gasflaschen im Fahrzeug bleiben dürfen.'],
    verwandt: ['passtWohnmobil', 'winterplatzVergleich', 'diebstahlschutz', 'einwinterung'],
  },
  {
    seite: 'mietenLager', keyword: 'Lagerraum mieten',
    richtwerte: { arten: [], lager: true },
    faq: [
      { frage: 'Wie viel Platz brauche ich?', antwort: 'Als grobe Hilfe: Kisten und kleine Möbel aus einem Zimmer passen oft auf wenige Quadratmeter, wenn Sie stapeln können. Messen Sie große Stücke vorher aus und geben Sie im Suchauftrag die ungefähre Fläche an.' },
      { frage: 'Kann ich auch Reifen einlagern?', antwort: 'Ja, Reifen sind ein typisches Lagergut. Ein trockener, kühler Raum ist ideal. Sagen Sie uns im Suchauftrag, wie viele Sätze es sind.' },
      faqBesichtigung, faqSuchauftrag,
    ],
    art: 'lagerraum', icon: 'lager', bild: 'lager',
    kurz: 'Lagerraum', kachelText: 'Trockener Raum für Möbel, Reifen, Kisten oder Gartengeräte.',
    titel: 'Lagerraum privat mieten im Raum Stuttgart und Böblingen',
    beschreibung: 'Lagerraum privat mieten im Raum Stuttgart und Böblingen: Keller, Garage oder Scheune für Möbel, Reifen und Kisten. Mit Richtpreisen pro m² und Checkliste.',
    h1: ['', 'Lagerraum', ' privat mieten, in Ihrer Nähe'],
    einleitung: 'Ein Kellerraum, eine Garage oder ein Teil einer Scheune bei Privatleuten in Ihrer Nähe. Sie sagen uns, wie viel Platz Sie brauchen, wir schlagen passende Räume vor.',
    plaetze: ['Kellerraum: trocken und geschützt, gut für Kisten und Möbel', 'Garage als Lager: ebenerdig, gut für Reifen und Sperriges', 'Scheune oder Halle: viel Platz, auf Feuchtigkeit und Staub achten'],
    zufahrt: ['Wie nah kommen Sie mit dem Auto oder Transporter heran?', 'Gibt es Treppen, Engstellen oder einen Aufzug auf dem Weg zum Raum?', 'Wo können Sie zum Be- und Entladen kurz halten?'],
    masse: ['Fläche in m² und Raumhöhe: Wie hoch können Sie stapeln?', 'Tür- und Torbreite für Schränke, Sofas oder Waschmaschinen messen', 'Lieber etwas Platz für einen Gang lassen, damit Sie an alles herankommen'],
    zugang: ['Zu welchen Zeiten kommen Sie an Ihre Sachen?', 'Ist der Raum trocken und belüftet? Kartons und Polster nehmen Feuchtigkeit auf.', 'Klären Sie mit dem Vermieter, was eingelagert werden darf, etwa bei Benzin oder Lebensmitteln.'],
    verwandt: ['regionBoeblingen'],
  },
];
