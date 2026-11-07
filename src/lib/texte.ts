// Texte, die von Schaltern abhängen. Grundsatz: Nur Leistungen nennen, die es wirklich gibt.
// Kaution, Mustervertrag, Mieteinzug, Mahnung und Zahlungsgarantie gibt es noch nicht und werden nicht erwähnt.
import { site } from '../config/site';
import { zahlung, gesamtpreis } from '../config/zahlung';

// Servicegebühr wird erhoben (Schalter in src/config/zahlung.ts, gleicher Schalter in der Datenbank)
const servicegebuehr = zahlung.servicegebuehrAktiv;
const prozent = `${Math.round(zahlung.servicegebuehr * 100)} %`;

export const texte = {
  prozent,
  servicegebuehr,
  mieterSchritt4: 'Buchen',
  mieterSchritt4Text: 'Passt der Platz, vereinbaren Sie die Miete mit dem Vermieter. Vor der Besichtigung zahlen Sie nichts.',
  vermieterSchritt4Text: 'Passt es für beide Seiten, vereinbaren Sie die Miete direkt mit dem Mieter.',
  // Hinweis zur Umsatzsteuer für Preisangaben
  ustHinweis: site.kleinunternehmer
    ? 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'
    : 'Alle Gebühren inklusive 19 % Umsatzsteuer.',
  vermieterKosten: 'Das Anbieten kostet Sie nichts. Sie legen fest, welchen Betrag Sie bekommen möchten.',
  // Vollständige Erklärung nur hier (FAQ „Was kostet die Miete?“, Preise-Seite). Sonst nur den Preis nennen.
  mieterKosten: servicegebuehr
    ? `Bei jedem Inserat sehen Sie einen festen Gesamtpreis pro Monat oder pro Saison. Darin ist unsere Servicegebühr von ${prozent} enthalten. Direkt vor der Zahlung zeigen wir Ihnen genau, wie sich der Preis zusammensetzt.`
    : 'Bei jedem Inserat sehen Sie einen festen Preis pro Monat oder pro Saison. Vor der Besichtigung zahlen Sie nichts.',
  mieterPreisKurz: servicegebuehr
    ? 'Bei jedem Inserat sehen Sie einen festen Gesamtpreis. Direkt vor der Zahlung zeigen wir Ihnen, wie er sich zusammensetzt.'
    : 'Bei jedem Inserat sehen Sie einen festen Preis pro Monat oder pro Saison.',
  // Kurzer Satz unter Preisen (Suche, Detailseite)
  preisHinweis: servicegebuehr ? 'Gesamtpreis inklusive Servicegebühr.' : 'Endpreis, ohne weitere Gebühren.',
  zahlungsweg: 'Die Zahlung läuft über unseren Zahlungsdienstleister.',
};

const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Ersetzt Platzhalter in Markdown-Texten (z. B. FAQ) durch aktuelle Werte. */
export function ersetze(text: string): string {
  return text
    .replaceAll('{NAME}', site.name)
    .replaceAll('{WHATSAPP}', site.whatsappAnzeige)
    .replaceAll('{REGION}', site.region)
    .replaceAll('{IN_REGION}', site.regionIn)
    .replaceAll('{EMAIL}', site.email)
    .replaceAll('{MIETER_PRUEFUNG}', site.mieterPruefung
      ? 'Vor der Besichtigung prüfen wir jeden Mieter: Ausweis, bei Fahrzeugen auch Fahrzeugschein und Nachweis der Kfz-Versicherung.'
      : 'Sie lernen jeden Interessenten bei der Besichtigung kennen und entscheiden selbst, ob Sie vermieten.')
    .replaceAll('{PROZENT}', prozent)
    .replaceAll('{VERMIETER_KOSTEN}', texte.vermieterKosten)
    .replaceAll('{MIETER_KOSTEN}', texte.mieterKosten);
}


/** Einfache Absätze mit Links [Text](/pfad/). Mehr Markdown brauchen die FAQ nicht. */
export function absaetze(text: string): string {
  return ersetze(text)
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p>${html(p.trim()).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')}</p>`)
    .filter((p) => p !== '<p></p>')
    .join('');
}

/** Klartext ohne Link-Syntax, z. B. für das FAQPage-Schema. */
export const klartext = (text: string) =>
  ersetze(text).trim().replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s*\n\s*/g, ' ');

/** JSON-LD sicher in <script> einbetten. */
// ---- Preisaufschlüsselung vor dem Abschluss (Vorschlag, Vertragsbestätigung, später Checkout) ----
export type PreisZeile = { titel: string; betrag: string; summe?: boolean; nebenbei?: boolean };
const euro = (n: number) => `${n.toLocaleString('de-DE')} €`;

/** Zeilen der Aufschlüsselung (nur direkt vor der Zahlung zeigen). Gesamtpreis = Miete + Servicegebühr, aufgerundet. */
export function aufschluesselung(miete: number, zeitraum = 'Monat'): PreisZeile[] {
  const gesamt = servicegebuehr ? gesamtpreis(miete) : miete;
  const zeilen: PreisZeile[] = [{ titel: 'Miete', betrag: euro(miete) }];
  if (gesamt > miete) zeilen.push({ titel: `Servicegebühr (${prozent}, aufgerundet)`, betrag: euro(Math.round((gesamt - miete) * 100) / 100) });
  zeilen.push({ titel: `Gesamt pro ${zeitraum}`, betrag: euro(gesamt), summe: true });
  return zeilen;
}

/** Gesamtpreis pro Monat als Text, z. B. „77 € im Monat“. So erscheint jeder Preis für Mieter. */
export const gesamtpreisText = (miete: number) => `${euro(servicegebuehr ? gesamtpreis(miete) : miete)} im Monat`;

/** Aufschlüsselung als Klartext für E-Mail und WhatsApp. */
export const aufschluesselungText = (miete: number, zeitraum = 'Monat') =>
  aufschluesselung(miete, zeitraum).map((z) => `${z.titel}: ${z.betrag}`).join('\n') + `\n\n${texte.zahlungsweg}`;

export const jsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c');
