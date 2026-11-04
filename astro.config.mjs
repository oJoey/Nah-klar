import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site, betreiber } from './src/config/site.ts';
import { entwuerfe } from './src/config/seiten.ts';

// Rechtstexte erst in die Sitemap, wenn die Betreiberangaben eingetragen sind (vorher noindex).
// AGB sind ein Platzhalter (Anwalt), deshalb immer ausgeschlossen. Impressum/Datenschutz erst mit Betreiberangaben.
const rechtstexte = ['/agb/', ...(betreiber.name.includes('[') ? ['/impressum/', '/datenschutz/'] : [])];
const entwurfPfade = [...entwuerfe.map(([, s]) => s.pfad), ...rechtstexte];

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({ filter: (url) => !url.includes('/danke/') && !url.includes('/daten-loeschen/') && !entwurfPfade.some((p) => new URL(url).pathname === p) }),
  ],
});
