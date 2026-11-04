// Texte, die davon abhängen, ob die Zahlung über Stripe schon läuft (site.zahlungLive).
import { site } from '../config/site';
import { zahlung, gesamtpreis } from '../config/zahlung';

const live = site.zahlungLive;
// Servicegebühr wird erhoben: über Stripe (live) oder im Übergang manuell. live hat Vorrang.
const gebuehrManuell = !live && site.servicegebuehrManuell;
const servicegebuehr = live || gebuehrManuell;
const prozent = `${Math.round(zahlung.servicegebuehr * 100)} %`;

export const texte = {
  live,
  prozent,
  heroVersprechen: live
    ? 'Jede Fläche von Hand geprüft, Mustervertrag, Miete automatisch per Lastschrift.'
    : 'Jede Fläche von Hand geprüft, Mustervertrag, klare Regeln für Miete und Kaution.',
  erinnern: live ? 'erinnern wir automatisch' : 'erinnern wir den Mieter',
  serviceGarantie: live
    ? 'Bei offenen Zahlungen erinnern wir automatisch, wir stellen Vorlagen für die Kündigung bereit und suchen kostenlos einen neuen Mieter.'
    : 'Bei Problemen mit der Zahlung helfen wir persönlich weiter, stellen Vorlagen für die Kündigung bereit und suchen kostenlos einen neuen Mieter.',
  zahlungKurz: live ? 'Automatische Zahlung' : 'Klare Zahlungsregeln',
  zahlungLang: live
    ? 'Die Miete wird über unseren Zahlungsdienstleister eingezogen und an den Vermieter ausgezahlt.'
    : 'Höhe, Termin und Weg der Zahlung stehen im Mietvertrag, für beide Seiten nachlesbar.',
  zahlweiseMieter: live
    ? 'Sie zahlen bequem über unseren Zahlungsdienstleister.'
    : 'Wie und wann Sie zahlen, steht in Ihrem Mietvertrag.',
  mieterSchritt4: live ? 'Vertrag und Lastschrift' : 'Vertrag unterschreiben',
  mieterSchritt4Text: live
    ? 'Sie unterschreiben den Mustervertrag und erteilen das Lastschriftmandat. Danach können Sie einziehen.'
    : 'Sie unterschreiben den Mustervertrag, zahlen die Kaution direkt an den Vermieter und können einziehen.',
  vermieterSchritt4Text: live
    ? 'Die Kaution erhalten Sie direkt vom Mieter, die Miete kommt jeden Monat automatisch auf Ihr Konto.'
    : 'Die Kaution erhalten Sie direkt vom Mieter, die Miete jeden Monat wie im Vertrag vereinbart.',
  // Alles, was eine Zahlungsabwicklung über uns voraussetzt, hängt an zahlungLive:
  zahlungPuenktlich: live
    ? 'Die Miete wird jeden Monat automatisch per Lastschrift eingezogen und an Sie ausgezahlt.'
    : 'Höhe, Termin und Weg der Zahlung stehen im Mietvertrag, für beide Seiten nachlesbar.',
  servicegebuehr,
  // Hinweis zur Umsatzsteuer für Preisangaben und Rechnungen
  ustHinweis: site.kleinunternehmer
    ? 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'
    : 'Alle Gebühren inklusive 19 % Umsatzsteuer.',
  vermieterKosten: servicegebuehr
    ? `Anbieten und Anfragen erhalten kostet Sie nichts. Sie legen fest, welchen Betrag Sie bekommen möchten. Die Servicegebühr zahlt der Mieter mit seinem Gesamtpreis.`
    : `Anbieten und Anfragen erhalten kostet Sie nichts. Sie legen fest, welchen Betrag Sie bekommen möchten.`,
  // Vollständige Erklärung nur hier (FAQ „Was kostet die Miete?“, Preise-Seite). Sonst nur den Gesamtpreis nennen.
  mieterKosten: servicegebuehr
    ? `Bei jedem Inserat sehen Sie einen festen Gesamtpreis pro Monat oder pro Saison. Darin ist unsere Servicegebühr von ${prozent} enthalten. Direkt vor der Zahlung zeigen wir Ihnen genau, wie sich der Preis zusammensetzt.`
    : 'Bei jedem Inserat sehen Sie einen festen Gesamtpreis pro Monat oder pro Saison.',
  // Kurzform ohne Gebührendetails, z. B. für /mieten/ und /so-funktionierts/
  mieterPreisKurz: 'Bei jedem Inserat sehen Sie einen festen Gesamtpreis. Direkt vor der Zahlung zeigen wir Ihnen, wie er sich zusammensetzt.',
  servicegebuehrZweck: 'für Vertragsvorlage, Abwicklung und Betreuung',
  // Hinweis unter der Aufschlüsselung: wohin welches Geld geht
  zahlungsweg: live
    ? 'Miete und Servicegebühr werden zusammen als ein Betrag per SEPA-Lastschrift eingezogen. Die Kaution zahlen Sie direkt an den Vermieter.'
    : 'Die Miete zahlen Sie an den Vermieter, die Servicegebühr an uns. Die Kaution zahlen Sie direkt an den Vermieter.',
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
    .replaceAll('{KAUTION_MIN}', String(zahlung.kautionMinEuro))
    .replaceAll('{RUECKZAHLUNG_WOCHEN}', String(zahlung.kautionRueckzahlungWochen))
    .replaceAll('{SERVICEGARANTIE}', texte.serviceGarantie)
    .replaceAll('{VERMIETER_KOSTEN}', texte.vermieterKosten)
    .replaceAll('{MIETER_KOSTEN}', texte.mieterKosten)
    .replaceAll('{ZAHLWEISE_MIETER}', texte.zahlweiseMieter);
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
  zeilen.push({ titel: 'Kaution an den Vermieter', betrag: `${euro(Math.max(miete, zahlung.kautionMinEuro))} (separat, direkt an den Vermieter)`, nebenbei: true });
  return zeilen;
}

/** Gesamtpreis pro Monat als Text, z. B. „77 € im Monat“. So erscheint jeder Preis für Mieter. */
export const gesamtpreisText = (miete: number) => `${euro(servicegebuehr ? gesamtpreis(miete) : miete)} im Monat`;

/** Aufschlüsselung als Klartext für E-Mail und WhatsApp. */
export const aufschluesselungText = (miete: number, zeitraum = 'Monat') =>
  aufschluesselung(miete, zeitraum).map((z) => `${z.titel}: ${z.betrag}`).join('\n') + `\n\n${texte.zahlungsweg}`;

export const jsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c');
