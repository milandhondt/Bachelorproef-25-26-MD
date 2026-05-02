Controleer de gelaagde architectuur.

Zoek actief naar het volgende in de NestJS-codebase:

- Lees meerdere controllerbestanden (`*.controller.ts`) en verifieer dat ze enkel HTTP-afhandeling bevatten: verzoek/antwoord-mapping en delegatie naar de servicelaag.
- Lees de bijhorende servicebestanden (`*.service.ts`) en verifieer dat alle business logic daar aanwezig is (berekeningen, conditionals, databankinteracties).
- Een controller die zelf queries uitvoert, businessregels evalueert of meer dan delegatie-aanroepen bevat, telt als overtreding van de laagscheiding.

Beoordeel: wordt alle domein/business logica verwerkt in de servicelaag en zijn controllers aantoonbaar dun?
