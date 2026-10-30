// Einfache Linien-Symbole (24×24). Kreise als [cx, cy, r].
type Form = string | [number, number, number];

export const icons = {
  check: ['M5 12l5 5L20 7'],
  schild: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M9 12l2 2 4-4'],
  vertrag: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h6', 'M10 17h6'],
  person: [[12, 8, 4], 'M4 21c0-4 4-6 8-6s8 2 8 6'],
  euro: ['M17 6.5a7 7 0 1 0 0 11', 'M4 10h9', 'M4 14h9'],
  garage: ['M3 21V9l9-5 9 5v12', 'M7 21v-8h10v8', 'M7 16h10'],
  wohnmobil: ['M2 17V8a2 2 0 0 1 2-2h11l5 5v6h-2', 'M9 17h6', 'M5 9h4v3H5z', [7, 17.5, 2], [17, 17.5, 2]],
  lager: ['M3 7l9-4 9 4v10l-9 4-9-4z', 'M3 7l9 4 9-4', 'M12 11v10'],
  anhaenger: ['M2 7h14v8H2z', 'M16 13h6', [8, 17.5, 2]],
  hof: ['M3 21V10l9-6 9 6v11', 'M9 21v-6h6v6', 'M3 10h18'],
  einfahrt: ['M8 3L5 21', 'M16 3l3 18', 'M12 5v2', 'M12 11v2', 'M12 17v2'],
  keller: ['M4 20h4v-4h4v-4h4V8h4'],
  telefon: ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2'],
  chat: ['M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z'],
  pfeil: ['M5 12h14', 'M13 6l6 6-6 6'],
  kamera: ['M4 8h3l2-3h6l2 3h3v11H4z', [12, 13, 3.5]],
  ort: ['M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z', [12, 10, 2.5]],
  liste: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4 6h.01', 'M4 12h.01', 'M4 18h.01'],
  handschlag: ['M3 12l4-4 4 2 3-2 7 5', 'M7 14l3 3 2-1 2 2 3-3', 'M3 12l4 4'],
} satisfies Record<string, Form[]>;

export type IconName = keyof typeof icons;

/** Wandelt Kreise in Pfade um, damit alles als <path> gezeichnet werden kann. */
export const pfade = (name: IconName): string[] =>
  (icons[name] as Form[]).map((f) =>
    typeof f === 'string' ? f : `M${f[0] - f[2]} ${f[1]}a${f[2]} ${f[2]} 0 1 0 ${2 * f[2]} 0a${f[2]} ${f[2]} 0 1 0 ${-2 * f[2]} 0`
  );
