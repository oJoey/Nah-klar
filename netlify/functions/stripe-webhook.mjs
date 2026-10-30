// VORBEREITUNG – noch nicht aktiv. Plan siehe docs/stripe-connect.md.
// Hier kommen später die Stripe-Webhooks an (Signatur prüfen mit STRIPE_WEBHOOK_SECRET).
//
// Geplante Ereignisse:
//   account.updated                 Onboarding des Vermieters (Stripe Express) abgeschlossen?
//   invoice.paid                    Monatsmiete eingegangen → Überweisung am 15. vormerken
//   invoice.payment_failed          Lastschrift fehlgeschlagen → Erinnerung an Mieter, Info an uns
//   charge.dispute.created          SEPA-Rücklastschrift → Überweisung an Vermieter zurückhalten, Erinnerung
//   customer.subscription.deleted   Mietverhältnis beendet

export const handler = async () => ({ statusCode: 503, body: 'Zahlung noch nicht aktiv' });
