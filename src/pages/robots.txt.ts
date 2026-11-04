import type { APIRoute } from 'astro';
import { site } from '../config/site';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /konto/\nDisallow: /admin/\nDisallow: /suche/\n\nSitemap: ${new URL('/sitemap-index.xml', site.url).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
