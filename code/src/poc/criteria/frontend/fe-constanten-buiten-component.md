Controleer of constanten buiten de component worden gedefinieerd.

Zoek actief naar het volgende in de React-codebase:

- Zoek naar 'magic numbers', hardgecodeerde configuratie-waarden en API URLs in React-componenten.
- Verifieer dat dergelijke waarden (constanten) zo veel mogelijk gedefinieerd worden búiten de React component-functie (of in een apart constantenbestand zoals `constants.js` of `config.ts`), zodat ze niet onnodig opnieuw worden gecreëerd bij elke render.
- Controleer of configuratiewaarden logisch en herbruikbaar gegroepeerd zijn.

Beoordeel: worden globale of herbruikbare constanten netjes buiten de component gehouden?
