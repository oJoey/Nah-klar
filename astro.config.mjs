import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';
import { entwuerfe } from './src/config/seiten.ts';

const entwurfPfade = entwuerfe.map(([, s]) => s.pfad);

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({ filter: (url) => !url.includes('/danke/') && !url.includes('/daten-loeschen/') && !entwurfPfade.some((p) => new URL(url).pathname === p) }),
  ],
});
