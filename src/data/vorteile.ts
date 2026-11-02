// Vorteile für Startseite und /vermieten/. Nur, was wirklich angeboten wird: Punkte hängen an den Schaltern in site.ts.
import { site } from '../config/site';

const vertrag = site.vertragDigital ? 'Vertrag digital per Klick' : 'Mustervertrag inklusive, schriftlich und klar';

export const mieterVorteile = [
  'Suchauftrag kostenlos',
  'Wir melden uns, sobald ein passender Platz frei ist',
  'Geprüfte Angaben zu Zufahrt, Maßen und Zugang',
  vertrag,
];

export const vermieterVorteile = [
  'Kein Abo und keine Kosten fürs Anbieten',
  site.zahlungLive ? 'Automatischer Monatseinzug, Auszahlung jeden Monat' : 'Volle Miete, Zahlungstermin im Vertrag geregelt',
  'Kaution geregelt: eine Monatsmiete, direkt an Sie',
  site.vertragDigital ? 'Vertrag digital per Klick' : 'Mustervertrag inklusive',
];

// Vertrauens-Symbole unter dem Suchfeld der Startseite
export const vertrauen = [
  { icon: 'schild', text: 'Geprüfte Plätze' },
  { icon: 'vertrag', text: 'Mustervertrag inklusive' },
  { icon: 'chat', text: 'Persönlicher Ansprechpartner' },
] as const;
