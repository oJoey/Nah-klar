// Gültige Gebühren aus der Datenbank (Tabelle einstellungen), mit Rückfall auf src/config/zahlung.ts.
import type { SupabaseClient } from '@supabase/supabase-js';
import { zahlung } from '../config/zahlung';

export type Gebuehren = {
  aktiv: boolean; // Servicegebühr wird erhoben
  servicegebuehr: number; // wirksamer Satz (0, wenn nicht aktiv)
  provision: { art: 'prozent' | 'betrag'; wert: number };
  provisionAnzeigen: boolean;
};

export async function ladeGebuehren(supabase: SupabaseClient): Promise<Gebuehren> {
  const { data } = await supabase.from('einstellungen').select('schluessel, wert');
  const w = Object.fromEntries((data ?? []).map((z: { schluessel: string; wert: any }) => [z.schluessel, z.wert]));
  const aktiv = Boolean(w.servicegebuehr_aktiv ?? zahlung.servicegebuehrAktiv);
  return {
    aktiv,
    servicegebuehr: aktiv ? Number(w.servicegebuehr?.satz ?? zahlung.servicegebuehr) : 0,
    provision: w.vermieter_provision ?? zahlung.vermieterProvision,
    // Provision nur zusammen mit der Servicegebühr
    provisionAnzeigen: aktiv && Boolean(w.provision_anzeigen ?? zahlung.provisionAnzeigen),
  };
}

/** Provision in Euro für die erste Miete (Monats- bzw. Saisonmiete). */
export const provisionBetrag = (g: Gebuehren, vermieterpreis: number) =>
  g.provision.art === 'prozent' ? Math.round(vermieterpreis * g.provision.wert * 100) / 100 : g.provision.wert;
