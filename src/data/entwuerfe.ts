// Kurztexte für Seiten, die noch im Aufbau sind (siehe entwurf in src/config/seiten.ts).
import type { SeitenSchluessel } from '../config/seiten';
import { texte, vermittlungHtml } from '../lib/texte';

// punkte: erste Inhalte, die schon vor der fertigen Seite stimmen.
type Entwurf = { einleitung: string; eltern?: SeitenSchluessel; verwandt?: SeitenSchluessel[]; punkte?: string[]; punkteHtml?: string[] };

export const entwurfTexte: Partial<Record<SeitenSchluessel, Entwurf>> = {
  werkzeuge: { einleitung: 'Checklisten, Rechner und Ratgeber rund ums Unterstellen und Vermieten.', verwandt: ['verdienstrechner', 'einwinterung', 'strassenCheck', 'winterplatzVergleich'] },
  verdienstrechner: { einleitung: 'Was bringt Ihr freier Platz im Jahr? Wählen Sie Art der Fläche, Monatsmiete und Anzahl der Plätze.', eltern: 'werkzeuge', verwandt: ['vermieten', 'preise'] },
  einwinterung: { einleitung: 'Schritt für Schritt: So machen Sie Wohnmobil, Wohnwagen oder Oldtimer winterfest.', eltern: 'werkzeuge', verwandt: ['winterplatzVergleich', 'mieten'] },
  strassenCheck: {
    einleitung: 'Darf Ihr Wohnwagen oder Anhänger an der Straße stehen? Ohne Zugfahrzeug gilt die 2-Wochen-Regel – hier steht, was das heißt.',
    eltern: 'werkzeuge',
    verwandt: ['mieten', 'winterplatzVergleich'],
    punkte: [
      'Anhänger und Wohnwagen ohne Zugfahrzeug dürfen höchstens zwei Wochen auf öffentlichen Straßen parken (§ 12 Abs. 3b StVO).',
      'Ausnahme: Parkplätze, die mit einem Schild ausdrücklich für Anhänger freigegeben sind.',
      'In reinen und allgemeinen Wohngebieten ist regelmäßiges Parken von Anhängern über 2 t nachts (22 bis 6 Uhr) sowie an Sonn- und Feiertagen verboten (§ 12 Abs. 3a StVO).',
      'Ein Wohnmobil ist kein Anhänger: Für zugelassene Wohnmobile gilt die 2-Wochen-Regel nicht, über 7,5 t aber dieselbe Nachtregel in Wohngebieten.',
      'Diese Übersicht ersetzt keine Rechtsberatung. Örtliche Schilder und Satzungen gehen vor.',
    ],
  },
  winterplatzVergleich: { einleitung: 'Halle, Scheune, Carport oder Garage: Welcher Platz passt zu Ihrem Fahrzeug?', eltern: 'werkzeuge', verwandt: ['einwinterung', 'mieten'] },
  regionen: { einleitung: 'Wir vermitteln Plätze in ganz Baden-Württemberg – in Städten wie Stuttgart, Karlsruhe, Freiburg oder Ulm und auf dem Land.', verwandt: ['mieten', 'vermieten'] },
  nachfrage: { einleitung: 'Wo in Baden-Württemberg gerade Plätze gesucht werden.', eltern: 'vermieten', verwandt: ['vermieten', 'verdienstrechner'] },
  hilfe: { einleitung: 'Antworten auf häufige Fragen – und ein persönlicher Ansprechpartner, wenn etwas offen bleibt.', verwandt: ['kontakt', 'soFunktionierts'] },
  soFunktionierts: { einleitung: 'Vom Suchauftrag bis zum Vertrag: So läuft die Vermittlung für Mieter und Vermieter.', verwandt: ['mieten', 'vermieten'] },
  sicherheit: { einleitung: 'Jede Fläche von Hand geprüft, Mustervertrag, Kaution und Fotos bei Ein- und Auszug.', verwandt: ['vermieten', 'preise'] },
  preise: { einleitung: 'Für Vermieter immer kostenlos. Was Mieter zahlen:', punkteHtml: [texte.mieterKosten, vermittlungHtml(), texte.servicegebuehr || vermittlungHtml() ? texte.ustHinweis : ''].filter(Boolean), verwandt: ['mieten', 'vermieten'] },
  ueberUns: { einleitung: 'Nachbarn helfen sich: ungenutzter Platz gegen einen fairen Nebenverdienst.', verwandt: ['soFunktionierts', 'kontakt'] },
  kontakt: { einleitung: 'Ihr persönlicher Ansprechpartner – per Telefon oder WhatsApp.', verwandt: ['hilfe'] },
  agb: { einleitung: 'Die Allgemeinen Geschäftsbedingungen werden vor dem Start veröffentlicht.', verwandt: ['impressum', 'datenschutz'] },
};
