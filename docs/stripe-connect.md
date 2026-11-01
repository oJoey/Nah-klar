# Stripe Connect – Plan

**Status: geplant, noch nicht gebaut.** Muss fertig und getestet sein, bevor der erste Mieter vermittelt wird.
Bis dahin: `zahlungLive: false`, Servicegebühr manuell (`servicegebuehrManuell: true`).

## Geldflüsse

| Was | Wer zahlt | Wie | Wohin |
|---|---|---|---|
| Kaution (1 Monatsmiete, mind. 50 €) | Mieter | direkt, außerhalb von Stripe | Vermieter |
| Monatspreis = Miete + ca. 10 % Servicegebühr | Mieter | SEPA-Lastschrift, Stripe-Abo, Einzug am 1. | Plattformkonto |
| Miete (100 %) | Plattform | Stripe Transfer am 15. | Express-Konto des Vermieters → dessen Bankkonto |
| Vermittlungsgebühr 19 €/39 € (wenn aktiv) | Mieter | einmalig mit der ersten Abbuchung | Plattformkonto |

## 1. Vermieter-Onboarding (Stripe Express)

- Express-Konto erst anlegen, **wenn ein Mieter feststeht** (vor Vertragsunterschrift). Vorher braucht der Vermieter keine Ausweisdaten.
- Ablauf: Netlify Function legt `accounts.create({ type: 'express', country: 'DE', capabilities: { transfers } })` an → `accountLinks.create` → Link per Mail/WhatsApp an den Vermieter → Stripe prüft Identität und Bankkonto.
- Webhook `account.updated`: erst wenn `payouts_enabled` true ist, wird das Mietverhältnis aktiviert.
- Kosten laut Stripe-Preisliste für Connect prüfen (pro aktivem Konto und Monat sowie je Auszahlung).

## 2. Mieter: Monatsabo per SEPA

- Stripe Checkout im Modus `subscription` mit Zahlungsart `sepa_debit`: erteilt das Lastschriftmandat, legt Customer und Abo an.
- Preis je Mietverhältnis: Monatspreis = Miete × 1,10 (gerundet), als eigener Price oder `price_data`.
- `billing_cycle_anchor` auf den 1. des Folgemonats, erster Teilmonat anteilig oder ab dem 1. – vorher festlegen.
- Kündigung: `cancel_at_period_end`, Frist laut `zahlung.kuendigungsfristMonate`.

## 3. Separate Charges and Transfers

- Abbuchung am 1. aufs Plattformkonto (Merchant of Record ist die Plattform).
- SEPA braucht einige Werktage bis „succeeded“ – deshalb Überweisung erst am **15.**
- Geplante Netlify Function (Scheduled Function, monatlich am 15.): für jede **bezahlte** Rechnung des Monats `transfers.create({ amount: Miete, destination: acct_…, source_transaction: ch_…, transfer_group: mietverhaeltnis_id })`.
- `source_transaction` bindet den Transfer an die Zahlung: nicht eingegangenes Geld wird nicht ausgezahlt.

## 4. Vermittlungsgebühr (wenn `vermittlungsgebuehr.aktiv`)

- Als einmaliger Posten auf der ersten Rechnung (`add_invoice_items` im Checkout/Abo), Betrag nach `mieter_art` (19 € bzw. 39 €).
- Während der Startaktion weglassen (Datum aus `site.startaktion` prüfen – dieselbe Logik wie `startaktionLaeuft()` in `texte.ts`).

## 5. Webhooks (`netlify/functions/stripe-webhook.mjs`, Signatur mit `STRIPE_WEBHOOK_SECRET`)

| Ereignis | Reaktion |
|---|---|
| `checkout.session.completed` | Mietverhältnis auf „aktiv“, Customer- und Abo-ID speichern |
| `invoice.paid` | Zahlung für den Transfer am 15. vormerken |
| `invoice.payment_failed` | Mail an Mieter (Erinnerung), Info an uns; Stripe versucht erneut (Smart Retries) |
| `charge.dispute.created` | **SEPA-Rücklastschrift**: Transfer zurückhalten bzw. mit nächster Auszahlung verrechnen, Info an uns |
| `customer.subscription.deleted` | Mietverhältnis beendet |
| `account.updated` | Onboarding des Vermieters abgeschlossen? |

## Daten (Supabase, EU)

Tabelle `mietverhaeltnisse`: `id`, `flaeche_id`, `suchauftrag_id`, `miete`, `monatspreis`, `vermittlungsgebuehr`, `beginn`, `ende`, `status`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_account_id` (Vermieter). Zusätzlich `zahlungen` mit Rechnungs-, Charge- und Transfer-ID je Monat – Grundlage für Jahresübersicht und DAC7.

## Offene Punkte (vor dem Bau klären)

- **Rücklastschrift-Risiko:** SEPA-Lastschriften können bis 8 Wochen (ohne Mandat bis 13 Monate) zurückgegeben werden, auch nach der Auszahlung am 15. Trägt das die Plattform, oder wird es mit der nächsten Miete verrechnet? Im Mustervertrag regeln.
- **DAC7:** Sobald die Miete über uns läuft, Meldung an das BZSt (Plattformen-Steuertransparenzgesetz). Steuer-ID und Adresse der Vermieter erheben.
- **Umsatzsteuer** auf Servicegebühr und Vermittlungsgebühr (Kleinunternehmerregelung ja/nein) – mit Steuerberatung klären.
- **AGB und Mustervertrag** an den Zahlungsweg anpassen; rechtliche Prüfung vor dem Livegang.
- Erster Teilmonat: anteilig oder voller Monat ab dem 1.?

## Reihenfolge beim Bau

1. Stripe-Konto (Testmodus), Connect-Plattformprofil (Express, Deutschland), Branding
2. Webhook-Funktion mit Signaturprüfung + Tests mit Stripe CLI
3. Onboarding-Link für Vermieter
4. Checkout für Mieter (SEPA-Test-IBANs), Vermittlungsgebühr als Rechnungsposten
5. Scheduled Function für Transfers am 15.
6. Ein vollständiger Testmonat im Testmodus inkl. fehlgeschlagener Lastschrift und Rücklastschrift
7. Livegang: `zahlungLive: true`, `servicegebuehrManuell` bleibt egal (zahlungLive hat Vorrang)
