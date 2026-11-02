// Texte, die davon abhängen, ob die Zahlung über Stripe schon läuft (site.zahlungLive).
import { site } from '../config/site';
import { zahlung } from '../config/zahlung';

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
    ? `Die Miete wird am ${zahlung.abbuchungTag}. des Monats per Lastschrift eingezogen und am ${zahlung.auszahlungTag}. an den Vermieter überwiesen.`
    : 'Höhe, Termin und Weg der Zahlung stehen im Mietvertrag, für beide Seiten nachlesbar.',
  zahlweiseMieter: live
    ? `Sie zahlen bequem per SEPA-Lastschrift, eingezogen am ${zahlung.abbuchungTag}. des Monats.`
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
  steuer: live
    ? 'Sie erhalten jedes Jahr eine Übersicht Ihrer Einnahmen. Als Plattform, über die die Miete läuft, sind wir gesetzlich verpflichtet, Vermieter und Einnahmen jährlich an das Bundeszentralamt für Steuern zu melden. Eine Steuerberatung bieten wir nicht an.'
    : 'Einnahmen aus der Vermietung sind grundsätzlich steuerpflichtig. Eine Steuerberatung bieten wir nicht an.',
  servicegebuehr,
  // Hinweis zur Umsatzsteuer für Preisangaben und Rechnungen
  ustHinweis: site.kleinunternehmer
    ? 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'
    : 'Alle Gebühren inklusive 19 % Umsatzsteuer.',
  vermieterKosten: servicegebuehr
    ? `Nichts. ${site.name} ist für Vermieter immer kostenlos, Sie erhalten die volle vereinbarte Miete. Die Servicegebühr zahlt der Mieter mit seinem Monatspreis.`
    : `Nichts. ${site.name} ist für Vermieter immer kostenlos, Sie erhalten die volle vereinbarte Miete.`,
  // Vollständige Erklärung nur hier (FAQ „Was kostet die Miete?“, Preise-Seite). Sonst nur den Gesamtpreis nennen.
  mieterKosten: servicegebuehr
    ? `Sie sehen bei jedem Vorschlag einen festen Monatspreis. Darin ist unsere Servicegebühr von ${prozent} enthalten. Vor dem Abschluss zeigen wir Ihnen genau, wie sich der Preis zusammensetzt.`
    : 'Sie sehen bei jedem Vorschlag einen festen Monatspreis. Er steht im Mietvertrag, den Sie mit dem Vermieter schließen.',
  // Kurzform ohne Gebührendetails, z. B. für /mieten/ und /so-funktionierts/
  mieterPreisKurz: 'Bei jedem Vorschlag sehen Sie einen festen Monatspreis. Vor dem Abschluss zeigen wir Ihnen, wie er sich zusammensetzt.',
  servicegebuehrZweck: 'für Vertragsvorlage, Abwicklung und Betreuung',
  // Hinweis unter der Aufschlüsselung: wohin welches Geld geht
  zahlungsweg: live
    ? 'Miete und Servicegebühr werden zusammen als ein Betrag per SEPA-Lastschrift eingezogen. Die Kaution zahlen Sie direkt an den Vermieter.'
    : 'Die Miete zahlen Sie an den Vermieter, die Servicegebühr an uns. Die Kaution zahlen Sie direkt an den Vermieter.',
};

const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---- Abschlussgebühr und Startaktion (abhängig vom Datum). Schalter in site.ts heißt intern vermittlungsgebuehr. ----
const v = site.vermittlungsgebuehr;
/** Letzter Moment der Startaktion (Ende des Tages, deutsche Zeit). */
export const aktionsEnde = new Date(`${site.startaktion.ende}T23:59:59+01:00`);
export const startaktionLaeuft = (jetzt = new Date()) => site.startaktion.aktiv && jetzt <= aktionsEnde;
const tagMonat = aktionsEnde.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', timeZone: 'Europe/Berlin' });
const beide = `${v.garageAutoLager} € (Garage, Auto, Lager) bzw. ${v.wohnmobilAnhaengerBoot} € (Wohnmobil, Wohnwagen, Anhänger, Boot)`;
/** Betrag für eine Mieter-Art (mieter_art aus optionen.json). */
export const abschlussBetrag = (art?: string) => (art === 'wohnmobil-wohnwagen' || art === 'anhaenger-boot' ? v.wohnmobilAnhaengerBoot : v.garageAutoLager);

