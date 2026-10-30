import daten from '../data/kennzahlen.json';

type Eintrag = { wert: number; text: string };
export type KennzahlSchluessel = Exclude<keyof typeof daten, '_hinweis' | 'stand'>;

export const MINDESTWERT = 3;

export function sichtbareKennzahlen(schluessel: KennzahlSchluessel[]) {
  return schluessel
    .map((k) => daten[k] as Eintrag)
    .filter((e) => typeof e?.wert === 'number' && e.wert >= MINDESTWERT)
    .map((e) => ({ ...e, stand: daten.stand }));
}
