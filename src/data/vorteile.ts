// Vorteile für Startseite und /vermieten/. Nur, was es wirklich gibt.
// Kaution, Mustervertrag, Mieteinzug, Mahnung und Zahlungsgarantie erst nennen, wenn sie existieren.

export const mieterVorteile = [
  'Vor der Besichtigung zahlen Sie nichts',
  'Suchauftrag kostenlos: Wir melden uns, sobald etwas frei wird',
  'Geprüfte Inserate mit Angaben zu Zufahrt, Maßen und Zugang',
  'Fester Preis pro Monat oder pro Saison',
];

export const vermieterVorteile = [
  'Kein Abo und keine Kosten fürs Anbieten',
  'Sie legen Preis, Mietart und Zeitraum selbst fest',
  'Ihre Adresse ist nicht öffentlich, nur der Ortsteil',
  'Sie lernen jeden Interessenten vorher kennen',
];

// Vertrauens-Symbole unter dem Suchfeld der Startseite
export const vertrauen = [
  { icon: 'schild', text: 'Geprüfte Inserate' },
  { icon: 'euro', text: 'Vor der Besichtigung zahlen Sie nichts' },
  { icon: 'chat', text: 'Persönlicher Ansprechpartner' },
] as const;
