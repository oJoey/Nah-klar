import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';
import { site, betreiber } from './src/config/site.ts';
import { entwuerfe } from './src/config/seiten.ts';

// Rechtstexte erst in die Sitemap, wenn die Betreiberangaben eingetragen sind (vorher noindex).
// AGB sind ein Platzhalter (Anwalt), deshalb immer ausgeschlossen. Impressum/Datenschutz erst mit Betreiberangaben.
const rechtstexte = ['/agb/', ...(betreiber.name.includes('[') ? ['/impressum/', '/datenschutz/'] : [])];
const entwurfPfade = [...entwuerfe.map(([, s]) => s.pfad), ...rechtstexte];

export default defineConfig({
  site: site.url,
  // Statische Seiten bleiben statisch. Seiten mit `export const prerender = false` (Suche, Inserate, Konto, Admin)
  // werden bei jedem Aufruf auf Netlify erzeugt.
  adapter: netlify(),
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({ filter: (url) => !url.includes('/danke/') && !url.includes('/daten-loeschen/') && !url.includes('/konto/') && !url.includes('/admin/') && !entwurfPfade.some((p) => new URL(url).pathname === p) }),
  ],
});
