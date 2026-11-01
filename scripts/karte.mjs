// Erzeugt public/bilder/karte-osm.svg aus OpenStreetMap-Daten (© OpenStreetMap-Mitwirkende, ODbL).
// Einmalig ausführen, das Ergebnis wird eingecheckt: node scripts/karte.mjs [datei.osm]
// Ohne Datei werden die Daten einmal über die OSM-API geladen. Die Website lädt zur Laufzeit nichts nach.
import { readFileSync, writeFileSync } from 'node:fs';

const BBOX = { w: 8.9985, s: 48.6695, e: 9.0115, n: 48.6765 }; // Wohngebiet in Böblingen
const BREITE = 1000;

const datei = process.argv[2];
const xml = datei
  ? readFileSync(datei, 'utf8')
  : await (await fetch(`https://api.openstreetmap.org/api/0.6/map?bbox=${BBOX.w},${BBOX.s},${BBOX.e},${BBOX.n}`)).text();

// Projektion: flach, Längengrade mit cos(Breite) gestaucht – reicht für einen Ausschnitt von 1 km.
const k = Math.cos(((BBOX.s + BBOX.n) / 2) * Math.PI / 180);
const sx = BREITE / ((BBOX.e - BBOX.w) * k);
const HOEHE = Math.round((BBOX.n - BBOX.s) * sx);
const xy = (lat, lon) => [((lon - BBOX.w) * k * sx).toFixed(1), ((BBOX.n - lat) * sx).toFixed(1)];

const knoten = new Map();
for (const m of xml.matchAll(/<node id="(\d+)"[^>]*?lat="([\d.-]+)" lon="([\d.-]+)"/g)) knoten.set(m[1], xy(+m[2], +m[3]));

const wege = [];
for (const m of xml.matchAll(/<way id="\d+"[^>]*>([\s\S]*?)<\/way>/g)) {
  const refs = [...m[1].matchAll(/<nd ref="(\d+)"/g)].map((r) => knoten.get(r[1])).filter(Boolean);
  const tags = Object.fromEntries([...m[1].matchAll(/<tag k="([^"]+)" v="([^"]*)"/g)].map((t) => [t[1], t[2]]));
  if (refs.length > 1) wege.push({ refs, tags });
}
const pfad = (refs, zu) => 'M' + refs.map((p) => p.join(' ')).join('L') + (zu ? 'Z' : '');

const haupt = /^(motorway|trunk|primary|secondary|tertiary)(_link)?$/;
const neben = /^(residential|unclassified|living_street)$/;
const klein = /^(service|footway|path|cycleway|pedestrian|track|steps)$/;
const gruppen = { gruen: [], gebaeude: [], klein: [], neben: [], haupt: [] };
for (const w of wege) {
  const t = w.tags;
  if (t.building) gruppen.gebaeude.push(pfad(w.refs, true));
  else if (/^(park|playground|garden|pitch)$/.test(t.leisure) || /^(grass|meadow|forest|recreation_ground|orchard|allotments)$/.test(t.landuse) || t.natural === 'wood')
    gruppen.gruen.push(pfad(w.refs, true));
  else if (haupt.test(t.highway)) gruppen.haupt.push(pfad(w.refs));
  else if (neben.test(t.highway)) gruppen.neben.push(pfad(w.refs));
  else if (klein.test(t.highway)) gruppen.klein.push(pfad(w.refs));
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BREITE} ${HOEHE}" preserveAspectRatio="xMidYMid slice">
<rect width="100%" height="100%" fill="#272343"/>
<path fill="#8fd1b5" fill-opacity=".1" d="${gruppen.gruen.join('')}"/>
<path fill="#e3f6f5" fill-opacity=".09" d="${gruppen.gebaeude.join('')}"/>
<g fill="none" stroke="#e3f6f5" stroke-linecap="round" stroke-linejoin="round">
<path stroke-opacity=".12" stroke-width="1.5" d="${gruppen.klein.join('')}"/>
<path stroke-opacity=".28" stroke-width="5" d="${gruppen.neben.join('')}"/>
<path stroke-opacity=".42" stroke-width="10" d="${gruppen.haupt.join('')}"/>
</g>
</svg>
`;
writeFileSync(new URL('../public/bilder/karte-osm.svg', import.meta.url), svg);
console.log(`karte-osm.svg: ${BREITE}×${HOEHE}, ${Object.entries(gruppen).map(([n, g]) => `${n} ${g.length}`).join(', ')}, ${(svg.length / 1024).toFixed(0)} KB`);
