Controleer de frontend op niet-triviale end-to-end testen.

Zoek actief naar het volgende in de React-codebase:

- Zoek naar een Cypress-map (`cypress/e2e/`, `cypress/integration/`) of Playwright-map (`e2e/`, `tests/`) en lees de testbestanden — baseer je niet op `package.json`-scripts of dependencies.
- Verifieer dat testbestanden echte user-flows bevatten: `cy.visit()`, `cy.get(...).click()`, `cy.get(...).type()`, of Playwright-equivalenten (`page.goto()`, `page.click()`, `page.fill()`), met concrete assertions (`cy.contains()`, `expect(page.locator(...))`, etc.).
- Tellen niet mee: lege of boilerplate testbestanden, tests die enkel de startpagina bezoeken zonder interactie, en gegenereerde voorbeeldtests zonder aanpassingen.

Beoordeel: zijn er werkende e2e-testen aanwezig met concrete user-flows voor domein-specifieke functionaliteit?
