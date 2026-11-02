// Kategorieseiten für Mieter (/mieten/<kategorie>/). Nur praktische Hinweise, keine Kosten, keine Rechtsaussagen.
import type { SeitenSchluessel } from '../config/seiten';
import type { IconName } from '../lib/icons';
import { wohnmobilSatz } from './nachfrage';

// Gemeinsame FAQ für alle Kategorien
const faqSuchauftrag = { frage: 'Was passiert, wenn gerade kein Platz frei ist?', antwort: 'Mit einem Suchauftrag müssen Sie nicht immer wieder nachsehen. Wir melden uns, sobald ein passender Platz in Ihrer Nähe frei wird. Der Suchauftrag ist kostenlos und unverbindlich.' };
const faqBesichtigung = { frage: 'Kann ich den Platz vorher ansehen?', antwort: 'Ja. Mit dem Vorschlag erhalten Sie Fotos und den Ortsteil. Wenn der Platz passt, vereinbaren wir einen Besichtigungstermin, dann erfahren Sie auch die genaue Adresse.' };
const faqVertrag = { frage: 'Wie lange bin ich gebunden?', antwort: 'Der Mustervertrag ist monatlich kündbar, mit einer Frist von einem Monat. Sie können ihn vor Ihrer Zusage in Ruhe lesen.' };

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
      { frage: 'Ab wann sollte ich einen Winterplatz suchen?', antwort: 'Viele suchen ab dem Spätsommer. Je früher Sie Ihren Suchauftrag anlegen, desto mehr Zeit bleibt für Besichtigung und Vertrag, bevor die Saison endet.' },
      { frage: 'Welche Maße brauchen Sie von mir?', antwort: 'Länge mit Deichsel und Heckträger, Höhe mit Dachaufbauten wie Klimaanlage oder SAT-Antenne und die Breite. Damit schlagen wir nur Plätze vor, deren Zufahrt und Tor passen.' },
      faqBesichtigung, faqVertrag, faqSuchauftrag,
    ],
    art: 'wohnmobil-wohnwagen', icon: 'wohnmobil', bild: 'wohnmobil',
    kurz: 'Wohnmobil / Wohnwagen', kachelText: 'Winterplatz oder ganzjährig, unter Dach oder im Freien.',
    titel: 'Wohnmobil Stellplatz mieten in Baden-Württemberg',
    beschreibung: 'Wohnmobil Stellplatz oder Winterplatz bei Privatleuten in Baden-Württemberg mieten: Halle, Scheune, überdacht oder im Freien. Mit Richtpreisen und Checkliste.',
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
    seite: 'mietenAnhaenger', keyword: 'Anhänger Stellplatz mieten',
    richtwerte: { arten: ['stellplatz-frei', 'stellplatz-ueberdacht', 'halle-scheune'], klassen: ['5', '7', '9'], lager: false },
    faq: [
      { frage: 'Kann ich auch einen Bootstrailer oder Pferdeanhänger unterstellen?', antwort: 'Ja. Geben Sie im Suchauftrag die Gesamtlänge mit Deichsel an, bei Booten auch die Höhe mit Aufbau. Dann suchen wir einen Platz, an den Sie gut heranfahren können.' },
      { frage: 'Muss ich den Anhänger von Hand rangieren?', antwort: 'Das hängt vom Platz ab. Wir nennen Ihnen vorab, wie die Zufahrt aussieht. Bei der Besichtigung sehen Sie, ob Sie mit dem Zugfahrzeug direkt an den Stellplatz kommen.' },
      faqBesichtigung, faqVertrag, faqSuchauftrag,
    ],
    art: 'anhaenger-boot', icon: 'anhaenger', bild: 'anhaenger',
    kurz: 'Anhänger / Boot', kachelText: 'Für Anhänger, Bootstrailer oder Pferdeanhänger.',
    titel: 'Anhänger Stellplatz mieten in Baden-Württemberg',
    beschreibung: 'Stellplatz für Anhänger, Bootstrailer oder Pferdeanhänger bei Privatleuten in Baden-Württemberg. Worauf Sie bei Zufahrt, Maßen und Zugang achten sollten.',
    h1: ['', 'Stellplatz für Anhänger', ' und Boot mieten'],
    einleitung: 'Oft reicht ein Platz in einer Einfahrt, auf einem Hof oder in einer Scheune in Ihrer Nähe. Sie sagen uns Maße und Zeitraum, wir schlagen passende Plätze vor.',
    plaetze: ['Einfahrt oder Hoffläche: oft ideal für kleinere Anhänger', 'Scheune oder Halle: Schutz für Boot, Polster und Elektrik', 'Überdachter Platz: Schutz vor Laub, Regen und Sonne'],
    zufahrt: ['Lässt sich der Anhänger dort abstellen, wo Sie ihn mit dem Zugfahrzeug erreichen?', 'Müssen Sie ihn von Hand rangieren? Dann zählt ein fester, ebener Untergrund.', 'Ist die Einfahrt breit genug für Zugfahrzeug und Anhänger zusammen?'],
    masse: ['Gesamtlänge mit Deichsel messen, beim Bootstrailer mit Bug und Außenborder', 'Höhe bei Booten mit Aufbau, Persenning oder gelegtem Mast prüfen', 'Breite des Trailers und Platz zum Ankuppeln einplanen'],
    zugang: ['Wie oft brauchen Sie den Anhänger? In der Saison oft jede Woche.', 'Kommen Sie früh morgens oder am Wochenende an den Platz?', 'Deichselschloss oder Radkralle mitbringen und absprechen, wo der Anhänger genau steht'],
    verwandt: ['mietenWohnmobil', 'diebstahlschutz', 'passtWohnmobil'],
  },
  {
    seite: 'mietenAuto', keyword: 'Stellplatz mieten',
    richtwerte: { arten: ['stellplatz-frei', 'stellplatz-ueberdacht'], klassen: ['5'], lager: false },
    faq: [
      { frage: 'Gibt es auch Plätze für Motorräder?', antwort: 'Ja. Für ein Motorrad reicht oft ein kleinerer Platz in einer Einfahrt, einem Carport oder einer Garage. Geben Sie im Suchauftrag an, dass es um ein Motorrad geht.' },
      { frage: 'Kann ich jederzeit an mein Auto?', antwort: 'Bei Stellplätzen für den Alltag ist das meist so. Wir klären mit dem Vermieter vorab, ob der Platz rund um die Uhr erreichbar ist, und nennen es Ihnen im Vorschlag.' },
      faqBesichtigung, faqVertrag, faqSuchauftrag,
    ],
    art: 'auto-motorrad', icon: 'einfahrt', bild: 'stellplatz',
    kurz: 'Auto / Motorrad', kachelText: 'Stellplatz oder Garage, draußen oder überdacht, nah an Ihrer Wohnung.',
    titel: 'Stellplatz mieten für Auto und Motorrad',
    beschreibung: 'Stellplatz oder Garage für Auto, Motorrad oder Oldtimer bei Privatleuten in Baden-Württemberg. Worauf Sie bei Zufahrt, Maßen und Zugang achten sollten.',
    h1: ['', 'Stellplatz', ' für Auto und Motorrad mieten'],
    einleitung: 'Ein freier Platz in der Einfahrt, ein Carport oder eine Garage bei Nachbarn. Sie sagen uns, wo und ab wann, wir schlagen passende Plätze vor.',
    plaetze: ['Garage: abschließbar und trocken, auch für Motorrad oder Oldtimer', 'Carport oder überdachter Stellplatz: Schutz von oben, schnell erreichbar', 'Stellplatz in der Einfahrt oder im Hof: oft am nächsten an Ihrer Wohnung'],
    zufahrt: ['Wie eng ist die Einfahrt, und müssen Sie rangieren?', 'Steht dort morgens ein anderes Auto im Weg?', 'Wie weit ist der Fußweg zu Ihrer Wohnung, gerade abends?'],
    masse: ['Ältere Garagen sind oft schmal. Reicht der Platz, um die Türen zu öffnen und auszusteigen?', 'Torhöhe bei SUV, Transporter oder Dachbox prüfen', 'Länge bei Kombi, Van oder mit Anhängerkupplung bedenken'],
    zugang: ['Kommen Sie jederzeit hinein, auch früh morgens und spät abends?', 'Gibt es Schlüssel, Handsender oder ein Schloss?', 'Ist der Platz beleuchtet?'],
    verwandt: ['mietenGarage', 'mietenLager', 'regionBoeblingen'],
  },
  {
    seite: 'mietenLager', keyword: 'Lagerraum mieten',
    richtwerte: { arten: [], lager: true },
    faq: [
      { frage: 'Wie viel Platz brauche ich?', antwort: 'Als grobe Hilfe: Kisten und kleine Möbel aus einem Zimmer passen oft auf wenige Quadratmeter, wenn Sie stapeln können. Messen Sie große Stücke vorher aus und geben Sie im Suchauftrag die ungefähre Fläche an.' },
      { frage: 'Kann ich auch Reifen einlagern?', antwort: 'Ja, Reifen sind ein typisches Lagergut. Ein trockener, kühler Raum ist ideal. Sagen Sie uns im Suchauftrag, wie viele Sätze es sind.' },
      faqBesichtigung, faqVertrag, faqSuchauftrag,
    ],
    art: 'lagerraum', icon: 'lager', bild: 'lager',
    kurz: 'Lagerraum', kachelText: 'Trockener Raum für Möbel, Reifen, Kisten oder Gartengeräte.',
    titel: 'Lagerraum privat mieten in Baden-Württemberg',
    beschreibung: 'Lagerraum privat mieten in Baden-Württemberg: Keller, Garage oder Scheune für Möbel, Reifen und Kisten. Mit Richtpreisen pro m² und Checkliste.',
    h1: ['', 'Lagerraum', ' privat mieten, in Ihrer Nähe'],
    einleitung: 'Ein Kellerraum, eine Garage oder ein Teil einer Scheune bei Privatleuten in Ihrer Nähe. Sie sagen uns, wie viel Platz Sie brauchen, wir schlagen passende Räume vor.',
    plaetze: ['Kellerraum: trocken und geschützt, gut für Kisten und Möbel', 'Garage als Lager: ebenerdig, gut für Reifen und Sperriges', 'Scheune oder Halle: viel Platz, auf Feuchtigkeit und Staub achten'],
    zufahrt: ['Wie nah kommen Sie mit dem Auto oder Transporter heran?', 'Gibt es Treppen, Engstellen oder einen Aufzug auf dem Weg zum Raum?', 'Wo können Sie zum Be- und Entladen kurz halten?'],
    masse: ['Fläche in m² und Raumhöhe: Wie hoch können Sie stapeln?', 'Tür- und Torbreite für Schränke, Sofas oder Waschmaschinen messen', 'Lieber etwas Platz für einen Gang lassen, damit Sie an alles herankommen'],
    zugang: ['Zu welchen Zeiten kommen Sie an Ihre Sachen?', 'Ist der Raum trocken und belüftet? Kartons und Polster nehmen Feuchtigkeit auf.', 'Klären Sie mit dem Vermieter, was eingelagert werden darf, etwa bei Benzin oder Lebensmitteln.'],
    verwandt: ['mietenGarage', 'mietenAuto', 'regionBoeblingen'],
  },
  {
    seite: 'mietenGarage', keyword: 'Garage mieten', startseite: false,
    richtwerte: { arten: ['garage'], klassen: ['5', '7', '9'], lager: false },
    faq: [
      { frage: 'Passt mein Auto in jede Garage?', antwort: 'Nicht immer. Ältere Garagen sind oft schmal und niedrig. Geben Sie im Suchauftrag an, was Sie unterstellen möchten. Wir nennen Ihnen bei jedem Vorschlag die Maße, soweit wir sie kennen.' },
      { frage: 'Kann ich eine Garage auch als Lager nutzen?', antwort: 'Das ist oft möglich, etwa für Reifen, Fahrräder oder Möbel. Klären Sie mit dem Vermieter, was erlaubt ist. Wir sprechen das vor der Besichtigung an.' },
      faqBesichtigung, faqVertrag, faqSuchauftrag,
    ],
    art: 'garage', icon: 'garage', bild: 'garage',
    kurz: 'Garage', kachelText: 'Abschließbar und trocken, für Auto, Motorrad oder Oldtimer.',
    titel: 'Garage mieten in Baden-Württemberg',
    beschreibung: 'Garage mieten bei Privatleuten in Baden-Württemberg: für Auto, Motorrad, Oldtimer oder als Lager. Richtwerte, Größen und eine Checkliste für die Besichtigung.',
    h1: ['', 'Garage', ' mieten, privat und in Ihrer Nähe'],
    einleitung: 'Garagen sind in vielen Wohngebieten knapp. Oft steht aber bei Nachbarn eine leer oder wird nur als Abstellraum genutzt. Sie sagen uns, wo und wofür, wir schlagen passende Garagen vor.',
    plaetze: ['Einzelgarage: abschließbar, für ein Auto oder Motorrad', 'Doppelgarage, von der eine Hälfte frei ist', 'Garage als Lager: für Reifen, Fahrräder oder Möbel'],
    zufahrt: ['Lässt sich die Garage gut anfahren, auch rückwärts?', 'Steht morgens ein anderes Auto vor dem Tor?', 'Gibt es eine Steigung, die bei Glätte schwierig wird?'],
    masse: ['Torbreite und Torhöhe messen und mit Ihrem Fahrzeug vergleichen', 'Innenbreite: Reicht der Platz, um die Türen zu öffnen und auszusteigen?', 'Länge bei Kombi, Van oder Anhängerkupplung bedenken'],
    zugang: ['Wie öffnet das Tor: Schlüssel, Handsender oder von Hand?', 'Kommen Sie jederzeit hinein, auch früh morgens?', 'Gibt es Licht, und dürfen Sie Strom nutzen?'],
    verwandt: ['mietenAuto', 'mietenLager', 'passtWohnmobil'],
  },
];
