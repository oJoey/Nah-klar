// Gültige Gebühren aus der Datenbank (Tabelle einstellungen), mit Rückfall auf src/config/zahlung.ts.
import type { SupabaseClient } from '@supabase/supabase-js';
import { zahlung } from '../config/zahlung';

export type Gebuehren = {
  servicegebuehr: number;
  provision: { art: 'prozent' | 'betrag'; wert: number };
  provisionAnzeigen: boolean;
};

export async function ladeGebuehren(supabase: SupabaseClient): Promise<Gebuehren> {
  const { data } = await supabase.from('einstellungen').select('schluessel, wert');
  const w = Object.fromEntries((data ?? []).map((z: { schluessel: string; wert: any }) => [z.schluessel, z.wert]));
  return {
    servicegebuehr: Number(w.servicegebuehr?.satz ?? zahlung.servicegebuehr),
    provision: w.vermieter_provision ?? zahlung.vermieterProvision,
    provisionAnzeigen: Boolean(w.provision_anzeigen ?? zahlung.provisionAnzeigen),
  };
}

/** Provision in Euro für die erste Miete (Monats- bzw. Saisonmiete). */
export const provisionBetrag = (g: Gebuehren, vermieterpreis: number) =>
  g.provision.art === 'prozent' ? Math.round(vermieterpreis * g.provision.wert * 100) / 100 : g.provision.wert;
