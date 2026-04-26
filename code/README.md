# BP evaluatiecode opstarten

Deze map bevat de code voor de POC-evaluator (multi-agent pipeline) die studentenprojecten beoordeelt op basis van criteria.

## Wat je hier kan draaien

- `npm run test`: start de interactieve evaluatie-wizard in de terminal (aanbevolen).
- `npm run test:ontvankelijkheid`: start enkel de ontvankelijkheidsflow.
- `npm run test:evaluatiecriteria`: start enkel de evaluatiecriteria-flow.

De evaluatie-output wordt weggeschreven naar `src/poc/resultaten`.
Per run wordt exact een bundelbestand aangemaakt: `eval-<flow>-run-<project>-<timestamp>.json`.

De voorbeeldprojecten die gebruikt worden als referentie voor vergelijking moet je plaatsen in:
`src/poc/projecten/evaluatiekaarten/voorbeeldapplicatie/`
Als die map ontbreekt, stopt de flow met een fout.

De voorbeeldprojecten voor Front-End Web Development en Web Services vindt u hier:

- [Front-end Web Development](https://github.com/HOGENT-frontendweb/frontendweb-budget)
- [Web Services](https://github.com/HOGENT-frontendweb/webservices-budget)

## Vereisten

- Node.js 20+
- npm 10+
- Een sandbox provider key:
  - `E2B_API_KEY`
- Een Ollama-compatibele model endpoint

## 1. Dependencies installeren

Open een terminal in de map `code` en voer uit:

```bash
npm install
```

## 2. `.env` configureren

Maak een bestand `code/.env` met minimaal deze variabelen:

```env
# E2B_API_KEY=e2b_...

# Modelconfiguratie (Ollama-compatible)
MODEL=qwen3-coder:480b-cloud
OLLAMA_V1_BASE_URL=http://localhost:11434/v1
OLLAMA_API_KEY=ollama
```

De E2B_API_KEY is gratis aan te vragen op volgende manier:

1. Ga naar https://e2b.dev/sign-in en log in of maak een account aan.
2. Ga links naar het tabje "API keys" en maak een nieuwe key aan met een naam naar keuze.
3. Voeg de key, startende met "e2b\_" toe aan uw .env file met als variabelenaam "E2B_API_KEY".

Opmerking:

- `MODEL` wordt intern gebruikt als `ollama/<MODEL>`.
- Gebruik je een remote endpoint, pas dan `OLLAMA_V1_BASE_URL` en `OLLAMA_API_KEY` aan.

## 3. Evaluatie starten (aanbevolen flow)

```bash
npm run test
```

Wat er dan gebeurt:

1. Je kiest een studentenproject.
2. Je kiest welke flow je wilt uitvoeren (ontvankelijkheid of evaluatiecriteria).
3. De pipeline bepaalt automatisch de relevante criteria voor die flow.
4. De pipeline uploadt het project naar een sandbox.
5. Een verplichte dossier-intake bouwt projectcontext op.
6. Een coordinator routeert elk criterium naar een specialist-agent:
   - dossier
   - datalaag
   - servicelaag
   - API
   - testen
7. Per criterium krijg je een resultaat: `aanwezig`, `afwezig` of `onduidelijk`.
8. Alle resultaten (dossier-intake + criteria + eventuele failures) komen samen in een JSON-bestand.

Bij de ontvankelijkheidsflow worden enkel de code-verifieerbare criteria meegenomen.

## Troubleshooting

- Fout: `No sandbox provider configured`
  - Zet `E2B_API_KEY` in `code/.env`.

- Fout: connectie naar `127.0.0.1:11434` mislukt
  - Start lokaal Ollama, of zet `OLLAMA_V1_BASE_URL` naar je remote endpoint.

- Fout: unauthorized/auth bij model endpoint
  - Controleer `OLLAMA_API_KEY`.

- Geen projecten gevonden in wizard
  - Voeg projecten toe onder `src/poc/projecten`.
