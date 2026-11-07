// Kategorieseiten für Vermieter (/vermieten/<kategorie>/). Nur praktische Hinweise, keine Rechts- oder Steueraussagen.
import type { SeitenSchluessel } from '../config/seiten';
import type { IconName } from '../lib/icons';
import { zahlung } from '../config/zahlung';

export type VermietKategorie = {
  seite: SeitenSchluessel;
  keyword: string;
  art: string; // Wert für flaechen_art im Formular
  icon: IconName;
  titel: string;
  beschreibung: string;
  h1: [string, string, string];
  einleitung: string;
  richtwerte: { arten?: string[]; klassen?: string[]; lager?: boolean };
  gesucht: string[]; // Wer sucht so einen Platz (Varianten)
  checkliste: string[];
  faq: { frage: string; antwort: string }[];
  verwandt: SeitenSchluessel[];
};

const faqKosten = { frage: 'Was kostet es mich?', antwort: zahlung.servicegebuehrAktiv && zahlung.provisionAnzeigen ? 'Das Anbieten ist kostenlos, ohne Abo und ohne Laufzeit bei uns. Erst wenn Sie vermieten, fällt eine einmalige Provision an. Sie wird von der ersten Auszahlung abgezogen.' : 'Das Anbieten ist kostenlos, ohne Abo und ohne Laufzeit bei uns. Sie legen fest, welchen Betrag Sie bekommen möchten.' };
const faqMieter = { frage: 'Wer sind die Mieter?', antwort: 'Privatleute aus der Region. Sie lernen jeden Interessenten bei der Besichtigung kennen und entscheiden selbst, ob Sie vermieten.' };

