// Alle geplanten Seiten. Links gehen nur auf Seiten mit live: true.
// Ist eine Seite noch nicht live, wird auf „ersatz“ verlinkt, oder der Link wird ausgeblendet.
// entwurf: Seite existiert als Platzhalter (noindex, nicht in der Sitemap), Inhalt folgt.
type Seite = { pfad: string; live: boolean; titel: string; ersatz?: string; entwurf?: boolean };

export const seiten = {
  start: { pfad: '/', live: true, titel: 'Startseite' },
  mieten: { pfad: '/mieten/', live: true, titel: 'Mieten' },
  vermieten: { pfad: '/vermieten/', live: true, titel: 'Vermieten' },
  suchauftrag: { pfad: '/suchauftrag/', live: true, titel: 'Suchauftrag' },
  platzAnbieten: { pfad: '/platz-anbieten/', live: true, titel: 'Platz anbieten' },
  impressum: { pfad: '/impressum/', live: true, titel: 'Impressum' },
  datenschutz: { pfad: '/datenschutz/', live: true, titel: 'Datenschutz' },

  // Menü und Fußbereich
  werkzeuge: { pfad: '/werkzeuge/', live: true, titel: 'Werkzeuge & Ratgeber' },
  regionen: { pfad: '/regionen/', live: true, entwurf: true, titel: 'Regionen' },
  hilfe: { pfad: '/hilfe/', live: true, entwurf: true, titel: 'Hilfe & Kontakt' },
  soFunktionierts: { pfad: '/so-funktionierts/', live: true, entwurf: true, titel: "So funktioniert's" },
  sicherheit: { pfad: '/sicherheit/', live: true, entwurf: true, titel: 'Sicherheit' },
  preise: { pfad: '/preise/', live: true, entwurf: true, titel: 'Preise' },
  ueberUns: { pfad: '/ueber-uns/', live: true, entwurf: true, titel: 'Über uns' },
  kontakt: { pfad: '/kontakt/', live: true, entwurf: true, titel: 'Kontakt' },
  agb: { pfad: '/agb/', live: true, entwurf: true, titel: 'AGB' },

  // Werkzeuge und Ratgeber
  verdienstrechner: { pfad: '/werkzeuge/verdienstrechner/', live: true, titel: 'Verdienstrechner' },
  einwinterung: { pfad: '/ratgeber/einwinterung-checkliste/', live: true, titel: 'Einwinterungs-Checkliste' },
  strassenCheck: { pfad: '/werkzeuge/strassen-check-wohnwagen/', live: true, titel: 'Straßen-Check Wohnwagen' },
  winterplatzVergleich: { pfad: '/ratgeber/winterplatz-vergleich/', live: true, titel: 'Winterplatz-Vergleich' },
  // Später: prüft Breite, Höhe und Gewicht gegen die Zufahrt eines Platzes
  passtWohnmobil: { pfad: '/werkzeuge/passt-mein-wohnmobil/', live: false, titel: 'Passt mein Wohnmobil?' },
  nachfrage: { pfad: '/vermieten/nachfrage/', live: true, entwurf: true, titel: 'Nachfrage in Ihrer Nähe' },

  // Kategorieseiten Mieten (Ersatz: Suchauftrag mit vorausgewählter Art)
  mietenWohnmobil: { pfad: '/mieten/wohnmobil-wohnwagen-stellplatz/', live: false, titel: 'Wohnmobil und Wohnwagen', ersatz: '/suchauftrag/?mieter_art=wohnmobil-wohnwagen' },
  mietenAuto: { pfad: '/mieten/auto-stellplatz/', live: false, titel: 'Stellplatz für Auto oder Motorrad', ersatz: '/suchauftrag/?mieter_art=auto-motorrad' },
  mietenGarage: { pfad: '/mieten/garage/', live: false, titel: 'Garage', ersatz: '/suchauftrag/?mieter_art=garage' },
  mietenLager: { pfad: '/mieten/lagerraum/', live: false, titel: 'Lagerraum', ersatz: '/suchauftrag/?mieter_art=lagerraum' },
  mietenAnhaenger: { pfad: '/mieten/anhaenger-boot/', live: false, titel: 'Anhänger und Boot', ersatz: '/suchauftrag/?mieter_art=anhaenger-boot' },

  // Unterseiten Vermieten (Ersatz: Formular mit vorausgewählter Fläche)
  vermietenGarage: { pfad: '/vermieten/garage/', live: false, titel: 'Garage vermieten', ersatz: '/platz-anbieten/?flaechen_art=garage' },
  vermietenEinfahrt: { pfad: '/vermieten/einfahrt/', live: false, titel: 'Einfahrt vermieten', ersatz: '/platz-anbieten/?flaechen_art=stellplatz-frei' },
  vermietenKeller: { pfad: '/vermieten/keller-raum/', live: false, titel: 'Keller und Raum vermieten', ersatz: '/platz-anbieten/?flaechen_art=lagerraum' },
  vermietenScheune: { pfad: '/vermieten/scheune-hofflaeche/', live: false, titel: 'Scheune und Hof vermieten', ersatz: '/platz-anbieten/?flaechen_art=halle-scheune' },
} satisfies Record<string, Seite>;

export type SeitenSchluessel = keyof typeof seiten;

export const istLive = (k: SeitenSchluessel) => seiten[k].live;

/** Zieladresse für einen Link: die Seite selbst, sonst der Ersatz, sonst null (Link ausblenden). */
export function link(k: SeitenSchluessel): string | null {
  const s: Seite = seiten[k];
  return s.live ? s.pfad : (s.ersatz ?? null);
}

export const entwuerfe = (Object.entries(seiten) as [SeitenSchluessel, Seite][]).filter(([, s]) => s.entwurf);
