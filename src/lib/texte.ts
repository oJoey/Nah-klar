// Texte, die davon abhängen, ob die Zahlung über Stripe schon läuft (site.zahlungLive).
import { site } from '../config/site';
import { zahlung } from '../config/zahlung';

const live = site.zahlungLive;
const prozent = `${Math.round(zahlung.servicegebuehr * 100)} %`;

export const texte = {
  live,
  prozent,
  heroVersprechen: live
    ? 'Geprüfte Mieter, schriftlicher Vertrag, Miete automatisch per Lastschrift.'
    : 'Geprüfte Mieter, schriftlicher Vertrag, klare Regeln für Miete und Kaution.',
  erinnern: live ? 'erinnern wir automatisch' : 'erinnern wir den Mieter',
  serviceGarantie: `Bei offenen Zahlungen ${live ? 'erinnern wir automatisch' : 'erinnern wir den Mieter'}, wir stellen Vorlagen für die Kündigung bereit und suchen kostenlos einen neuen Mieter.`,
  zahlungKurz: live ? 'Automatische Zahlung' : 'Klare Zahlungsregeln',
  zahlungLang: live
    ? `Die Miete wird am ${zahlung.abbuchungTag}. des Monats per Lastschrift eingezogen und am ${zahlung.auszahlungTag}. an den Vermieter überwiesen.`
    : 'Höhe, Termin und Weg der Zahlung stehen im Mietvertrag – für beide Seiten nachlesbar.',
  zahlweiseMieter: live
    ? `Sie zahlen bequem per SEPA-Lastschrift, eingezogen am ${zahlung.abbuchungTag}. des Monats.`
    : 'Wie und wann Sie zahlen, steht in Ihrem Mietvertrag.',
  mieterSchritt4: live ? 'Vertrag und Lastschrift' : 'Vertrag unterschreiben',
  mieterSchritt4Text: live
    ? 'Sie unterschreiben den Mustervertrag und erteilen das Lastschriftmandat. Danach können Sie einziehen.'
    : 'Sie unterschreiben den Mustervertrag, zahlen die Kaution direkt an den Vermieter und können einziehen.',
  vermieterSchritt4Text: live
    ? `Sie unterschreiben den Vertrag. Die Miete kommt jeden Monat am ${zahlung.auszahlungTag}. auf Ihr Konto.`
    : 'Sie unterschreiben den Vertrag und erhalten die Kaution direkt vom Mieter.',
};

/** Ersetzt Platzhalter in Markdown-Texten (z. B. FAQ) durch aktuelle Werte. */
export function ersetze(text: string): string {
  return text
    .replaceAll('{NAME}', site.name)
    .replaceAll('{TELEFON}', site.telefonAnzeige)
    .replaceAll('{REGION}', site.region)
    .replaceAll('{IN_REGION}', site.regionIn)
    .replaceAll('{PROZENT}', prozent)
    .replaceAll('{KAUTION_MIN}', String(zahlung.kautionMinEuro))
    .replaceAll('{RUECKZAHLUNG_WOCHEN}', String(zahlung.kautionRueckzahlungWochen))
    .replaceAll('{SERVICEGARANTIE}', texte.serviceGarantie)
    .replaceAll('{ZAHLWEISE_MIETER}', texte.zahlweiseMieter);
}

const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Einfache Absätze mit Links [Text](/pfad/) – mehr Markdown brauchen die FAQ nicht. */
export function absaetze(text: string): string {
  return ersetze(text)
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p>${html(p.trim()).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')}</p>`)
    .join('');
}

/** Klartext ohne Link-Syntax, z. B. für das FAQPage-Schema. */
export const klartext = (text: string) =>
  ersetze(text).trim().replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s*\n\s*/g, ' ');

/** JSON-LD sicher in <script> einbetten. */
export const jsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c');
