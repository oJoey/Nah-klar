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

import optionen from '../../src/data/optionen.json' with { type: 'json' };

// Beschriftungen für die Mail – Feldnamen wie in den Formularen (= spätere Datenbankspalten).
const BESCHRIFTUNG = {
  mieter_art: 'Was', laenge_max: 'Länge', hoehe_max: 'Höhe', flaeche_max: 'Fläche', ort: 'Ort', umkreis_km: 'Umkreis',
  wuensche: 'Wünsche', budget_max: 'Budget pro Monat', ab_wann: 'Ab wann',
  flaechen_art: 'Art der Fläche', geeignet_fuer: 'Geeignet für', laenge_m: 'Länge (m)', breite_m: 'Breite (m)',
  durchfahrt_hoehe: 'Durchfahrtshöhe', flaeche_qm: 'Fläche (m²)', anzahl_plaetze: 'Anzahl Plätze', ausstattung: 'Ausstattung',
  wunschpreis: 'Wunschpreis pro Monat (€)', strasse: 'Straße', plz: 'PLZ',
  vorname: 'Vorname', nachname: 'Nachname', email: 'E-Mail', telefon: 'Telefon',
};
// Wert → Titel je Feld, aus src/data/optionen.json
const titelVon = (feld, wert) => (optionen[feld] || []).find((o) => o.wert === wert)?.titel || wert;
const anzeige = (feld, wert) => (Array.isArray(wert) ? wert : [wert]).map((w) => titelVon(feld, w)).join(', ');

const FORMULARE = {
  suchauftrag: {
    betreff: 'Ihr Suchauftrag ist angekommen',
    einleitung: 'vielen Dank für Ihren Suchauftrag. Wir gleichen ihn jetzt mit den gemeldeten Flächen ab.',
    schritte: [
      'Wir melden uns mit passenden Plätzen – mit Fotos, Preis und Ortsteil.',
      'Sie besichtigen den Platz und unterschreiben den Mustervertrag.',
      'Die Kaution zahlen Sie direkt an den Vermieter.',
    ],
    schluss: 'Wie schnell es geht, hängt von Ort und Art ab. Wir sagen Ihnen ehrlich, wie es in Ihrer Gegend aussieht.',
  },
  'flaeche-melden': {
    betreff: 'Ihre Fläche ist bei uns gemeldet',
    einleitung: 'vielen Dank, dass Sie Ihre Fläche anbieten. Für Vermieter ist unser Service immer kostenlos.',
    schritte: [
      'Wir prüfen Fotos und Angaben und melden uns bei Rückfragen.',
      'Wir schlagen Ihnen passende Mieter vor. Sie entscheiden, wer einzieht.',
      'Besichtigung, Mustervertrag, Kaution – dann läuft die Miete.',
    ],
    schluss: 'Ihre Adresse wird nicht veröffentlicht. Interessenten erfahren nur den Ortsteil.',
  },
  loeschanfrage: {
    betreff: 'Ihre Löschanfrage ist angekommen',
    einleitung: 'wir haben Ihre Löschanfrage erhalten und löschen Ihre Angaben in den nächsten Tagen.',
    schritte: [],
    schluss: 'Sie erhalten danach keine weiteren Vorschläge mehr.',
    ohneLoeschLink: true,
  },
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const istEmail = (s) => typeof s === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.trim());

export const handler = async (event) => {
  const { RESEND_API_KEY, MAIL_ABSENDER, MAIL_ANTWORT, NETLIFY_API_TOKEN } = process.env;
  const marke = process.env.MARKENNAME || 'Platz Kompass';
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
  const empfaenger = istEmail(daten.email) ? daten.email.trim() : null;
  if (!vorlage || !empfaenger) return { statusCode: 200, body: 'keine Mail nötig' };

  // Mehrfachauswahl kommt als „feld[]“ an
  const wert = (k) => daten[k] ?? daten[`${k}[]`];
  const zeilen = vorlage.schritte.length
    ? Object.entries(BESCHRIFTUNG).filter(([k]) => wert(k) && String(wert(k)).length).map(([k, titel]) => [titel, anzeige(k, wert(k))])
    : [];
  const anrede = daten.vorname ? `Guten Tag ${daten.vorname},` : 'Guten Tag,';
  const seite = (process.env.URL || '').replace(/\/$/, '');
  const loeschLink = vorlage.ohneLoeschLink || !seite ? '' : `${seite}/daten-loeschen/?email=${encodeURIComponent(empfaenger)}`;

  const mitAngaben = zeilen.length > 0;
  const text = [
    anrede, '', vorlage.einleitung,
    ...(mitAngaben ? ['', 'Ihre Angaben:', ...zeilen.map(([t, w]) => `- ${t}: ${w}`), '', 'So geht es weiter:', ...vorlage.schritte.map((s, i) => `${i + 1}. ${s}`)] : []),
    '', vorlage.schluss,
    ...(loeschLink ? ['', `Suchauftrag bzw. Angaben löschen: ${loeschLink}`] : []),
    '', 'Freundliche Grüße', marke,
  ].join('\n');

  const html = `<div style="font-family:Arial,sans-serif;font-size:17px;line-height:1.6;color:#1a1f2b;max-width:560px">
<p>${esc(anrede)}</p><p>${esc(vorlage.einleitung)}</p>
${mitAngaben ? `<p><strong>Ihre Angaben:</strong></p>
<table style="border-collapse:collapse">${zeilen.map(([t, w]) => `<tr><td style="padding:4px 12px 4px 0;color:#485063">${esc(t)}</td><td style="padding:4px 0">${esc(w)}</td></tr>`).join('')}</table>
<p><strong>So geht es weiter:</strong></p><ol>${vorlage.schritte.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}
<p>${esc(vorlage.schluss)}</p><p>Freundliche Grüße<br>${esc(marke)}</p>
${loeschLink ? `<p style="font-size:14px;color:#485063"><a href="${esc(loeschLink)}" style="color:#485063">Suchauftrag bzw. Angaben löschen</a></p>` : ''}</div>`;

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
