// Fotos aus src/assets/bilder/ und ihre Bildnachweise (src/data/bildnachweise.json).
import nachweise from '../data/bildnachweise.json';

const dateien = import.meta.glob<{ default: ImageMetadata }>('../assets/bilder/*.{jpg,jpeg,png,webp}', { eager: true });

export type Nachweis = { fotograf: string; lizenz: string; lizenzUrl: string; quelle: string; titel: string };

/** Erstes vorhandene Foto aus der Liste, z. B. bild('start', 'garage'): eigenes Foto vor Ersatzfoto. */
export function bild(...namen: (string | undefined)[]) {
  for (const name of namen) {
    if (!name) continue;
    const treffer = Object.entries(dateien).find(([pfad]) => pfad.split('/').pop()!.replace(/\.\w+$/, '') === name);
    if (treffer) return { name, src: treffer[1].default, nachweis: (nachweise as Record<string, Nachweis>)[name] };
  }
  return null;
}

export const alleNachweise = Object.entries(nachweise as Record<string, Nachweis>);
