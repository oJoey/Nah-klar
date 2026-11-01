// Zentrale Angaben zur Marke. Platzhalter in eckigen Klammern vor dem Livegang ersetzen.
export const site = {
  name: 'Platz Kompass', // Arbeitsname, wird später geändert
  // [DOMAIN]: muss eine gültige Adresse sein, deshalb hier ein Ersatzwert.
  url: 'https://www.domain-eintragen.de',
  beschreibung:
    'Privatleute in Baden-Württemberg vermieten ungenutzten Platz wie Einfahrt, Hof, Scheune, Garage oder Keller an Nachbarn mit Wohnmobil, Auto, Anhänger oder Lagergut.',
  region: 'Baden-Württemberg',
  regionIn: 'in Baden-Württemberg', // für Sätze wie „Platz in Baden-Württemberg“
  bundesland: 'Baden-Württemberg',
  ansprechpartner: 'Ihr persönlicher Ansprechpartner',

  // Kontakt nur per WhatsApp und E-Mail, kein Telefon. WhatsApp braucht eine Mobilnummer.
  // BEISPIELNUMMER: vor dem Livegang an beiden Stellen durch die echte Mobilnummer ersetzen.
  whatsappAnzeige: '0151 23456789',
  whatsappNummer: '4915123456789', // 49…, ohne + und Leerzeichen
  email: '[EMAIL]', // Kontaktadresse, z. B. hallo@deine-domain.de

  // Wie schnell wir uns nach einer Anfrage melden. Bitte nur eintragen, was Sie sicher einhalten.
  antwortzeit: 'innerhalb von zwei Werktagen',

  // GEBÜHREN. Rangfolge: zahlungLive vor servicegebuehrManuell. Alle Texte dazu in src/lib/texte.ts.
  // Stripe Connect: true = Servicegebühr im Gesamtpreis, Miete per Lastschrift eingezogen und ausgezahlt.
  // Erst auf true setzen, wenn Lastschrift und Auszahlung tatsächlich laufen.
  zahlungLive: false,
  // Übergang ohne Stripe: Mieter zahlen die Miete direkt an den Vermieter und die Servicegebühr (ca. 10 %) monatlich an uns.
  servicegebuehrManuell: true,
  // Kleinunternehmer nach § 19 UStG: keine Umsatzsteuer auf Service- und Vermittlungsgebühr.
  // Auf false setzen, wenn die Grenze überschritten wird (25.000 € Umsatz im Vorjahr bzw. 100.000 € im laufenden Jahr) → 19 % USt.
  kleinunternehmer: true,
  // Einmalige Vermittlungsgebühr für Mieter, fällig erst bei Vertragsabschluss. Wird nach der Startaktion erhoben (ab 01.02.2027).
  vermittlungsgebuehr: { aktiv: true, garageAutoLager: 19, wohnmobilAnhaengerBoot: 39 },
  // Startaktion: Vermittlungsgebühr entfällt. Endet automatisch nach dem Enddatum (Balken und Texte), auch ohne neuen Build.
  // Nur zusammen mit vermittlungsgebuehr.aktiv: true einschalten. Sonst wird mit dem Erlass einer Gebühr geworben, die es nicht gibt.
  startaktion: { aktiv: true, ende: '2027-01-31', text: 'Startaktion: Bis 31.01. entfällt die Vermittlungsgebühr' },

  // Prüfung der Mieter (Ausweis, Fahrzeugschein, Versicherung). Erst auf true setzen, wenn Sie das wirklich bei jedem Mieter machen.
  mieterPruefung: false,

  // Bestätigungsmail nach dem Absenden (Resend). Erst auf true setzen, wenn RESEND_API_KEY und Domain eingerichtet sind.
  // vorher verspricht die Danke-Seite keine Mail.
  bestaetigungsmail: false,

  // Umami Cloud (ohne Cookies). Leer lassen = keine Statistik.
  umamiWebsiteId: '',
};

export const whatsappLink = `https://wa.me/${site.whatsappNummer}`;
export const emailHref = `mailto:${site.email}`;
