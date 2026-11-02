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

const faqKosten = { frage: 'Was kostet es mich?', antwort: 'Nichts. Das Anbieten ist für Vermieter immer kostenlos, ohne Abo und ohne Laufzeit bei uns. Sie erhalten die volle vereinbarte Miete.' };
const faqMieter = { frage: 'Wer sind die Mieter?', antwort: 'Privatleute aus der Region. Sie lernen jeden Interessenten bei der Besichtigung kennen und entscheiden selbst, ob Sie vermieten.' };
const faqKuendigen = { frage: 'Kann ich wieder kündigen?', antwort: 'Ja. Der Mustervertrag ist monatlich kündbar, mit einer Frist von einem Monat.' };
const faqKaution = { frage: 'Gibt es eine Kaution?', antwort: `Ja. Jeder Mieter zahlt eine Kaution von einer Monatsmiete, mindestens ${zahlung.kautionMinEuro} €, direkt an Sie. Bei Ein- und Auszug wird der Zustand mit Fotos festgehalten.` };

export const vermietKategorien: VermietKategorie[] = [
  {
    seite: 'vermietenEinfahrt', keyword: 'Einfahrt vermieten', art: 'stellplatz-frei', icon: 'einfahrt',
    titel: 'Einfahrt vermieten: Stellplatz als Nebenverdienst',
    beschreibung: 'Einfahrt oder Stellplatz vermieten an Privatleute in Baden-Württemberg: für Auto, Motorrad, Anhänger oder Wohnwagen. Richtwerte, Checkliste und kostenloses Anbieten.',
    h1: ['', 'Einfahrt vermieten', ' und jeden Monat Miete erhalten'],
    einleitung: 'Eine freie Fläche in der Einfahrt oder auf dem Hof ist für viele Nachbarn genau das, was fehlt. Sie bestimmen, wer dort parkt, wann und zu welchem Preis.',
    richtwerte: { arten: ['stellplatz-frei', 'stellplatz-ueberdacht'], klassen: ['5', '7', '9'], lager: false },
    gesucht: ['Pendler, die in der Straße keinen Parkplatz finden', 'Motorradfahrer, die einen festen Platz suchen', 'Besitzer von Anhängern und kleinen Wohnwagen', 'Carport oder überdachter Platz: oft etwas höhere Miete'],
    checkliste: ['Fläche ausmessen: Länge und Breite, bei Carports auch die Höhe', 'Drei Fotos machen: Zufahrt von der Straße, die Fläche selbst, Tor oder Einfahrt', 'Festlegen, wann der Platz erreichbar ist, etwa rund um die Uhr oder tagsüber', 'Hausregeln überlegen, etwa keine Reparaturen und kein Ölwechsel auf dem Platz', 'Klären, ob Ihr eigenes Auto dann noch gut ein- und ausfahren kann'],
    faq: [
      { frage: 'Kann ich nur einen Teil der Einfahrt vermieten?', antwort: 'Ja. Viele vermieten genau einen Stellplatz und nutzen den Rest selbst. Wichtig ist, dass beide gut ein- und ausfahren können. Das klären wir vor der Besichtigung.' },
      { frage: 'Was, wenn ich die Einfahrt selbst brauche?', antwort: 'Zufahrtszeiten und Regeln legen Sie im Mustervertrag fest. So wissen beide Seiten vorher, wann der Platz frei sein muss.' },
      faqKosten, faqMieter, faqKaution, faqKuendigen,
    ],
    verwandt: ['vermietenGarage', 'verdienstrechner', 'nachfrage'],
  },
  {
    seite: 'vermietenGarage', keyword: 'Garage vermieten', art: 'garage', icon: 'garage',
    titel: 'Garage vermieten an Nachbarn',
    beschreibung: 'Garage vermieten an Privatleute in Baden-Württemberg: für Auto, Motorrad, Oldtimer oder als Lager. Richtwerte, Checkliste und kostenloses Anbieten.',
    h1: ['', 'Garage vermieten', ', die Sie selbst nicht brauchen'],
    einleitung: 'Garagen sind in vielen Wohngebieten knapp. Wenn Ihre leer steht oder nur als Abstellraum dient, kann sie jeden Monat Miete bringen.',
    richtwerte: { arten: ['garage'], klassen: ['5', '7', '9'], lager: false },
    gesucht: ['Autofahrer ohne eigenen Stellplatz', 'Motorrad- und Oldtimerbesitzer, die abschließbar parken möchten', 'Leute, die Reifen, Fahrräder oder Möbel trocken lagern wollen', 'Besitzer kleiner Wohnwagen, wenn Tor und Höhe passen'],
    checkliste: ['Torbreite, Torhöhe und Innenmaße messen', 'Drei Fotos machen: Zufahrt, Garage innen, Tor', 'Klären, wie der Mieter hineinkommt: Schlüssel, Handsender oder Schloss', 'Überlegen, ob Strom genutzt werden darf', 'Festlegen, ob die Garage auch als Lager genutzt werden darf'],
    faq: [
      { frage: 'Darf der Mieter die Garage auch als Lager nutzen?', antwort: 'Das entscheiden Sie. Halten Sie im Mustervertrag fest, wofür die Garage genutzt werden darf, etwa nur zum Parken oder auch zum Lagern.' },
      { frage: 'Wie gibt der Mieter den Schlüssel zurück?', antwort: 'Bei der Übergabe und beim Auszug wird ein Protokoll mit Fotos erstellt, darin steht auch die Anzahl der Schlüssel oder Handsender.' },
      faqKosten, faqMieter, faqKaution, faqKuendigen,
    ],
    verwandt: ['vermietenEinfahrt', 'vermietenKeller', 'verdienstrechner'],
  },
  {
    seite: 'vermietenKeller', keyword: 'Keller vermieten', art: 'lagerraum', icon: 'keller',
    titel: 'Keller vermieten als Lagerraum',
    beschreibung: 'Keller oder Lagerraum vermieten an Privatleute in Baden-Württemberg: für Möbel, Reifen und Kisten. Richtwerte pro m², Checkliste, kostenlos anbieten.',
    h1: ['', 'Keller vermieten', ' als trockenen Lagerraum'],
    einleitung: 'Ein trockener Kellerraum oder ein ungenutzter Raum im Nebengebäude ist für viele ideal, um Möbel, Reifen oder Kisten unterzubringen. Sie bestimmen, wann der Mieter an seine Sachen kommt.',
    richtwerte: { arten: [], lager: true },
    gesucht: ['Leute im Umzug, die Möbel zwischenlagern', 'Familien mit wenig Platz für Kisten und Saisonartikel', 'Autofahrer, die Reifen einlagern möchten', 'Hobbygärtner mit Geräten und Möbeln für den Garten'],
    checkliste: ['Fläche in m² und Raumhöhe messen', 'Prüfen, ob der Raum trocken ist, und regelmäßig lüften', 'Weg zum Raum ansehen: Treppen, Türbreite, eigener Eingang', 'Zugangszeiten festlegen, etwa nach Absprache oder zu festen Zeiten', 'Festlegen, was nicht eingelagert werden darf, etwa Benzin oder Lebensmittel'],
    faq: [
      { frage: 'Muss ich dabei sein, wenn der Mieter an seine Sachen will?', antwort: 'Das legen Sie fest. Manche geben einen eigenen Schlüssel aus, andere vereinbaren feste Zeiten. Wir halten das im Mustervertrag fest.' },
      { frage: 'Was darf eingelagert werden?', antwort: 'Das bestimmen Sie. Typisch sind Möbel, Kisten, Reifen und Gartengeräte. Schreiben Sie im Vertrag fest, was ausgeschlossen ist.' },
      faqKosten, faqMieter, faqKaution, faqKuendigen,
    ],
    verwandt: ['vermietenGarage', 'mietenLager', 'verdienstrechner'],
  },
  {
    seite: 'vermietenScheune', keyword: 'Scheune vermieten', art: 'halle-scheune', icon: 'hof',
    titel: 'Scheune vermieten: Stellplätze in Scheune und Hof',
    beschreibung: 'Scheune, Halle oder Hof vermieten: Winterplätze für Wohnmobile, Wohnwagen, Boote und Anhänger in Baden-Württemberg. Richtwerte, Ertragsrechner, kostenlos.',
    h1: ['', 'Scheune vermieten', ' und mehrere Plätze auf einmal füllen'],
    einleitung: 'In einer Scheune, Halle oder auf einem großen Hof ist oft Platz für mehrere Fahrzeuge. Gerade Winterplätze für Wohnmobile und Wohnwagen sind gefragt.',
    richtwerte: { arten: ['halle-scheune', 'stellplatz-frei'], klassen: ['7', '9', 'ueber-9'], lager: false },
    gesucht: ['Wohnmobil- und Wohnwagenbesitzer, die einen Winterplatz suchen', 'Bootsbesitzer mit Trailer für die Monate außerhalb der Saison', 'Besitzer von Oldtimern, die trocken stehen sollen', 'Leute mit Anhängern, die einen festen Platz brauchen'],
    checkliste: ['Torbreite und Torhöhe messen, hohe Wohnmobile brauchen ein hohes Tor', 'Zählen, wie viele Fahrzeuge mit Rangierraum hineinpassen', 'Festlegen, ob Mieter jederzeit oder nur nach Absprache an ihr Fahrzeug kommen', 'Überlegen, ob Gasflaschen in den Fahrzeugen bleiben dürfen', 'Klären, ob es Strom für die Erhaltungsladung geben soll'],
    faq: [
      { frage: 'Wie viele Plätze kann ich anbieten?', antwort: 'So viele, wie mit genug Platz zum Rangieren hineinpassen. Geben Sie im Formular die ungefähre Zahl an, wir besprechen die Aufteilung mit Ihnen.' },
      { frage: 'Was ist, wenn Fahrzeuge hintereinander stehen?', antwort: 'Dann kommt nicht jeder jederzeit heraus. Legen Sie fest, ob Zugang nur nach Absprache möglich ist. Das steht dann im Vorschlag und im Vertrag.' },
      faqKosten, faqMieter, faqKaution, faqKuendigen,
    ],
    verwandt: ['nachfrage', 'mietenWohnmobil', 'verdienstrechner'],
  },
];
