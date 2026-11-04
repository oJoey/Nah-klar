// Zentrale Angaben zur Marke. Platzhalter in eckigen Klammern vor dem Livegang ersetzen.
export const site = {
  // Marke und Domain: nur hier ändern, alle Seiten, Mails und die Sitemap übernehmen es.
  name: 'nahklar',
  // [DOMAIN]: muss eine gültige Adresse sein, deshalb hier ein Ersatzwert.
  url: 'https://www.domain-eintragen.de',
  beschreibung:
    'Die Plattform, die Mieter und Vermieter zusammenbringt: private Abstellplätze für Wohnmobil und Wohnwagen sowie Lagerräume im Raum Stuttgart und Böblingen.',
  region: 'Stuttgart und Böblingen',
  regionIn: 'im Raum Stuttgart und Böblingen', // für Sätze wie „Platz im Raum …“
  bundesland: 'Baden-Württemberg',
  ansprechpartner: 'Ihr persönlicher Ansprechpartner',

  // Kontakt nur per WhatsApp und E-Mail, kein Telefon. WhatsApp braucht eine Mobilnummer.
  // BEISPIELNUMMER: vor dem Livegang an beiden Stellen durch die echte Mobilnummer ersetzen.
  whatsappAnzeige: '0151 23456789',
  whatsappNummer: '4915123456789', // 49…, ohne + und Leerzeichen
  email: '[EMAIL]', // Kontaktadresse, z. B. hallo@deine-domain.de

  // Wie schnell wir uns nach einer Anfrage melden. Bitte nur eintragen, was Sie sicher einhalten.
  antwortzeit: 'innerhalb von zwei Werktagen',

  // GEBÜHREN: Sätze in src/config/gebuehren.ts. Rangfolge: zahlungLive vor servicegebuehrManuell. Texte in src/lib/texte.ts.
  // Stripe Connect: true = Servicegebühr im Gesamtpreis, Miete per Lastschrift eingezogen und ausgezahlt.
  // Erst auf true setzen, wenn Lastschrift und Auszahlung tatsächlich laufen.
  zahlungLive: false,
  // Übergang ohne Stripe: Mieter zahlen die Miete direkt an den Vermieter und die Servicegebühr (10 %) monatlich an uns. Mieter sehen trotzdem immer den Gesamtpreis.
  servicegebuehrManuell: true,
  // Kleinunternehmer nach § 19 UStG: keine Umsatzsteuer auf die Gebühren.
  // Auf false setzen, wenn die Grenze überschritten wird (25.000 € Umsatz im Vorjahr bzw. 100.000 € im laufenden Jahr) → 19 % USt.
  kleinunternehmer: true,
  // Vertrag digital per Klick unterschreiben. Erst auf true setzen, wenn es das wirklich gibt. Vorher: Mustervertrag zum Unterschreiben.
  vertragDigital: false,

  // Prüfung der Mieter (Ausweis, Fahrzeugschein, Versicherung). Erst auf true setzen, wenn Sie das wirklich bei jedem Mieter machen.
  mieterPruefung: false,

  // Bestätigungsmail nach dem Absenden (Resend). Erst auf true setzen, wenn RESEND_API_KEY und Domain eingerichtet sind.
  // vorher verspricht die Danke-Seite keine Mail.
  bestaetigungsmail: false,

  // Umami Cloud (ohne Cookies). websiteId leer lassen = keine Statistik, auch kein Abschnitt in der Datenschutzerklärung.
  // websiteId und skript aus Umami: Settings → Websites → Edit → Tracking code. Bei der Anmeldung Datenregion EU wählen.
  umami: {
    websiteId: '',
    skript: 'https://cloud.umami.is/script.js',
    region: 'EU', // nur für den Text in der Datenschutzerklärung, muss zur Auswahl im Umami-Konto passen
    respektiereDnt: true, // Besucher mit „Do Not Track“ werden nicht gezählt
  },
};

// Betreiber für Impressum, Datenschutzerklärung und AGB. [ECKIGE KLAMMERN] vor dem Livegang ersetzen.
export const betreiber = {
  name: '[VORNAME NACHNAME]', // bei Einzelunternehmen der volle Name, Marke allein reicht nicht
  zusatz: `${site.name}`, // erscheint als „Vorname Nachname, nahklar“
  strasse: '[STRASSE HAUSNUMMER]', // ladungsfähige Anschrift, kein Postfach
  plzOrt: '[PLZ ORT]',
  // Wirtschafts-Identifikationsnummer (§ 139c AO), sobald vom BZSt zugeteilt. Leer = Zeile entfällt.
  // Eine USt-IdNr. gibt es als Kleinunternehmer meist nicht.
  wirtschaftsId: '',
  ustId: '',
  // Nur ausfüllen, falls eine Erlaubnis nach § 34c GewO nötig ist (siehe docs/rechtstexte-pruefung.md).
  erlaubnis: { noetig: false, behoerde: '[ZUSTÄNDIGE BEHÖRDE, ANSCHRIFT]' },
};
export const betreiberAnschrift = `${betreiber.name}, ${betreiber.strasse}, ${betreiber.plzOrt}`;

export const whatsappLink = `https://wa.me/${site.whatsappNummer}`;
export const emailHref = `mailto:${site.email}`;
