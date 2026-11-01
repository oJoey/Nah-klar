// Zentrale Angaben zur Marke. Platzhalter in eckigen Klammern vor dem Livegang ersetzen.
export const site = {
  name: 'Platz Kompass', // Arbeitsname, wird später geändert
  // [DOMAIN]: muss eine gültige Adresse sein, deshalb hier ein Ersatzwert.
  url: 'https://www.domain-eintragen.de',
  beschreibung:
    'Privatleute in Baden-Württemberg vermieten ungenutzten Platz – Einfahrt, Hof, Scheune, Garage oder Keller – an Nachbarn mit Wohnmobil, Auto, Anhänger oder Lagergut.',
  region: 'Baden-Württemberg',
  regionIn: 'in Baden-Württemberg', // für Sätze wie „Platz in Baden-Württemberg“
  bundesland: 'Baden-Württemberg',
  ansprechpartner: 'Ihr persönlicher Ansprechpartner',

  // BEISPIELNUMMER: vor dem Livegang an allen drei Stellen durch die echte Mobilnummer ersetzen.
  telefonAnzeige: '07031 123456',
  telefonLink: '+497031123456', // im Format +49…, ohne Leerzeichen
  whatsappNummer: '497031123456', // für WhatsApp: 49…, ohne + und Leerzeichen
  email: '[EMAIL]', // Kontaktadresse, z. B. hallo@deine-domain.de

  // Wie schnell wir uns nach einer Anfrage melden. Bitte nur eintragen, was Sie sicher einhalten.
  antwortzeit: 'innerhalb von zwei Werktagen',

  // GEBÜHREN – Rangfolge: zahlungLive vor servicegebuehrManuell. Alle Texte dazu in src/lib/texte.ts.
  // Stripe Connect: true = Servicegebühr im Gesamtpreis, Miete per Lastschrift eingezogen und ausgezahlt.
  // Erst auf true setzen, wenn Lastschrift und Auszahlung tatsächlich laufen.
  zahlungLive: false,
  // Übergang ohne Stripe: Mieter zahlen die Miete direkt an den Vermieter und die Servicegebühr (ca. 10 %) monatlich an uns.
  servicegebuehrManuell: true,
  // Einmalige Vermittlungsgebühr für Mieter, fällig erst bei Vertragsabschluss.
  vermittlungsgebuehr: { aktiv: false, garageAutoLager: 19, wohnmobilAnhaengerBoot: 39 },
  // Startaktion: Vermittlungsgebühr entfällt. Endet automatisch nach dem Enddatum (Balken und Texte), auch ohne neuen Build.
  startaktion: { aktiv: true, ende: '2026-11-30', text: 'Startaktion: Bis 30.11. entfällt die Vermittlungsgebühr' },

  // Prüfung der Mieter (Ausweis, Fahrzeugschein, Versicherung). Erst auf true setzen, wenn Sie das wirklich bei jedem Mieter machen.
  mieterPruefung: false,

  // Bestätigungsmail nach dem Absenden (Resend). Erst auf true setzen, wenn RESEND_API_KEY und Domain eingerichtet sind –
  // vorher verspricht die Danke-Seite keine Mail.
  bestaetigungsmail: false,

  // Umami Cloud (ohne Cookies). Leer lassen = keine Statistik.
  umamiWebsiteId: '',
};

export const whatsappLink = `https://wa.me/${site.whatsappNummer}`;
export const telefonHref = `tel:${site.telefonLink}`;
export const emailHref = `mailto:${site.email}`;
