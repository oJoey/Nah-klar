# Stripe Connect – Vorbereitung

Stand: Website-Pilot. Die Integration wird nach dem Website-Bau gemeinsam im Detail geplant.

## Schalter

`src/config/site.ts` → `zahlungLive`

- `false` (jetzt): Texte versprechen nichts Automatisches.
- `true`: Texte nennen „Miete automatisch per Lastschrift“ und „Auszahlung am 15.“.
  Erst umstellen, wenn Lastschrift und Auszahlung tatsächlich laufen.

Eckdaten (Servicegebühr, Abbuchungs- und Auszahlungstag, Kaution) stehen in `src/config/zahlung.ts`.

## Geplanter Aufbau

1. **Vermieter-Onboarding über Stripe Express.** Das Konto wird erst angelegt, wenn ein Mieter feststeht.
   Erst dann prüft Stripe die Identität. So muss niemand Ausweisdaten hochladen, bevor es einen Mieter gibt.
2. **Monatsabo per SEPA-Lastschrift für den Mieter.** Ein Gesamtpreis (Miete + ca. 10 % Servicegebühr),
   als Stripe Subscription mit Abrechnung am 1. des Monats.
3. **Getrennte Abbuchung und Überweisung (Separate Charges and Transfers).**
   Abbuchung am 1. auf das Plattformkonto, Überweisung der vollen Miete an den Vermieter am 15.
   (z. B. über eine geplante Netlify-Funktion; Transfer mit `source_transaction`, damit er an die Zahlung gebunden ist).
4. **Webhooks** (`netlify/functions/stripe-webhook.mjs`) für fehlgeschlagene Zahlungen und Rücklastschriften.

## Offene Punkte für die Detailplanung

- SEPA-Lastschriften können bis zu 8 Wochen nach Abbuchung zurückgegeben werden – also auch nach der Auszahlung am 15.
  Wer trägt dieses Risiko, und wird es mit der nächsten Auszahlung verrechnet?
- Wo werden Mietverhältnisse gespeichert (Mieter, Vermieter, Preis, Stripe-IDs)?
- Jahresübersicht für Vermieter und DAC7-Meldung: Welche Daten werden dafür gebraucht?
- Rechtliche Prüfung vor dem Livegang (laut Absprache).
