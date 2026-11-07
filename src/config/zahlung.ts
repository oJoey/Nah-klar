// Gebühren (Standardwerte). Die gültigen Werte stehen in Supabase (Tabelle einstellungen) und
// lassen sich im Admin-Bereich ändern. Diese Datei gilt für statische Texte und als Rückfallwert.
// Zahlung, Zahlungsgarantie und Mahnung sind nicht Teil des MVP (siehe docs/stripe-connect.md).
export const zahlung = {
  // SCHALTER Servicegebühr. Aus: Mieter sehen den Vermieterpreis ohne Aufschlag, keine Provision.
  // Beim Einschalten ZWEI Stellen ändern: hier (für die statischen Texte) und in der Datenbank
  // (Tabelle einstellungen, servicegebuehr_aktiv = true), dann neu veröffentlichen.
  // Der Admin-Bereich warnt, wenn beide nicht übereinstimmen.
  servicegebuehrAktiv: false,
  servicegebuehr: 0.1, // 10 % vom Mieter, laufend, im Gesamtpreis enthalten
  // Einmalige Provision vom Vermieter, wird später automatisch von der ersten Auszahlung abgezogen.
  // art: 'prozent' (Anteil der ersten Monats- bzw. Saisonmiete) oder 'betrag' (fester Eurobetrag).
  vermieterProvision: { art: 'prozent' as 'prozent' | 'betrag', wert: 0.5 },
  // Provision im Inserat-Formular erst zeigen, wenn die Zahlungsabwicklung läuft.
  provisionAnzeigen: false,
};

/**
 * Gesamtpreis für den Mieter: Wunschbetrag des Vermieters plus Servicegebühr,
 * auf volle Euro aufgerundet (keine krummen Preise wie 93,50 €).
 */
export const gesamtpreis = (vermieterpreis: number, satz = zahlung.servicegebuehrAktiv ? zahlung.servicegebuehr : 0) =>
  Math.ceil(Math.round(vermieterpreis * (1 + satz) * 100) / 100);

/** Alter Name, wird von bestehenden Seiten genutzt. */
export const mieterpreis = (miete: number) => gesamtpreis(miete);
