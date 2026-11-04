// Kartenanbieter. Die Karte lädt erst nach einem Klick (vorher fließen keine Daten an Dritte).
// Bewusst NICHT die öffentlichen OpenStreetMap-Server (tile.openstreetmap.org): deren Nutzungsregeln
// erlauben keinen Dauerbetrieb für Plattformen.
//
// Anbieter wechseln: nur diesen Block anpassen und den Abschnitt in der Datenschutzerklärung prüfen.
// {key} wird durch die Umgebungsvariable PUBLIC_KARTE_KEY ersetzt (bei Netlify eintragen).
// Ohne Schlüssel wird statt der Karte nur die Liste gezeigt.
export const karte = {
  // Beispiel MapTiler (Sitz in der Schweiz, Angemessenheitsbeschluss der EU), Kartenstil "streets-v2"
  name: 'MapTiler',
  kachelUrl: 'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key={key}',
  kachelGroesse: 512,
  zoomVersatz: -1, // bei 512er-Kacheln -1, bei 256er-Kacheln 0
  attribution:
    '<a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap-Mitwirkende</a>',
  maxZoom: 16, // nicht weiter hineinzoomen: die öffentlichen Punkte sind absichtlich ungenau
  mitte: [48.70, 9.05] as [number, number], // Raum Böblingen/Sindelfingen
  zoom: 10,
  // Text unter dem Knopf „Karte laden“
  hinweis: 'Beim Laden der Karte wird Ihre IP-Adresse an den Kartenanbieter MapTiler übertragen.',
};
