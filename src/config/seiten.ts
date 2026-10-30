// Alle geplanten Seiten. Links gehen nur auf Seiten mit live: true.
// Ist eine Seite noch nicht live, wird auf „ersatz“ verlinkt – oder der Link wird ausgeblendet.
type Seite = { pfad: string; live: boolean; titel: string; ersatz?: string };

export const seiten = {
  start: { pfad: '/', live: true, titel: 'Startseite' },
  mieten: { pfad: '/mieten/', live: true, titel: 'Mieten' },
  vermieten: { pfad: '/vermieten/', live: true, titel: 'Vermieten' },
  suchauftrag: { pfad: '/suchauftrag/', live: true, titel: 'Suchauftrag' },
  platzAnbieten: { pfad: '/platz-anbieten/', live: true, titel: 'Platz anbieten' },
  impressum: { pfad: '/impressum/', live: true, titel: 'Impressum' },
  datenschutz: { pfad: '/datenschutz/', live: true, titel: 'Datenschutz' },

  // Menü und Fußbereich
  werkzeuge: { pfad: '/werkzeuge/', live: false, titel: 'Werkzeuge & Ratgeber' },
  regionen: { pfad: '/regionen/', live: false, titel: 'Regionen' },
  hilfe: { pfad: '/hilfe/', live: false, titel: 'Hilfe & Kontakt' },
  soFunktionierts: { pfad: '/so-funktionierts/', live: false, titel: "So funktioniert's" },
  sicherheit: { pfad: '/sicherheit/', live: false, titel: 'Sicherheit' },
  preise: { pfad: '/preise/', live: false, titel: 'Preise' },
  ueberUns: { pfad: '/ueber-uns/', live: false, titel: 'Über uns' },
  kontakt: { pfad: '/kontakt/', live: false, titel: 'Kontakt' },
  agb: { pfad: '/agb/', live: false, titel: 'AGB' },

  // Werkzeuge und Ratgeber
  verdienstrechner: { pfad: '/werkzeuge/verdienstrechner/', live: false, titel: 'Verdienstrechner' },
  einwinterung: { pfad: '/ratgeber/einwinterung-checkliste/', live: false, titel: 'Einwinterungs-Checkliste' },
  strassenCheck: { pfad: '/werkzeuge/strassen-check-wohnwagen/', live: false, titel: 'Straßen-Check Wohnwagen' },
  winterplatzVergleich: { pfad: '/ratgeber/winterplatz-vergleich/', live: false, titel: 'Winterplatz-Vergleich' },
  nachfrage: { pfad: '/vermieten/nachfrage/', live: false, titel: 'Nachfrage in Ihrer Nähe' },

  // Kategorieseiten Mieten (Ersatz: Suchauftrag mit vorausgewählter Art)
  mietenWohnmobil: { pfad: '/mieten/wohnmobil-wohnwagen-stellplatz/', live: false, titel: 'Wohnmobil und Wohnwagen', ersatz: '/suchauftrag/?art=wohnmobil-wohnwagen' },
  mietenGarage: { pfad: '/mieten/garage-auto-stellplatz/', live: false, titel: 'Garage und Auto', ersatz: '/suchauftrag/?art=garage-auto' },
  mietenLager: { pfad: '/mieten/lagerraum/', live: false, titel: 'Lagerraum', ersatz: '/suchauftrag/?art=lager' },
  mietenAnhaenger: { pfad: '/mieten/anhaenger-boot/', live: false, titel: 'Anhänger und Boot', ersatz: '/suchauftrag/?art=anhaenger-boot' },

  // Unterseiten Vermieten (Ersatz: Formular mit vorausgewählter Fläche)
  vermietenGarage: { pfad: '/vermieten/garage/', live: false, titel: 'Garage vermieten', ersatz: '/platz-anbieten/?art=garage' },
  vermietenEinfahrt: { pfad: '/vermieten/einfahrt/', live: false, titel: 'Einfahrt vermieten', ersatz: '/platz-anbieten/?art=einfahrt' },
  vermietenKeller: { pfad: '/vermieten/keller-raum/', live: false, titel: 'Keller und Raum vermieten', ersatz: '/platz-anbieten/?art=keller-raum' },
  vermietenScheune: { pfad: '/vermieten/scheune-hofflaeche/', live: false, titel: 'Scheune und Hof vermieten', ersatz: '/platz-anbieten/?art=scheune-hof' },
} satisfies Record<string, Seite>;

export type SeitenSchluessel = keyof typeof seiten;

export const istLive = (k: SeitenSchluessel) => seiten[k].live;

/** Zieladresse für einen Link: die Seite selbst, sonst der Ersatz, sonst null (Link ausblenden). */
export function link(k: SeitenSchluessel): string | null {
  const s: Seite = seiten[k];
  return s.live ? s.pfad : (s.ersatz ?? null);
}
