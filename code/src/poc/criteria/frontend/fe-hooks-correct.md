Controleer het gebruik van React Hooks op anti-patterns.

Zoek actief naar het volgende in de React-codebase:

- Lees componenten die `useState` en `useEffect` gebruiken en zoek naar: een `useEffect` zonder dependency array (leidt tot oneindige renders), een `useEffect` met een inline object of array als dependency (nieuwe referentie bij elke render), of directe mutatie van een state-variabele zonder de setter (`state.property = value` in plaats van `setState(...)`).
- Zoek naar buitensporige prop-drilling: props die meer dan 3 lagen diep worden doorgegeven zonder gebruik van context of state management.
- Verifieer dat custom hooks (`use*.ts`, `use*.tsx`) de hooks-regels volgen: enkel aangeroepen op het toplevel van een component of andere hook, niet conditioneel of in loops.
- Controleer of niet overmatig gebruikt wordt gemaakt van memoization (`useMemo`, `useCallback`) zonder duidelijke performance-voordelen, wat kan leiden tot onnodige complexiteit.

Beoordeel: zijn er geen duidelijke anti-patterns in het gebruik van React Hooks die leiden tot bugs of instabiliteit?
