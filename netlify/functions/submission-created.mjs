// Bestätigungsmail per Resend. Netlify ruft diese Funktion nach jeder Formular-Einsendung
// automatisch auf (Ereignis „submission-created“).
//
// Umgebungsvariablen in Netlify (Site settings → Environment variables):
//   RESEND_API_KEY     API-Schlüssel von Resend
//   MAIL_ABSENDER      z. B. "[NAME] <hallo@[DOMAIN]>" (Domain muss bei Resend bestätigt sein)
//   MAIL_ANTWORT       optional: Antwortadresse
//   MARKENNAME         z. B. [NAME]
//   NETLIFY_API_TOKEN  Pflicht: damit prüfen wir, dass die Einsendung wirklich bei Netlify existiert.
//                      Ohne diese Prüfung könnte jeder die Funktion direkt aufrufen und Mails an fremde Adressen auslösen.

const BESCHRIFTUNG = {
  art: 'Art', ort: 'PLZ oder Ort', plz: 'PLZ', email: 'E-Mail', telefon: 'Telefon', kontakt: 'Telefon oder E-Mail',
  name: 'Name', zeitraum: 'Ab wann', umkreis: 'Umkreis (km)', budget: 'Budget pro Monat (€)', masse: 'Fahrzeugmaße',
  groesse: 'Größe oder Maße', wunschpreis: 'Wunschpreis pro Monat (€)',
};

const WERTE = {
  'wohnmobil-wohnwagen': 'Wohnmobil / Wohnwagen', 'garage-auto': 'Garage / Auto', lager: 'Lagerraum', 'anhaenger-boot': 'Anhänger / Boot',
  garage: 'Garage', einfahrt: 'Einfahrt / Stellplatz', 'keller-raum': 'Keller / Raum', 'scheune-hof': 'Scheune / Hof', sonstiges: 'Sonstiges',
  'ab-sofort': 'ab sofort', 'ab-herbst': 'ab Herbst', 'ueber-winter': 'über den Winter', ganzjaehrig: 'ganzjährig',
};

const FORMULARE = {
  suchauftrag: {
    betreff: 'Ihr Suchauftrag ist angekommen',
    einleitung: 'vielen Dank für Ihren Suchauftrag. Wir fragen jetzt in Ihrer Nähe nach.',
    schritte: [
      'Wir melden uns mit passenden Plätzen – mit Fotos, Preis und Ortsteil.',
      'Sie besichtigen den Platz und lernen den Vermieter kennen.',
      'Passt alles, unterschreiben Sie den Mustervertrag.',
    ],
    schluss: 'Wie schnell es geht, hängt von Ort und Art ab. Wir sagen Ihnen ehrlich, wie es in Ihrer Gegend aussieht. Ihre Angaben löschen wir jederzeit auf Wunsch – antworten Sie einfach auf diese Mail.',
  },
  'platz-anbieten': {
    betreff: 'Ihr Platz ist bei uns gemeldet',
    einleitung: 'vielen Dank, dass Sie Ihren Platz anbieten. Für Vermieter ist unser Service immer kostenlos.',
    schritte: [
      'Wir melden uns persönlich und besprechen Fläche, Preis und Ihre Wünsche.',
      'Falls noch nicht geschehen: Schicken Sie uns 3 Fotos (Zufahrt, Fläche, Eingang).',
      'Wir schlagen Ihnen geprüfte Mieter vor. Sie entscheiden, wer einzieht.',
    ],
    schluss: 'Fragen? Antworten Sie einfach auf diese Mail.',
  },
};
FORMULARE['platz-kurz'] = FORMULARE['platz-anbieten'];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const istEmail = (s) => typeof s === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.trim());

export const handler = async (event) => {
  const { RESEND_API_KEY, MAIL_ABSENDER, MAIL_ANTWORT, NETLIFY_API_TOKEN } = process.env;
  const marke = process.env.MARKENNAME || '[NAME]';
  if (!RESEND_API_KEY || !MAIL_ABSENDER || !NETLIFY_API_TOKEN) {
    console.log('Mailversand nicht eingerichtet – Umgebungsvariablen fehlen.');
    return { statusCode: 200, body: 'nicht eingerichtet' };
  }

  let id;
  try { id = JSON.parse(event.body || '{}').payload?.id; } catch { /* ungültig */ }
  if (!id) return { statusCode: 400, body: 'ungültig' };

  // Einsendung direkt bei Netlify abrufen – nur diesen Daten vertrauen wir.
  const r = await fetch(`https://api.netlify.com/api/v1/submissions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
  });
  if (!r.ok) return { statusCode: 403, body: 'unbekannte Einsendung' };
  const einsendung = await r.json();

  const vorlage = FORMULARE[einsendung.form_name];
  const daten = einsendung.data || {};
  const empfaenger = [daten.email, daten.kontakt].find(istEmail)?.trim();
  if (!vorlage || !empfaenger) return { statusCode: 200, body: 'keine Mail nötig' };

  const zeilen = Object.entries(BESCHRIFTUNG)
    .filter(([k]) => daten[k])
    .map(([k, titel]) => [titel, WERTE[daten[k]] || daten[k]]);
  const anrede = daten.name ? `Guten Tag ${daten.name},` : 'Guten Tag,';

  const text = [
    anrede, '', vorlage.einleitung, '', 'Ihre Angaben:',
    ...zeilen.map(([t, w]) => `- ${t}: ${w}`), '', 'So geht es weiter:',
    ...vorlage.schritte.map((s, i) => `${i + 1}. ${s}`), '', vorlage.schluss, '', 'Freundliche Grüße', marke,
  ].join('\n');

  const html = `<div style="font-family:Arial,sans-serif;font-size:17px;line-height:1.6;color:#1a1f2b;max-width:560px">
<p>${esc(anrede)}</p><p>${esc(vorlage.einleitung)}</p>
<p><strong>Ihre Angaben:</strong></p>
<table style="border-collapse:collapse">${zeilen.map(([t, w]) => `<tr><td style="padding:4px 12px 4px 0;color:#485063">${esc(t)}</td><td style="padding:4px 0">${esc(w)}</td></tr>`).join('')}</table>
<p><strong>So geht es weiter:</strong></p><ol>${vorlage.schritte.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
<p>${esc(vorlage.schluss)}</p><p>Freundliche Grüße<br>${esc(marke)}</p></div>`;

  const antwort = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: MAIL_ABSENDER,
      to: [empfaenger],
      ...(MAIL_ANTWORT ? { reply_to: MAIL_ANTWORT } : {}),
      subject: `${vorlage.betreff} – ${marke}`,
      text,
      html,
    }),
  });
  if (!antwort.ok) {
    console.error('Resend-Fehler', antwort.status, await antwort.text());
    return { statusCode: 502, body: 'Mailversand fehlgeschlagen' };
  }
  return { statusCode: 200, body: 'ok' };
};
