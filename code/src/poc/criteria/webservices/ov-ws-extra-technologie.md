Ontvankelijkheidscriterium (Web Services): Er is een extra technologie gebruikt bovenop de voorbeeldapplicatie.

Zoek actief naar het volgende in de NestJS-codebase:

- Zoek in `dossier.md` naar vermeldingen van extra technologieën (zoals caching, messaging, WebSockets, GraphQL, e-mail, taakplanning, bestandsupload, etc.) die niet strikt noodzakelijk zijn voor een basis REST API en niet aanwezig zijn in de voorbeeldapplicatie.
- Indien geen bruikbare info in `dossier.md`, vergelijk `package.json` van het studentenproject met dat van de voorbeeldapplicatie. Noteer packages die in het studentenproject staan maar niet in de voorbeeldapplicatie. Negeer type-definities (`@types/*`), linters en buildtools — die tellen niet als extra technologie.
- Verifieer dat de technologie effectief gebruikt wordt: zoek naar imports, module-registratie of configuratie-aanroepen in de broncode. Een package die enkel in `package.json` vermeld staat maar nergens in de code gebruikt wordt, telt niet.

Beslisstatus:

- aanwezig: minstens 1 extra technologie aantoonbaar toegevoegd én effectief gebruikt in code of configuratie, die niet aanwezig is in de voorbeeldapplicatie.
- afwezig: alle gebruikte packages zijn ook aanwezig in de voorbeeldapplicatie, of extra packages worden niet daadwerkelijk gebruikt in de broncode.
- onduidelijk: kandidaat-technologie gevonden maar effectief gebruik is niet verifieerbaar (bv. enkel geconfigureerd maar nooit aangeroepen), of het onderscheid met de voorbeeldapplicatie is niet duidelijk vast te stellen.
