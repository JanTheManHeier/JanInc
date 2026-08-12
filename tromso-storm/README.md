# Tromsø Storm – ny hjemmeside

Statisk designprototype for en ny, mobiltilpasset Tromsø Storm-side.

Forsiden er en designvelger med tre konsepter:

- **Arena** – mørk og kampdrevet
- **Pulse** – ungdommelig og nyhetsorientert
- **Arven** – klubbhistorie og redaksjonelt innhold

## Lokal kjøring

Åpne `index.html` direkte, eller kjør en enkel lokal server:

```powershell
python -m http.server 8080 --directory C:\JanInc\tromso-storm
```

Siden er da tilgjengelig på `http://localhost:8080`.

## Publisering

Prosjektet har ingen byggesteg. Når mappen committes og pushes til `main`, publiseres den på:

`https://janinc.no/tromso-storm/`

Nyheter og enkelte detaljsider peker foreløpig til eksisterende `tromsostorm.no`.

Etter valg av konsept anbefales designet implementert som et moderne WordPress blokktema. Eksisterende artikler, bilder, klubbaviser og historikk kan da migreres, samtidig som dagens redaksjonelle arbeidsflyt beholdes.
