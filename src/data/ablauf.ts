// Ablauf für Mieter und Vermieter. Genutzt auf /mieten/, /vermieten/ und /so-funktionierts/.
import { texte } from '../lib/texte';

export const mieterSchritte = [
  { titel: 'Suchauftrag anlegen', text: 'Sie sagen uns Ort, Art und Zeitraum. Dauert eine Minute. Der Suchauftrag ist kostenlos und unverbindlich.' },
  { titel: 'Vorschlag erhalten', text: 'Mit Fotos, Ortsteil und festem Monatspreis. Die Adresse folgt zur Besichtigung.' },
  { titel: 'Besichtigen', text: 'Sie schauen sich den Platz in Ruhe an und lernen den Vermieter kennen.' },
  { titel: texte.mieterSchritt4, text: texte.mieterSchritt4Text },
];

export const vermieterSchritte = [
  { titel: 'Platz anbieten', text: 'In wenigen kurzen Schritten über unser Formular.' },
  { titel: 'Prüfung von Hand', text: 'Wir prüfen Fotos und Angaben und melden uns bei Rückfragen.' },
  { titel: 'Passende Mieter', text: 'Wir schlagen Ihnen Interessenten vor. Sie entscheiden, wer einzieht.' },
  { titel: 'Besichtigung und Vertrag', text: 'Sie lernen den Mieter kennen und unterschreiben den Mustervertrag.' },
  { titel: 'Miete erhalten', text: texte.vermieterSchritt4Text },
];
