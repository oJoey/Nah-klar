// Verbindung zu Supabase. Schlüssel kommen aus Umgebungsvariablen (lokal: Datei .env, online: Netlify).
// PUBLIC_SUPABASE_URL und PUBLIC_SUPABASE_ANON_KEY sind öffentlich (stehen auch im Browser).
// Die Rechte regelt die Datenbank selbst (Row Level Security), nicht dieser Schlüssel.
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
export const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
export const supabaseBereit = Boolean(supabaseUrl && supabaseKey);

/** Supabase für eine Server-Anfrage: liest und schreibt die Anmelde-Cookies. */
export function serverClient(request: Request, cookies: AstroCookies) {
  if (!supabaseUrl || !supabaseKey) throw new Error('PUBLIC_SUPABASE_URL und PUBLIC_SUPABASE_ANON_KEY fehlen (siehe docs/einrichtung.md).');
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => parseCookieHeader(request.headers.get('Cookie') ?? '').map((c) => ({ name: c.name, value: c.value ?? '' })),
      setAll: (liste) => {
        for (const { name, value, options } of liste) cookies.set(name, value, { ...options, path: '/', sameSite: 'lax', secure: import.meta.env.PROD });
      },
    },
  });
}

/** Öffentliche Adresse eines Fotos im Storage. */
export const fotoUrl = (pfad: string) => `${supabaseUrl}/storage/v1/object/public/inserat-fotos/${pfad}`;
