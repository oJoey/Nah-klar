// Kurztexte für Seiten, die noch im Aufbau sind (siehe entwurf in src/config/seiten.ts).
import type { SeitenSchluessel } from '../config/seiten';

type Entwurf = { einleitung: string; eltern?: SeitenSchluessel; verwandt?: SeitenSchluessel[] };

export const entwurfTexte: Partial<Record<SeitenSchluessel, Entwurf>> = {
  werkzeuge: { einleitung: 'Checklisten, Rechner und Ratgeber rund ums Unterstellen und Vermieten.', verwandt: ['verdienstrechner', 'einwinterung', 'strassenCheck', 'winterplatzVergleich'] },
  verdienstrechner: { einleitung: 'Was bringt Ihr freier Platz im Jahr? Wählen Sie Art der Fläche, Monatsmiete und Anzahl der Plätze.', eltern: 'werkzeuge', verwandt: ['vermieten', 'preise'] },
  einwinterung: { einleitung: 'Schritt für Schritt: So machen Sie Wohnmobil, Wohnwagen oder Oldtimer winterfest.', eltern: 'werkzeuge', verwandt: ['winterplatzVergleich', 'mieten'] },
  strassenCheck: { einleitung: 'Passt Ihr Wohnwagen durch die Zufahrt? Breite, Höhe und Gewicht vorab prüfen.', eltern: 'werkzeuge', verwandt: ['einwinterung', 'mieten'] },
  winterplatzVergleich: { einleitung: 'Halle, Scheune, Carport oder Garage: Welcher Platz passt zu Ihrem Fahrzeug?', eltern: 'werkzeuge', verwandt: ['einwinterung', 'mieten'] },
  regionen: { einleitung: 'Wir vermitteln zuerst im Landkreis Böblingen, zum Beispiel in Böblingen, Sindelfingen, Herrenberg, Leonberg, Holzgerlingen und Weil der Stadt.', verwandt: ['mieten', 'vermieten'] },
  nachfrage: { einleitung: 'Wo im Landkreis Böblingen gerade Plätze gesucht werden.', eltern: 'vermieten', verwandt: ['vermieten', 'verdienstrechner'] },
  hilfe: { einleitung: 'Antworten auf häufige Fragen – und ein persönlicher Ansprechpartner, wenn etwas offen bleibt.', verwandt: ['kontakt', 'soFunktionierts'] },
  soFunktionierts: { einleitung: 'Vom Suchauftrag bis zum Vertrag: So läuft die Vermittlung für Mieter und Vermieter.', verwandt: ['mieten', 'vermieten'] },
  sicherheit: { einleitung: 'Geprüfte Mieter, Mustervertrag, Kaution und Fotos bei Ein- und Auszug.', verwandt: ['vermieten', 'preise'] },
  preise: { einleitung: 'Für Vermieter immer kostenlos. Mieter zahlen einen festen Monatspreis inklusive Servicegebühr.', verwandt: ['mieten', 'vermieten'] },
  ueberUns: { einleitung: 'Nachbarn helfen sich: ungenutzter Platz gegen einen fairen Nebenverdienst.', verwandt: ['soFunktionierts', 'kontakt'] },
  kontakt: { einleitung: 'Ihr Ansprechpartner im Landkreis Böblingen – per Telefon oder WhatsApp.', verwandt: ['hilfe'] },
  agb: { einleitung: 'Die Allgemeinen Geschäftsbedingungen werden vor dem Start veröffentlicht.', verwandt: ['impressum', 'datenschutz'] },
};
