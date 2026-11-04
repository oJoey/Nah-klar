// Karte im Browser. Leaflet wird erst geladen, wenn jemand auf „Karte laden“ klickt.
// Die Leaflet-Dateien liegen auf unserem Server, nur die Kartenkacheln kommen vom Anbieter (src/config/karte.ts).
import { karte } from '../config/karte';

export const karteVerfuegbar = Boolean(import.meta.env.PUBLIC_KARTE_KEY);

export async function ladeKarte(el: HTMLElement, mitte = karte.mitte, zoom = karte.zoom) {
  const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
  const map = L.map(el, { scrollWheelZoom: false, maxZoom: karte.maxZoom }).setView(mitte, zoom);
  L.tileLayer(karte.kachelUrl.replace('{key}', import.meta.env.PUBLIC_KARTE_KEY ?? ''), {
    tileSize: karte.kachelGroesse,
    zoomOffset: karte.zoomVersatz,
    maxZoom: karte.maxZoom,
    attribution: karte.attribution,
    crossOrigin: true,
  }).addTo(map);
  return { L, map };
}

/** Punkt im Stil der Seite (ohne Bilddateien) */
export const punktStil = { radius: 9, color: '#272343', weight: 2, fillColor: '#ffd803', fillOpacity: 1 };
