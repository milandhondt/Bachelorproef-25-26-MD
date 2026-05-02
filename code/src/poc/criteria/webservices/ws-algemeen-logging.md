Controleer of er minimale applicatie-logging aanwezig is.

Zoek actief naar het volgende in de NestJS-codebase:

- Zoek naar gebruik van een logger: NestJS ingebouwde `Logger`, of externe bibliotheken zoals `winston`, `pino` of `morgan`.
- Controleer `main.ts`, middleware-bestanden en interceptors op logging van inkomende requests of fouten.
- Enkel `console.log`-aanroepen verspreid door de code zonder structurele logging-opzet tellen als onvoldoende.

Beoordeel: is er minimale, expliciete logging van requests of fouten aanwezig?
