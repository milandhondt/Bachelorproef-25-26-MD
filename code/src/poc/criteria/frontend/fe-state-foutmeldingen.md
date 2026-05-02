Controleer de foutweergave bij mislukte API-aanroepen.

Zoek actief naar het volgende in de React-codebase:

- Zoek naar foutafhandeling in API-aanroepen: `catch`-blokken na `fetch`/`axios`-aanroepen, `isError`/`error`-velden van `react-query` of `swr`, of expliciete error-state via `useState`.
- Verifieer dat foutstatussen gekoppeld zijn aan de UI: een foutmelding-component, een `<p className="error">`, een `toast`-notificatie of een vergelijkbare visuele indicator die de gebruiker informeert.
- Telt niet mee: foutafhandeling die enkel logt via `console.log()` of `console.error()` zonder visuele weergave voor de gebruiker.

Beoordeel: worden API-fouten aantoonbaar zichtbaar gemaakt aan de gebruiker via de UI?
