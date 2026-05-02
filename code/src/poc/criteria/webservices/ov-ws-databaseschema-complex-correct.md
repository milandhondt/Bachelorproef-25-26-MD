Ontvankelijkheidscriterium (Web Services): Het databankschema is voldoende complex en correct.

Zoek actief naar het volgende in de NestJS-codebase:

1. ORM-definitiestrategie: stel vast welke ORM gebruikt wordt.
   - TypeORM: zoek `*.entity.ts`-bestanden met `@Entity()`, `@Column()`, relatie-decorators.
   - Prisma: lees `schema.prisma` en zoek `model`-blokken met relaties.
   - Drizzle: zoek een `schema.ts` of andere bestanden met `defineTable()`-aanroepen en relatie-definities.
   - Andere: zoek migraties of schema-bestanden als bovenstaande niet gevonden worden.
2. Entiteiten tellen: tel het aantal entiteiten/modellen exclusief `User` (en varianten als `users`). Vereiste: minimaal 3 extra entiteiten.
3. Veel-op-veel relatie: zoek naar `@ManyToMany` + `@JoinTable` (TypeORM), een koppeltabel in migraties, of een impliciet/expliciet Prisma many-to-many (twee `[]`-relaties die naar elkaar verwijzen). Vereiste: minimaal 1 aantoonbare veel-op-veel relatie.
4. Kolomrijkheid: verifieer dat entiteiten meer bevatten dan enkel `id` — ze moeten domein-relevante kolommen hebben met passende types (geen schema van enkel id-kolommen).
5. Correctheid: controleer of relaties bidirectioneel consistent zijn (bv. beide kanten van een `@OneToMany`/`@ManyToOne` zijn gedefinieerd) en of koppeltabellen of junction-modellen correct zijn opgezet.

Beslisstatus:

- aanwezig: minimaal 3 entiteiten naast User, minimaal 1 veel-op-veel relatie aantoonbaar, en entiteiten bevatten domein-relevante kolommen.
- afwezig: minder dan 3 extra entiteiten, geen veel-op-veel relatie gevonden, of schema bestaat enkel uit id-velden.
- onduidelijk: entiteiten zijn gedeeltelijk gedefinieerd, relaties zijn inconsistent gedeclareerd, of ORM-bestanden ontbreken terwijl migraties wel bestaan.
