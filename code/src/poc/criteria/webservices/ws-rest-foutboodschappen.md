Controleer de foutafhandeling in de REST API.

Zoek actief naar het volgende in de NestJS-codebase:

- Zoek naar NestJS `HttpException`-subklassen (`NotFoundException`, `BadRequestException`, `ForbiddenException`, etc.) in controllers en services.
- Zoek naar custom `@Catch()`-filters in `*.filter.ts`-bestanden of foutmiddleware.
- Verifieer dat foutantwoorden correcte HTTP-statuscodes bevatten (400, 401, 403, 404, 500) en een informatieve boodschap.
- Controllers of services die enkel generieke fouten gooien zonder expliciete statuscode tellen niet als degelijke foutafhandeling.

Beoordeel: worden er specifieke foutboodschappen met correcte HTTP-statuscodes afgedwongen?
