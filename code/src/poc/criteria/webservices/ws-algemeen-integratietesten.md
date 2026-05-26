Controleer de backend op niet-triviale integratietesten.

Zoek actief naar het volgende in de NestJS-codebase:

- Zoek testbestanden (`*.spec.ts`, `*.e2e-spec.ts`) in mappen zoals `/test`, `/tests` of naast bronbestanden en lees hun inhoud — baseer je niet op `package.json`-scripts.
- Verifieer dat tests echte HTTP-verzoeken sturen naar backend REST-routes (bv. via `supertest`) en concrete `expect()`-assertions bevatten op statuscode en/of responsebody.
- Tellen niet mee: lege of boilerplate testbestanden, tests die enkel `/health`- of ping-endpoints aanspreken, en unit tests zonder HTTP-verzoeken.

Extra controles:

- Tel het totale aantal testcases (individuele `it()` of `test()` blokken) en vermeld dit expliciet in het bewijs.
- Controleer of er ook alternatieve paden worden getest: foutscenario's, ongeautoriseerde requests, ongeldige input, niet enkel happy paths.
- Zoek naar test coverage configuratie en vermeld de coverage indien beschikbaar (bijv. via `jest --coverage` of een zichtbaar coverage rapport).

Beoordeel: zijn er werkende integratietesten voor domein-specifieke routes aanwezig?
