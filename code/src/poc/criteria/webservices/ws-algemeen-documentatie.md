Controleer op de aanwezigheid van API-documentatie.

Zoek actief naar het volgende in de NestJS-codebase:

- Controleer of er een documentatie-framework zoals Swagger/OpenAPI is toegevoegd (meestal via `@nestjs/swagger`).
- Controleer het `main.ts` bestand voor Swagger-setup logica (`SwaggerModule.setup(...)`, `DocumentBuilder`).
- Zoek naar Swagger/OpenAPI-decorators (b.v. `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`, `@ApiProperty()`) op controllerklassen, DTO's en model-klassen.

Belangrijke extra vereisten:

- Vermeld in het bewijs of API-documentatie effectief is opgezet.
- Geef aan of de bijhorende decorators correct en voldoende zijn toegepast op controllers en DTO's.

Beoordeel: is de API voorzien van leesbare en correct gegenereerde documentatie?
