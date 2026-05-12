Controleer de databaseschema's op relaties tussen entiteiten.

Zoek actief naar het volgende in de NestJS-codebase:

- Zoek de ORM-definitiebestanden: `*.entity.ts` (TypeORM), `schema.prisma` (Prisma) of `schema.ts` (Drizzle).
- Tel het aantal entiteiten/modellen en verifieer of er minimaal 3 zijn die via relaties met elkaar verbonden zijn.
- Controleer specifiek op relatie-declaraties: `@OneToMany`, `@ManyToOne`, `@ManyToMany` + `@JoinTable` (TypeORM), of `@relation`-velden in Prisma-modellen.
- Entiteiten zonder enige relatie tellen niet mee als bewijs voor een relationeel schema.

Beoordeel: zijn er minstens 3 verbonden entiteiten met aantoonbare relaties aanwezig?
