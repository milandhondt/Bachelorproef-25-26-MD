# BP evaluatiecode opstarten

Deze map bevat de code voor de POC-evaluator (multi-agent pipeline) die studentenprojecten beoordeelt op basis van criteria.

## Wat je hier kan draaien

- `npm run test`: start de interactieve evaluatie-wizard in de terminal (aanbevolen).

De evaluatie-output wordt weggeschreven naar `src/poc/resultaten`.

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
2. De wizard bepaalt automatisch de relevante domeinen/criteria.
3. De pipeline uploadt het project naar een sandbox.
4. Een verplichte dossier-intake bouwt projectcontext op.
5. Een coordinator routeert elk criterium naar een specialist-agent:
   - dossier
   - datalaag
   - servicelaag
   - API
   - testen
6. Per criterium krijg je een resultaat: `aanwezig`, `afwezig` of `onduidelijk`.

## Troubleshooting

- Fout: `No sandbox provider configured`
  - Zet `E2B_API_KEY` in `code/.env`.

- Fout: connectie naar `127.0.0.1:11434` mislukt
  - Start lokaal Ollama, of zet `OLLAMA_V1_BASE_URL` naar je remote endpoint.

- Fout: unauthorized/auth bij model endpoint
  - Controleer `OLLAMA_API_KEY`.

- Geen projecten gevonden in wizard
  - Voeg projecten toe onder `src/poc/projecten`.
