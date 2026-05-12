Controleer de beveiliging van de API.

Zoek actief naar het volgende in de NestJS-codebase:

- Zoek guard-implementaties (`*.guard.ts`) en verifieer of `canActivate()` tokens of sessies daadwerkelijk valideert — niet enkel `return true`.
- Controleer of `@UseGuards()` toegepast is op controllers of routes, of dat een globale guard geconfigureerd is via `APP_GUARD` in `app.module.ts`.
- Zoek naar de gebruikte auth-strategie: JWT (`JwtStrategy`, `JwtAuthGuard`), Passport-strategie of sessies. In het geval van Passport moet alles via Passport-guards verlopen, niet via custom guards die zelf tokens valideren.

Beoordeel: is er degelijke authenticatie/autorisatie aanwezig en effectief toegepast op afgeschermde routes?
