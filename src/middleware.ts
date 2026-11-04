// Läuft vor jeder serverseitig erzeugten Seite: Anmeldung prüfen, geschützte Bereiche absichern.
// Statische Seiten (Ratgeber, Pflichtseiten usw.) sind nicht betroffen.
import { defineMiddleware } from 'astro:middleware';
import { serverClient, supabaseBereit } from './lib/supabase';

const geschuetzt = (pfad: string) => (pfad.startsWith('/konto/') && !pfad.startsWith('/konto/anmelden')) || pfad.startsWith('/admin/');

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();
  const pfad = context.url.pathname;

  // Formulare nur von der eigenen Seite annehmen (Schutz gegen untergeschobene Anfragen, CSRF)
  if (!['GET', 'HEAD', 'OPTIONS'].includes(context.request.method)) {
    const herkunft = context.request.headers.get('Origin');
    if (herkunft && herkunft !== context.url.origin) return new Response('Ungültige Herkunft', { status: 403 });
  }

  if (!supabaseBereit) {
    if (geschuetzt(pfad) || pfad.startsWith('/konto/') || pfad.startsWith('/suche/') || pfad.startsWith('/inserat/')) {
      return new Response('Supabase ist noch nicht eingerichtet (siehe docs/einrichtung.md).', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
    return next();
  }

  const supabase = serverClient(context.request, context.cookies);
  context.locals.supabase = supabase;
  context.locals.nutzer = null;

  // getUser prüft die Anmeldung beim Server (sicherer als getSession)
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    const { data: profil } = await supabase.from('profile').select('ist_admin').eq('id', data.user.id).maybeSingle();
    context.locals.nutzer = { id: data.user.id, email: data.user.email ?? '', istAdmin: Boolean(profil?.ist_admin) };
  }

  if (geschuetzt(pfad) && !context.locals.nutzer) {
    return context.redirect(`/konto/anmelden/?weiter=${encodeURIComponent(pfad + context.url.search)}`);
  }
  if (pfad.startsWith('/admin/') && !context.locals.nutzer?.istAdmin) {
    return new Response('Kein Zugriff', { status: 403 });
  }

  const antwort = await next();
  // Persönliche Seiten nie zwischenspeichern und nicht indexieren
  if (pfad.startsWith('/konto/') || pfad.startsWith('/admin/')) {
    antwort.headers.set('Cache-Control', 'private, no-store');
    antwort.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return antwort;
});
