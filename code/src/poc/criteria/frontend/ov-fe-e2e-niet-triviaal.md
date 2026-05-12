Ontvankelijkheidscriterium (Front-end): Er werden niet-triviale en werkende e2e-testen gemaakt (naast de testen voor de user).

Controle-instructies:

- Zoek naar een Cypress-map (`cypress/e2e/`, `cypress/integration/`) of Playwright-map (`e2e/`, `tests/`, `playwright/`) en lees de testbestanden — baseer je niet op `package.json`-dependencies of scripts.
- Verifieer dat testbestanden echte user-flows bevatten met concrete interacties (`cy.visit()`, `cy.get(...).click()`, `cy.get(...).type()`, of Playwright-equivalenten) én assertions op inhoud of toestand.
- Tellen niet mee: boilerplate of gegenereerde testbestanden, tests die enkel de startpagina bezoeken zonder interactie, en lege `describe`/`it`-blokken.

Beslisstatus:

- aanwezig: meerdere niet-triviale e2e-testen met concrete interacties en assertions voor domein-specifieke functionaliteit.
- afwezig: geen testbestanden, enkel boilerplate, of tests zonder echte interactie en assertions.
- onduidelijk: testbestanden aanwezig maar kwaliteit of volledigheid niet betrouwbaar vast te stellen.
