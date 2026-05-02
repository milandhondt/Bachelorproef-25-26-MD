Controleer of de databasestructuur via migraties beheerd wordt.

Zoek actief naar het volgende in de NestJS-codebase:

- TypeORM: zoek bestanden eindigend op `.migration.ts` of een `migrations/`-map met timestamps in de bestandsnamen.
- Prisma: zoek de map `prisma/migrations/` met gegenereerde SQL-bestanden.
- Drizzle: zoek migratiebestanden gegenereerd via `drizzle-kit` (typisch in een `drizzle/`-map).
- Knex/Sequelize: zoek een `migrations/`-map met genummerde of timestamped bestanden.
- Verifieer dat de gevonden migratiebestanden daadwerkelijke SQL of schema-mutaties bevatten en geen lege stubs zijn.

Beoordeel: zijn er aantoonbare migratiebestanden aanwezig die de databasestructuur beheren?
