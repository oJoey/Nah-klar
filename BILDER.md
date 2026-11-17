# Bilder für die Startseite

Fotos bitte **nicht** nach `public/bilder/` legen (dort werden sie ungeprüft und in voller Größe ausgeliefert), sondern nach `src/assets/bilder/`.

So funktioniert es: Foto mit dem genauen Dateinamen in `src/assets/bilder/` ablegen (JPG, PNG oder WebP). Beim nächsten Build ersetzt es automatisch den Platzhalter. Die Seite wandelt es selbst in moderne Formate (AVIF/WebP) um, schneidet es auf das Seitenverhältnis zu und gibt allen Fotos denselben leicht warmen Ton.

Bitte nur Fotos mit Nutzungsrecht verwenden und den Nachweis in `src/data/bildnachweise.json` eintragen (erscheint im Impressum).

## Bildstil für alle Motive

- Fahrzeuge oder Gegenstände **an ihrem Platz**, keine leeren Parkflächen
- Warmes, natürliches Licht (Abend- oder Morgensonne), keine Blitzfotos
- Echte, private Orte: Hof, Scheune, Einfahrt, Garage. Keine Gewerbehallen, keine Werbeoptik
- Keine erkennbaren Gesichter, Kennzeichen und Hausnummern (oder unkenntlich machen)
- Querformat fotografieren, das Hauptmotiv eher mittig, damit der Zuschnitt funktioniert

## Liste

| Dateiname | Einsatzort | Seitenverhältnis | Mindestgröße | Motiv |
|---|---|---|---|---|
| `start-hero.jpg` | Hero rechts, hinter den schwebenden Karten | 4:5 (Hochformat) | 1200 × 1500 px | Wohnwagen oder Wohnmobil auf einem Hof vor einer Scheune, warmes Licht, links und unten etwas ruhige Fläche (dort liegen die Karten) |
| `kategorie-wohnmobil-wohnwagen.jpg` | Kategorien, große Karte | 16:10 | 1600 × 1000 px | Wohnmobil in einer offenen Scheune, warmes Abendlicht |
| `kategorie-anhaenger-boot.jpg` | Kategorien | 4:3 | 1000 × 750 px | Boot unter Plane auf einem Trailer oder Anhänger an einer Hofeinfahrt |
| `kategorie-auto-motorrad.jpg` | Kategorien | 4:3 | 1000 × 750 px | Auto oder Motorrad in einer privaten Garage oder einem Carport |
| `kategorie-lagerraum.jpg` | Kategorien | 4:3 | 1000 × 750 px | Garage oder trockener Raum mit gestapelten Kisten, Regal, Reifen |
| `ablauf-vorschlag.jpg` | Ablauf, Karte „Vorschlag erhalten“ | 16:9 | 800 × 450 px | Überdachter Stellplatz mit Wohnwagen auf einem Hof |
| `ratgeber-diebstahlschutz.jpg` | Ratgeber, großer Beitrag | 16:9 | 1400 × 790 px | Wohnwagen mit Deichselschloss auf einem Hof, Detail oder Halbtotale |

Hinweis: Wird der große Ratgeber-Beitrag später ein anderer, heißt die Datei `ratgeber-<seitenname>.jpg`. Der Platzhalter zeigt den erwarteten Namen immer an.
