// Eckdaten für Preise und die spätere Stripe-Connect-Anbindung (siehe docs/stripe-connect.md).
export const zahlung = {
  servicegebuehr: 0.1, // ca. 10 %, zahlt der Mieter mit dem Monatspreis
  abbuchungTag: 1, // SEPA-Lastschrift beim Mieter
  auszahlungTag: 15, // Überweisung an den Vermieter
  kautionMinEuro: 50, // Kaution = eine Monatsmiete, mindestens dieser Betrag
  kautionRueckzahlungWochen: 4,
  kuendigungsfristMonate: 1,
};

/** Monatspreis für den Mieter: Miete plus Servicegebühr, als Gesamtpreis. */
export const mieterpreis = (miete: number) => Math.round(miete * (1 + zahlung.servicegebuehr));
