Ontvankelijkheidscriterium (Web Services): De applicatie is gemaakt in NodeJS en TypeScript met NestJS als web framework.

Zoek actief naar het volgende in de NestJS-codebase:

- Open `package.json` van de backend en controleer op `@nestjs/core` en `@nestjs/common` in `dependencies`, en `typescript` in `devDependencies`.
- Zoek bewijs voor TypeScript: controleer op een `tsconfig.json` en `.ts`-bronbestanden met type-annotaties.
- Zoek bewijs voor NestJS: controleer op `main.ts` met `NestFactory.create()`, een `app.module.ts` met `@Module()`, en gebruik van `@Controller()` of `@Injectable()` in bronbestanden.

Beslisstatus:

- aanwezig: `@nestjs/core` en `@nestjs/common` aanwezig in `dependencies`, `typescript` in `devDependencies`, en NestJS-bootstrapcode aantoonbaar in `main.ts`.
- afwezig: een of meer van bovenstaande onderdelen ontbreken volledig.
- onduidelijk: dependencies aanwezig maar geen overeenkomstige broncode gevonden, of project is onvolledig opgezet.
