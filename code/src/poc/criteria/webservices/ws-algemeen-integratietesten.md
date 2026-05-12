Controleer de backend op niet-triviale integratietesten.

Zoek actief naar het volgende in de NestJS-codebase:

- Zoek testbestanden (`*.spec.ts`, `*.e2e-spec.ts`) in mappen zoals `/test`, `/tests` of naast bronbestanden en lees hun inhoud — baseer je niet op `package.json`-scripts.
- Verifieer dat tests echte HTTP-verzoeken sturen naar backend REST-routes (bv. via `supertest`) en concrete `expect()`-assertions bevatten op statuscode en/of responsebody.
- Tellen niet mee: lege of boilerplate testbestanden, tests die enkel `/health`- of ping-endpoints aanspreken, en unit tests zonder HTTP-verzoeken.

Beoordeel: zijn er werkende integratietesten voor domein-specifieke routes aanwezig?
