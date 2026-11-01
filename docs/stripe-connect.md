# Stripe Connect – Plan

**Status: geplant, noch nicht gebaut.** Muss fertig und getestet sein, bevor der erste Mieter vermittelt wird.
Bis dahin: `zahlungLive: false`, Servicegebühr manuell (`servicegebuehrManuell: true`).

## Geldflüsse

| Was | Wer zahlt | Wie | Wohin |
|---|---|---|---|
| Kaution (1 Monatsmiete, mind. 50 €) | Mieter | direkt, außerhalb von Stripe | Vermieter |
| Monatspreis = Miete + ca. 10 % Servicegebühr | Mieter | SEPA-Lastschrift, Stripe-Abo, Einzug am 1. | Plattformkonto |
| Miete (100 %) | Plattform | Stripe Transfer am 15. | Express-Konto des Vermieters → dessen Bankkonto |
| Vermittlungsgebühr 19 €/39 € (**vorerst nicht erhoben**, `vermittlungsgebuehr.aktiv: false`) | Mieter | einmalig mit der ersten Abbuchung | Plattformkonto |

## 1. Vermieter-Onboarding (Stripe Express)

- Express-Konto erst anlegen, **wenn ein Mieter feststeht** (vor Vertragsunterschrift). Vorher braucht der Vermieter keine Ausweisdaten.
- Ablauf: Netlify Function legt `accounts.create({ type: 'express', country: 'DE', capabilities: { transfers } })` an → `accountLinks.create` → Link per Mail/WhatsApp an den Vermieter → Stripe prüft Identität und Bankkonto.
- Webhook `account.updated`: erst wenn `payouts_enabled` true ist, wird das Mietverhältnis aktiviert.
- Kosten laut Stripe-Preisliste für Connect prüfen (pro aktivem Konto und Monat sowie je Auszahlung).

## 2. Mieter: Monatsabo per SEPA

- Stripe Checkout im Modus `subscription` mit Zahlungsart `sepa_debit`: erteilt das Lastschriftmandat, legt Customer und Abo an.
- Preis je Mietverhältnis: Monatspreis = Miete × 1,10 (gerundet), als eigener Price oder `price_data`.
- **Erster Teilmonat anteilig nach Tagen**, ab dem 1. des Folgemonats regulär: `billing_cycle_anchor` = 1. des Folgemonats, `proration_behavior: 'create_prorations'`. Beispiel: Beginn am 20. eines 30-Tage-Monats → 11/30 des Monatspreises.
- Die Kaution ist davon unabhängig und geht direkt an den Vermieter.
- Kündigung: `cancel_at_period_end`, Frist laut `zahlung.kuendigungsfristMonate`.

## 3. Separate Charges and Transfers

- Abbuchung am 1. aufs Plattformkonto (Merchant of Record ist die Plattform).
- SEPA braucht einige Werktage bis „succeeded“ – deshalb Überweisung erst am **15.**
- Geplante Netlify Function (Scheduled Function, monatlich am 15.): für jede **bezahlte** Rechnung des Monats `transfers.create({ amount: Miete, destination: acct_…, source_transaction: ch_…, transfer_group: mietverhaeltnis_id })`.
- `source_transaction` bindet den Transfer an die Zahlung: nicht eingegangenes Geld wird nicht ausgezahlt.

## 4. Vermittlungsgebühr (vorerst nicht erhoben – nur bauen, wenn `vermittlungsgebuehr.aktiv` kommt)

- Als einmaliger Posten auf der ersten Rechnung (`add_invoice_items` im Checkout/Abo), Betrag nach `mieter_art` (19 € bzw. 39 €).
- Während der Startaktion weglassen (Datum aus `site.startaktion` prüfen – dieselbe Logik wie `startaktionLaeuft()` in `texte.ts`).

## 5. Webhooks (`netlify/functions/stripe-webhook.mjs`, Signatur mit `STRIPE_WEBHOOK_SECRET`)