export const vermietKategorien: VermietKategorie[] = [
  {
    seite: 'vermietenEinfahrt', keyword: 'Stellfläche für Wohnmobil vermieten', art: 'stellplatz-frei', icon: 'einfahrt',
    titel: 'Hoffläche für Wohnmobile und Wohnwagen vermieten',
    beschreibung: 'Hof- oder Freifläche an Wohnmobil- und Wohnwagenbesitzer im Raum Stuttgart und Böblingen vermieten. Richtwerte, Checkliste und kostenloses Anbieten.',
    h1: ['', 'Hoffläche vermieten', ' an Wohnmobil- und Wohnwagenbesitzer'],
    einleitung: 'Eine befestigte Fläche auf dem Hof, neben dem Haus oder unter einem Dach ist für viele Wohnmobil- und Wohnwagenbesitzer genau das, was fehlt. Sie bestimmen, wer dort steht, wie lange und zu welchem Preis.',
    richtwerte: { arten: ['stellplatz-frei', 'stellplatz-ueberdacht'], klassen: ['7', '9', 'ueber-9'], lager: false },
    gesucht: ['Wohnwagenbesitzer, die keinen Platz am Haus haben', 'Wohnmobilbesitzer, die einen Winterplatz suchen', 'Leute, die ganzjährig einen festen Platz brauchen', 'Überdachter Platz: oft etwas höhere Miete'],
    checkliste: ['Fläche ausmessen: Länge und Breite, bei einem Dach auch die Durchfahrtshöhe', 'Drei Fotos machen: Zufahrt von der Straße, die Fläche selbst, Tor oder Einfahrt', 'Festlegen, wann der Platz erreichbar ist, etwa rund um die Uhr oder nach Absprache', 'Prüfen, ob ein großes Fahrzeug gut rangieren kann', 'Klären, ob Ihr eigenes Auto dann noch gut ein- und ausfahren kann'],
    faq: [
      { frage: 'Kann ich nur einen Teil des Hofs vermieten?', antwort: 'Ja. Viele vermieten genau einen Platz und nutzen den Rest selbst. Wichtig ist, dass beide gut ein- und ausfahren können.' },
      { frage: 'Was, wenn ich die Fläche zeitweise selbst brauche?', antwort: 'Legen Sie Zugangszeiten und Regeln vorher fest und nennen Sie sie im Inserat. So wissen beide Seiten vorher Bescheid.' },
      faqKosten, faqMieter,
    ],
    verwandt: ['vermietenScheune', 'verdienstrechner', 'nachfrage'],
  },
  {
    seite: 'vermietenGarage', keyword: 'Garage als Lager vermieten', art: 'garage', icon: 'garage',
    titel: 'Garage als Lagerraum vermieten',
    beschreibung: 'Garage als Lagerraum vermieten im Raum Stuttgart und Böblingen: für Reifen, Möbel und Kisten. Richtwerte, Checkliste und kostenloses Anbieten.',
    h1: ['', 'Garage als Lager vermieten', ', wenn Sie sie selbst nicht brauchen'],
    einleitung: 'Eine Garage ist ebenerdig, abschließbar und trocken, also ideal als Lager. Wenn Ihre leer steht, kann sie jeden Monat Miete bringen.',
    richtwerte: { arten: [], lager: true },
    gesucht: ['Leute im Umzug, die Möbel zwischenlagern', 'Leute, die Reifen einlagern möchten', 'Familien mit wenig Platz für Kisten und Saisonartikel', 'Hobbygärtner mit Geräten und Gartenmöbeln'],
    checkliste: ['Innenmaße, Torbreite und Torhöhe messen', 'Drei Fotos machen: Zufahrt, Garage innen, Tor', 'Klären, wie der Mieter hineinkommt: Schlüssel, Handsender oder Schloss', 'Zugangszeiten festlegen, etwa nach Absprache oder zu festen Zeiten', 'Festlegen, was nicht eingelagert werden darf, etwa Benzin oder Lebensmittel'],
    faq: [
      { frage: 'Was darf eingelagert werden?', antwort: 'Das bestimmen Sie. Typisch sind Möbel, Kisten, Reifen und Gartengeräte. Nennen Sie im Inserat, was ausgeschlossen ist.' },
      { frage: 'Wie gibt der Mieter den Schlüssel zurück?', antwort: 'Halten Sie bei Übergabe und Auszug in einem Protokoll mit Fotos fest, wie viele Schlüssel oder Handsender es gibt.' },
      faqKosten, faqMieter,
    ],
    verwandt: ['vermietenKeller', 'mietenLager', 'verdienstrechner'],
  },
  {
    seite: 'vermietenKeller', keyword: 'Keller vermieten', art: 'lagerraum', icon: 'keller',
    titel: 'Keller vermieten als Lagerraum',
    beschreibung: 'Keller oder Lagerraum vermieten an Privatleute im Raum Stuttgart und Böblingen: für Möbel, Reifen und Kisten. Richtwerte pro m², Checkliste, kostenlos anbieten.',
    h1: ['', 'Keller vermieten', ' als trockenen Lagerraum'],
    einleitung: 'Ein trockener Kellerraum oder ein ungenutzter Raum im Nebengebäude ist für viele ideal, um Möbel, Reifen oder Kisten unterzubringen. Sie bestimmen, wann der Mieter an seine Sachen kommt.',
    richtwerte: { arten: [], lager: true },
    gesucht: ['Leute im Umzug, die Möbel zwischenlagern', 'Familien mit wenig Platz für Kisten und Saisonartikel', 'Leute, die Reifen einlagern möchten', 'Hobbygärtner mit Geräten und Möbeln für den Garten'],
    checkliste: ['Fläche in m² und Raumhöhe messen', 'Prüfen, ob der Raum trocken ist, und regelmäßig lüften', 'Weg zum Raum ansehen: Treppen, Türbreite, eigener Eingang', 'Zugangszeiten festlegen, etwa nach Absprache oder zu festen Zeiten', 'Festlegen, was nicht eingelagert werden darf, etwa Benzin oder Lebensmittel'],
    faq: [
      { frage: 'Muss ich dabei sein, wenn der Mieter an seine Sachen will?', antwort: 'Das legen Sie fest. Manche geben einen eigenen Schlüssel aus, andere vereinbaren feste Zeiten.' },
      { frage: 'Was darf eingelagert werden?', antwort: 'Das bestimmen Sie. Typisch sind Möbel, Kisten, Reifen und Gartengeräte. Nennen Sie im Inserat, was ausgeschlossen ist.' },
      faqKosten, faqMieter,
    ],
    verwandt: ['vermietenGarage', 'mietenLager', 'verdienstrechner'],
  },
  {
    seite: 'vermietenScheune', keyword: 'Scheune vermieten', art: 'halle-scheune', icon: 'hof',
    titel: 'Scheune vermieten: Stellplätze in Scheune und Hof',
    beschreibung: 'Scheune, Halle oder Hof vermieten: Winterplätze für Wohnmobile und Wohnwagen im Raum Stuttgart und Böblingen. Richtwerte, Ertragsrechner, kostenlos.',
    h1: ['', 'Scheune vermieten', ' und mehrere Plätze auf einmal füllen'],
    einleitung: 'In einer Scheune, Halle oder auf einem großen Hof ist oft Platz für mehrere Wohnmobile oder Wohnwagen. Gerade Winterplätze für Wohnmobile und Wohnwagen sind gefragt.',
    richtwerte: { arten: ['halle-scheune', 'stellplatz-frei'], klassen: ['7', '9', 'ueber-9'], lager: false },
    gesucht: ['Wohnmobilbesitzer, die einen trockenen Winterplatz suchen', 'Wohnwagenbesitzer ohne Platz am Haus', 'Besitzer hoher Fahrzeuge, die ein hohes Tor brauchen', 'Leute, die ganzjährig einen festen Platz brauchen'],
    checkliste: ['Torbreite und Torhöhe messen, hohe Wohnmobile brauchen ein hohes Tor', 'Zählen, wie viele Fahrzeuge mit Rangierraum hineinpassen', 'Festlegen, ob Mieter jederzeit oder nur nach Absprache an ihr Fahrzeug kommen', 'Überlegen, ob Gasflaschen in den Fahrzeugen bleiben dürfen', 'Klären, ob es Strom für die Erhaltungsladung geben soll'],
    faq: [
      { frage: 'Wie viele Plätze kann ich anbieten?', antwort: 'So viele, wie mit genug Platz zum Rangieren hineinpassen. Geben Sie die Zahl im Inserat an.' },
      { frage: 'Was ist, wenn Fahrzeuge hintereinander stehen?', antwort: 'Dann kommt nicht jeder jederzeit heraus. Legen Sie fest, ob Zugang nur nach Absprache möglich ist. Das steht dann im Inserat.' },
      faqKosten, faqMieter,
    ],
    verwandt: ['nachfrage', 'mietenWohnmobil', 'verdienstrechner'],
  },
];
