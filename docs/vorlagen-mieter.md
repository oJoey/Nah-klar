# Vorlagen für Vorschläge und Vertragsbestätigung (Übergang ohne Stripe)

Solange `zahlungLive: false` ist, gehen Vorschläge und Bestätigungen von Hand per WhatsApp oder E-Mail raus. Regeln:

- Im Vorschlag nennen Sie den Preis immer als **Gesamtpreis pro Monat** (Miete + 10 % Servicegebühr), z. B. „77 € im Monat“.
- Vor dem verbindlichen Abschluss und in der Vertragsbestätigung steht die **Aufschlüsselung**.
- Beträge rechnen: `aufschluesselungText(miete, art)` aus `src/lib/texte.ts` liefert den Text fertig. Die Abschlussgebühr hängt ab vom Datum (Startaktion) und von der Art (19 € bzw. 39 €).

## Vorschlag

> Guten Tag [Vorname],
> wir haben einen passenden Platz für Sie: [Art], [Ortsteil], [Größe/Ausstattung].
> **Preis: 77 € im Monat.** Fotos anbei.
> Möchten Sie den Platz besichtigen? Dann nennen wir Ihnen die Adresse und stimmen einen Termin ab.
> Vor dem Abschluss zeigen wir Ihnen genau, wie sich der Preis zusammensetzt.

## Vor dem Abschluss und Vertragsbestätigung

> So setzt sich Ihr Preis zusammen:
> Miete: 70 €
> Servicegebühr (10 %): 7 €
> Gesamt pro Monat: 77 €
> Einmalige Abschlussgebühr: entfällt bis 31.01. (sonst 39 €)
> Kaution an den Vermieter: 70 € (separat, direkt an den Vermieter)
>
> Die Miete zahlen Sie an den Vermieter, die Servicegebühr an uns. Die Kaution zahlen Sie direkt an den Vermieter. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.
