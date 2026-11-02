// Kurztexte für Seiten, die noch im Aufbau sind (siehe entwurf in src/config/seiten.ts).
import type { SeitenSchluessel } from '../config/seiten';

// punkte: erste Inhalte, die schon vor der fertigen Seite stimmen.
type Entwurf = { einleitung: string; eltern?: SeitenSchluessel; verwandt?: SeitenSchluessel[]; punkte?: string[]; punkteHtml?: string[] };

export const entwurfTexte: Partial<Record<SeitenSchluessel, Entwurf>> = {};
