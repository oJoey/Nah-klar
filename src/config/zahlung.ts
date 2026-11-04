// Gebühren (Standardwerte). Die gültigen Werte stehen in Supabase (Tabelle einstellungen) und
// lassen sich im Admin-Bereich ändern. Diese Datei gilt für statische Texte und als Rückfallwert.
// Zahlung, Zahlungsgarantie und Mahnung sind nicht Teil des MVP (siehe docs/stripe-connect.md).
export const zahlung = {
  servicegebuehr: 0.1, // 10 % vom Mieter, laufend, im Gesamtpreis enthalten
  // Einmalige Provision vom Vermieter, wird später automatisch von der ersten Auszahlung abgezogen.
  // art: 'prozent' (Anteil der ersten Monats- bzw. Saisonmiete) oder 'betrag' (fester Eurobetrag).
  vermieterProvision: { art: 'prozent' as 'prozent' | 'betrag', wert: 0.5 },
  // Provision im Inserat-Formular erst zeigen, wenn die Zahlungsabwicklung läuft.
  provisionAnzeigen: false,
  kautionMinEuro: 50, // Kaution = eine Monatsmiete, mindestens dieser Betrag
  kautionRueckzahlungWochen: 4,
  kuendigungsfristMonate: 1,
};

/**
 * Gesamtpreis für den Mieter: Wunschbetrag des Vermieters plus Servicegebühr,
 * auf volle Euro aufgerundet (keine krummen Preise wie 93,50 €).
 */
export const gesamtpreis = (vermieterpreis: number, satz = zahlung.servicegebuehr) =>
  Math.ceil(Math.round(vermieterpreis * (1 + satz) * 100) / 100);

/** Alter Name, wird von bestehenden Seiten genutzt. */
export const mieterpreis = (miete: number) => gesamtpreis(miete);
