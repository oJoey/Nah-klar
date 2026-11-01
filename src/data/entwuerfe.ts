// Kurztexte für Seiten, die noch im Aufbau sind (siehe entwurf in src/config/seiten.ts).
import type { SeitenSchluessel } from '../config/seiten';
import { texte, vermittlungHtml } from '../lib/texte';

// punkte: erste Inhalte, die schon vor der fertigen Seite stimmen.
type Entwurf = { einleitung: string; eltern?: SeitenSchluessel; verwandt?: SeitenSchluessel[]; punkte?: string[]; punkteHtml?: string[] };

export const entwurfTexte: Partial<Record<SeitenSchluessel, Entwurf>> = {
  regionen: { einleitung: 'Wir vermitteln Plätze in ganz Baden-Württemberg: in Städten wie Stuttgart, Karlsruhe, Freiburg oder Ulm und auf dem Land.', verwandt: ['mieten', 'vermieten'] },
  nachfrage: { einleitung: 'Wo in Baden-Württemberg gerade Plätze gesucht werden.', eltern: 'vermieten', verwandt: ['vermieten', 'verdienstrechner'] },
  hilfe: { einleitung: 'Antworten auf häufige Fragen und ein persönlicher Ansprechpartner, wenn etwas offen bleibt.', verwandt: ['kontakt', 'soFunktionierts'] },
  soFunktionierts: { einleitung: 'Vom Suchauftrag bis zum Vertrag: So läuft die Vermittlung für Mieter und Vermieter.', verwandt: ['mieten', 'vermieten'] },
  sicherheit: { einleitung: 'Jede Fläche von Hand geprüft, Mustervertrag, Kaution und Fotos bei Ein- und Auszug.', verwandt: ['vermieten', 'preise'] },
  preise: { einleitung: 'Für Vermieter immer kostenlos. Was Mieter zahlen:', punkteHtml: [texte.mieterKosten, vermittlungHtml(), texte.servicegebuehr || vermittlungHtml() ? texte.ustHinweis : ''].filter(Boolean), verwandt: ['mieten', 'vermieten'] },
  ueberUns: { einleitung: 'Nachbarn helfen sich: ungenutzter Platz gegen einen fairen Nebenverdienst.', verwandt: ['soFunktionierts', 'kontakt'] },
  kontakt: { einleitung: 'Ihr persönlicher Ansprechpartner per WhatsApp und E-Mail.', verwandt: ['hilfe'] },
  agb: { einleitung: 'Die Allgemeinen Geschäftsbedingungen werden vor dem Start veröffentlicht.', verwandt: ['impressum', 'datenschutz'] },
};