| Ereignis | Reaktion |
|---|---|
| `checkout.session.completed` | Mietverhältnis auf „aktiv“, Customer- und Abo-ID speichern |
| `invoice.paid` | Zahlung für den Transfer am 15. vormerken |
| `invoice.payment_failed` | Mail an Mieter (Erinnerung), Info an uns; Stripe versucht erneut (Smart Retries) |
| `charge.dispute.created` | **SEPA-Rücklastschrift**: Betrag mit der nächsten Auszahlung an diesen Vermieter verrechnen, Vermieter informieren, Mieter für neue Buchungen sperren (siehe Rücklastschriften) |
| `customer.subscription.deleted` | Mietverhältnis beendet |
| `account.updated` | Onboarding des Vermieters abgeschlossen? |

## Daten (Supabase, EU)

Tabelle `mietverhaeltnisse`: `id`, `flaeche_id`, `suchauftrag_id`, `miete`, `monatspreis`, `vermittlungsgebuehr`, `beginn`, `ende`, `status`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_account_id` (Vermieter). Zusätzlich `zahlungen` mit Rechnungs-, Charge- und Transfer-ID je Monat – Grundlage für Jahresübersicht und DAC7.

## Rücklastschriften nach der Auszahlung (entschieden)

- **Das Risiko trägt der Vermieter** – er hat den Anspruch gegen den Mieter.
- Fester Auszahlungstag am **15.** bleibt: Er fängt die meisten Rücklastschriften wegen fehlender Deckung vor der Auszahlung ab.
- Ablauf bei Rücklastschrift nach Auszahlung:
  1. Betrag wird **automatisch mit der nächsten Auszahlung** an diesen Vermieter verrechnet (Transfer um den Betrag gekürzt, Vermerk in `zahlungen`).
  2. Vermieter wird per Mail informiert (Betrag, Monat, Mieter).
  3. Mieter wird **für neue Buchungen gesperrt** (`suchauftraege`/`mietverhaeltnisse`: Status `gesperrt`).
  4. Gibt es keine weitere Auszahlung zum Verrechnen: Betrag wird **beim Vermieter angefordert** (Zahlungsaufforderung per Mail mit IBAN).
- Technisch: offene Rückforderungen je Vermieter in einer Tabelle `verrechnungen` führen; die Scheduled Function am 15. zieht sie vom Transfer ab.

## DAC7 / Meldung an das BZSt (entschieden)

- **Vor dem ersten Geldfluss beim BZSt als meldende Plattformbetreiberin registrieren** (Plattformen-Steuertransparenzgesetz).
- **Jährliche Meldung bis 31.01.** für das Vorjahr.
- Pflichtangaben je Vermieter **vor der ersten Auszahlung**: Steuer-ID, Geburtsdatum, Adresse, IBAN.
  - Was Stripe beim Express-Onboarding schon erfasst (Name, Geburtsdatum, Adresse, Bankkonto), über die API übernehmen (`accounts.retrieve`) und speichern.
  - **Steuer-ID** über ein eigenes Pflichtfeld in einem Schritt vor der ersten Auszahlung (eigene Seite nach dem Onboarding). Ohne Steuer-ID keine Auszahlung.
- Grundlage der Meldung: Tabelle `zahlungen` (Einnahmen je Vermieter und Quartal, Gebühren).

## Umsatzsteuer (entschieden)

- **Kleinunternehmer nach § 19 UStG:** keine Umsatzsteuer auf Service- und Vermittlungsgebühr.
- Auf allen Rechnungen und Belegen der Hinweis: „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“ (Text zentral: `texte.ustHinweis`)
- Schalter `kleinunternehmer` in `src/config/site.ts`. Bei Überschreiten der Grenze (**25.000 € im Vorjahr bzw. 100.000 € im laufenden Jahr**) auf `false` → 19 % USt; Stripe Invoices dann mit Steuersatz 19 % (`tax_rates`) und Gesamtpreis inkl. USt.
- **Offen, selbst klären:** Stripe-Gebühren kommen von Stripe Payments Europe (Irland). Für solche Leistungen gilt das Reverse-Charge-Verfahren (§ 13b UStG), und nach unserem Verständnis greift die Kleinunternehmerregelung dafür nicht – d. h. auf die Stripe-Gebühren könnte trotzdem Umsatzsteuer anfallen, die gemeldet werden muss.

## Checkliste AGB und Mustervertrag

AGB und Mustervertrag erstelle ich selbst. Vor `zahlungLive: true` müssen die Texte diese Punkte abdecken:

1. **Empfangsvollmacht / Zahlungsweg:** Vermieter bevollmächtigt die Plattform, die Miete im eigenen Namen bzw. als Empfangsbote einzuziehen; Zahlung an die Plattform wirkt schuldbefreiend für den Mieter.
2. **SEPA-Lastschriftmandat:** Einzug am 1., Pre-Notification-Frist, Gesamtpreis (Miete + Servicegebühr) als ein Betrag.
3. **Auszahlungstermin:** Weiterleitung der vollen Miete am 15. des Monats, nur bei eingegangener Zahlung.
4. **Rücklastschriften:** Risiko beim Vermieter; Verrechnung mit der nächsten Auszahlung; Rückforderung, wenn keine Auszahlung mehr folgt; Sperre des Mieters; Kosten der Rücklastschrift trägt der Mieter.
5. **Zahlungsverzug des Mieters:** Erinnerung, Fristen, ab wann der Vermieter kündigen darf.
6. **Kündigung:** Fristen (`zahlung.kuendigungsfristMonate`), Ende des Abos, anteilige Erstattung ja/nein, Räumung.
7. **Gebühren:** Servicegebühr (ca. 10 %, im Gesamtpreis), ggf. Vermittlungsgebühr (nur bei Vertragsabschluss), Kleinunternehmer-Hinweis; Vermieter zahlt nichts.
8. **Erster Teilmonat:** anteilige Berechnung nach Tagen.
9. **Kaution:** direkt an den Vermieter, nicht über die Plattform; Rückzahlung und Abzüge.
10. **Rolle der Plattform:** Vermittler, nicht Vertragspartei des Mietvertrags; Haftung, Streitbeilegung.
11. **Datenweitergabe:** an Stripe (Zahlungsabwicklung) und an das BZSt (DAC7-Meldung).

## Vor dem Livegang (Aufgaben)

- **Domain festlegen** – Voraussetzung für Stripe (verlangt beim Einrichten eine Website mit Impressum).
- **Impressum und Datenschutz füllen** (`src/pages/impressum/`, `src/pages/datenschutz/`, danach `noindex` entfernen).
- **AGB und Mustervertrag selbst erstellen**, anhand der Checkliste oben.
- **BZSt:** Registrierung als Plattformbetreiber vor dem ersten Geldfluss.
- **Reverse Charge bei Stripe-Gebühren klären** (§ 13b UStG, siehe Umsatzsteuer).

## Reihenfolge beim Bau

1. Stripe-Konto (Testmodus), Connect-Plattformprofil (Express, Deutschland), Branding
2. Webhook-Funktion mit Signaturprüfung + Tests mit Stripe CLI
3. Onboarding-Link für Vermieter
4. Checkout für Mieter (SEPA-Test-IBANs), anteiliger erster Monat; Vermittlungsgebühr erst, wenn sie eingeführt wird
5. Seite für die Steuer-ID vor der ersten Auszahlung
6. Scheduled Function für Transfers am 15. inkl. Verrechnung von Rücklastschriften
7. Ein vollständiger Testmonat im Testmodus inkl. fehlgeschlagener Lastschrift und Rücklastschrift
8. Livegang: `zahlungLive: true`, `servicegebuehrManuell` bleibt egal (zahlungLive hat Vorrang)
