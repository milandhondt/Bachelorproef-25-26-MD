Controleer de communicatie met de backend-API.

Zoek actief naar het volgende in de React-codebase:

- Zoek naar API-aanroepen via `fetch()`, `axios`, `@tanstack/react-query` (`useQuery()`, `useMutation()`), of `swr` (`useSWR()`) en lees de betrokken bestanden.
- Verifieer dat API-aanroepen daadwerkelijk gebruikt worden in componenten of custom hooks voor meerdere domein-specifieke operaties (niet enkel login of registratie).
- Controleer of API-logica gecentraliseerd is in een service- of api-laag (`api/`, `services/`, `*.api.ts`, `*.service.ts`) in plaats van inline verspreid over elke component.

Extra controles:

- Indien `useSWR` of vergelijkbare data-fetching hooks worden gebruikt: controleer of ze op een correcte manier worden toegepast. Gebruiken ze de juiste endpoints (als keys) zodat automatische refresh en data-invalidation mogelijk is?

Beoordeel: worden API-aanroepen aantoonbaar gebruikt voor meerdere domein-specifieke operaties, los van enkel authenticatie?
