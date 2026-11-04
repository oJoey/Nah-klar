// Adressen der SEO-Seiten: /<typ-slug>-mieten/<ort>/
// Die Typ-Slugs erst nach der Keyword-Prüfung festlegen (z. B. "wohnmobil-unterstellplatz",
// "wohnmobil-winterlager", "wohnmobil-einstellen"). Nur hier ändern, alle Links passen sich an.
// Die Ort-Slugs stehen in der Datenbank (Tabelle orte, Spalte slug).
export const typSlugs = {
  womo: 'wohnmobil-stellplatz',
  lager: 'lagerraum',
} as const;

export type Typ = keyof typeof typSlugs;

export const seoPfad = (typ: Typ, ortSlug: string) => `/${typSlugs[typ]}-mieten/${ortSlug}/`;

/** Liest aus "/wohnmobil-stellplatz-mieten" den Typ. */
export function typAusSlug(segment: string): Typ | null {
  for (const [typ, slug] of Object.entries(typSlugs)) if (segment === `${slug}-mieten`) return typ as Typ;
  return null;
}
