Ontvankelijkheidscriterium (Web Services): Er is degelijke autorisatie/authenticatie op alle routes.

Zoek actief naar het volgende in de NestJS-codebase:

1. Globale guard: controleer `app.module.ts` en `main.ts` op een `APP_GUARD`-provider of `app.useGlobalGuards(...)`.
2. Route-level guards: zoek `@UseGuards()` op klassen en methoden in alle `*.controller.ts`-bestanden.
3. Guard-implementatie: lees `*.guard.ts`-bestanden en verifieer of `canActivate()` tokens of sessies daadwerkelijk valideert (niet alleen `return true`).
4. Vrijgestelde routes: zoek naar `@Public()`, `@SkipAuth()` of vergelijkbare decorators die routes expliciet uitsluiten van authenticatie.
5. Auth-module: controleer of `JwtModule`, `PassportModule` of een gelijkwaardige auth-module geconfigureerd is.

Beslisstatus:

- aanwezig: aantoonbaar guard-mechanisme aanwezig én toegepast op beschermde routes; vrijgestelde routes zijn expliciet gemarkeerd, of een sluitende globale guard dekt alle routes.
- afwezig: geen guards gevonden, guards zijn gedefinieerd maar nergens toegepast, of `canActivate()` keert altijd `true` terug zonder validatie.
- onduidelijk: guards bestaan maar dekking over alle routes is niet verifieerbaar, of alleen bepaalde controllers zijn beschermd zonder duidelijke intentie.
