Ontvankelijkheidscriterium (Front-end): Er is een extra technologie gebruikt die niet in de voorbeeldapplicatie aanwezig is.

Controle-instructies:

- Zoek in `dossier.md` naar vermeldingen van extra technologieën die niet strikt noodzakelijk zijn voor een basis React-applicatie en niet aanwezig zijn in de voorbeeldapplicatie.
- Indien geen bruikbare info in `dossier.md`, vergelijk `package.json` van het studentenproject met dat van de voorbeeldapplicatie. Noteer packages die in het studentenproject staan maar niet in de voorbeeldapplicatie. Negeer type-definities (`@types/*`), linters en buildtools — die tellen niet als extra technologie.
- Verifieer dat de extra dependency daadwerkelijk gebruikt wordt: zoek naar imports in bronbestanden en controleer of de functionaliteit geïntegreerd is in componenten of logica (niet enkel geïnstalleerd).
- Voorbeelden van geldige extra technologieën: `@tanstack/react-query`, `zustand`, `jotai`, `redux`, `framer-motion`, `react-hook-form`, `zod`, `socket.io-client`, `i18next`, `chart.js`, `leaflet`.

Beslisstatus:

- aanwezig: minstens 1 extra technologie is geïnstalleerd én aantoonbaar gebruikt in broncode.
- afwezig: geen extra technologie buiten de standaardstack, of enkel dev-tools en type-packages.
- onduidelijk: dependency aanwezig maar gebruik in broncode niet verifieerbaar.