/** Satz zur Abschlussgebühr zum Zeitpunkt „jetzt“. Leer, wenn sie nicht erwähnt werden soll. Mit art nur der passende Betrag. */
export function abschlussText(jetzt = new Date(), art?: string): string {
  const betrag = art ? `${abschlussBetrag(art)} €` : beide;
  if (startaktionLaeuft(jetzt)) return `Einmalige Abschlussgebühr: ${betrag}, fällig erst bei Vertragsabschluss. Bis ${tagMonat} entfällt sie.`;
  if (v.aktiv) return `Einmalige Abschlussgebühr: ${betrag}, nur fällig, wenn Sie einen Mietvertrag abschließen.`;
  return '';
}

/** Für statische Seiten: beide Fassungen ausgeben, ein Skript im Layout schaltet am Enddatum um (ohne neuen Build). */
export function abschlussHtml(art?: string): string {
  const jetzt = abschlussText(new Date(), art);
  if (!startaktionLaeuft()) return jetzt ? html(jetzt) : '';
  const danach = abschlussText(new Date(aktionsEnde.getTime() + 1000), art);
  const bis = aktionsEnde.toISOString();
  return `<span data-aktion-bis="${bis}">${html(jetzt)}</span>` + (danach ? `<span data-aktion-ab="${bis}" hidden>${html(danach)}</span>` : '');
}

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
    .replaceAll('{STEUER}', texte.steuer)
    .replaceAll('{VERMIETER_KOSTEN}', texte.vermieterKosten)
    .replaceAll('{MIETER_KOSTEN}', texte.mieterKosten)
    .replaceAll('{ZAHLWEISE_MIETER}', texte.zahlweiseMieter);
}


/** Einfache Absätze mit Links [Text](/pfad/). Mehr Markdown brauchen die FAQ nicht. */
export function absaetze(text: string): string {
  return ersetze(text)
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p>${html(p.trim()).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>').replace('{ABSCHLUSS}', abschlussHtml())}</p>`)
    .filter((p) => p !== '<p></p>')
    .join('');
}

/** Klartext ohne Link-Syntax, z. B. für das FAQPage-Schema. */
export const klartext = (text: string) =>
  ersetze(text).replace('{ABSCHLUSS}', abschlussText()).trim().replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s*\n\s*/g, ' ');

/** JSON-LD sicher in <script> einbetten. */
// ---- Preisaufschlüsselung vor dem Abschluss (Vorschlag, Vertragsbestätigung, später Checkout) ----
export type PreisZeile = { titel: string; betrag: string; summe?: boolean; nebenbei?: boolean };
const euro = (n: number) => `${n.toLocaleString('de-DE')} €`;

/** Zeilen der Aufschlüsselung. Gesamtpreis = Miete + Servicegebühr. Die Abschlussgebühr hängt vom Datum ab (Startaktion). */
export function aufschluesselung(miete: number, art?: string, jetzt = new Date()): PreisZeile[] {
  const gebuehr = servicegebuehr ? Math.round(miete * zahlung.servicegebuehr) : 0;
  const zeilen: PreisZeile[] = [{ titel: 'Miete', betrag: euro(miete) }];
  if (gebuehr) zeilen.push({ titel: `Servicegebühr (${prozent})`, betrag: euro(gebuehr) });
  zeilen.push({ titel: 'Gesamt pro Monat', betrag: euro(miete + gebuehr), summe: true });
  if (v.aktiv) {
    const b = abschlussBetrag(art);
    zeilen.push({ titel: 'Einmalige Abschlussgebühr', betrag: startaktionLaeuft(jetzt) ? `entfällt bis ${tagMonat} (sonst ${euro(b)})` : euro(b) });
  }
  zeilen.push({ titel: 'Kaution an den Vermieter', betrag: `${euro(Math.max(miete, zahlung.kautionMinEuro))} (separat, direkt an den Vermieter)`, nebenbei: true });
  return zeilen;
}

/** Gesamtpreis pro Monat als Text, z. B. „77 € im Monat“. So erscheint jeder Preis für Mieter. */
export const gesamtpreisText = (miete: number) => `${euro(miete + (servicegebuehr ? Math.round(miete * zahlung.servicegebuehr) : 0))} im Monat`;

/** Aufschlüsselung als Klartext für E-Mail und WhatsApp. */
export const aufschluesselungText = (miete: number, art?: string, jetzt = new Date()) =>
  aufschluesselung(miete, art, jetzt).map((z) => `${z.titel}: ${z.betrag}`).join('\n') + `\n\n${texte.zahlungsweg}`;

export const jsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c');
