Controleer de invoervalidatie op REST API-routes.

Zoek actief naar het volgende in de NestJS-codebase:

- Zoek naar DTO-klassen (`*.dto.ts`) met `class-validator`-decorators (`@IsString()`, `@IsEmail()`, `@IsNotEmpty()`, etc.) of schema-validatie via `Zod` of `Joi`.
- Controleer of een `ValidationPipe` globaal geconfigureerd is in `main.ts` via `app.useGlobalPipes()` of per route toegepast wordt.
- Swagger-decorators alleen (`@ApiProperty`) zonder validatielogica tellen niet.
- Verifieer dat ongeldige invoer daadwerkelijk een `400 Bad Request` oplevert.

Beoordeel: wordt invoervalidatie op meerdere routes expliciet toegepast en afgedwongen?
