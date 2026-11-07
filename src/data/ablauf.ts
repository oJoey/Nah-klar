// Ablauf für Mieter und Vermieter. Genutzt auf /mieten/, /vermieten/ und /so-funktionierts/.
import { texte } from '../lib/texte';

export const mieterSchritte = [
  { titel: 'Platz finden', text: 'Suchen Sie nach Ort, Umkreis und Maßen. Nichts dabei? Ein Suchauftrag ist kostenlos und unverbindlich.' },
  { titel: 'Besichtigung anfragen', text: 'Mit Fotos, Ortsteil und festem Preis im Inserat. Die Adresse erfahren Sie, sobald der Termin steht.' },
  { titel: 'Besichtigen', text: 'Sie schauen sich den Platz in Ruhe an und lernen den Vermieter kennen.' },
  { titel: texte.mieterSchritt4, text: texte.mieterSchritt4Text },
];

export const vermieterSchritte = [
  { titel: 'Platz anbieten', text: 'In wenigen Schritten, mit ein paar Fotos. Preis und Mietart legen Sie selbst fest.' },
  { titel: 'Prüfung', text: 'Wir prüfen Ihre Angaben und schalten das Inserat frei.' },
  { titel: 'Besichtigung', text: 'Interessenten fragen eine Besichtigung an. Sie lernen sie kennen und entscheiden selbst.' },
  { titel: 'Vermieten', text: texte.vermieterSchritt4Text },
];
