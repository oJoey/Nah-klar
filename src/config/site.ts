// Zentrale Angaben zur Marke. Platzhalter in eckigen Klammern vor dem Livegang ersetzen.
export const site = {
  name: 'Platz Kompass', // Arbeitsname, wird später geändert
  // [DOMAIN]: muss eine gültige Adresse sein, deshalb hier ein Ersatzwert.
  url: 'https://www.domain-eintragen.de',
  beschreibung:
    'Privatleute im Landkreis Böblingen vermieten ungenutzten Platz – Einfahrt, Hof, Scheune, Garage oder Keller – an Nachbarn mit Wohnmobil, Auto, Anhänger oder Lagergut.',
  region: 'Landkreis Böblingen',
  bundesland: 'Baden-Württemberg',
  ansprechpartner: 'Ihr Ansprechpartner im Landkreis Böblingen',

  // [TELEFON]: Mobilnummer eintragen, z. B. Anzeige '0151 2345 6789', Link '+4915123456789', WhatsApp '4915123456789'
  telefonAnzeige: '[TELEFON]',
  telefonLink: '[TELEFON]', // im Format +49…, ohne Leerzeichen
  whatsappNummer: '[TELEFON]', // für WhatsApp: 49…, ohne + und Leerzeichen

  // Wie schnell wir uns nach einer Anfrage melden. Bitte nur eintragen, was Sie sicher einhalten.
  antwortzeit: 'innerhalb von zwei Werktagen',

  // Stripe Connect: erst auf true setzen, wenn Lastschrift und Auszahlung tatsächlich laufen.
  // Solange false, versprechen die Texte nichts Automatisches.
  zahlungLive: false,

  // Umami Cloud (ohne Cookies). Leer lassen = keine Statistik.
  umamiWebsiteId: '',
};

export const whatsappLink = `https://wa.me/${site.whatsappNummer}`;
export const telefonHref = `tel:${site.telefonLink}`;
