Controleer de isolatie van de datalaag.

Zoek actief naar het volgende in de NestJS-codebase:

- Lees de servicebestanden (`*.service.ts`) en zoek naar directe database-toegang: ruwe SQL-strings, `connection`-objecten, of ORM-adapter-imports buiten een repository (bv. `DataSource` direct in een service).
- Verifieer dat query-logica zich bevindt in aparte repository- of DAO-bestanden (`*.repository.ts`, `*.dao.ts`), of via geïnjecteerde ORM-repositories (`@InjectRepository()`).
- Een `@InjectRepository()`-aanroep in een service is correct; directe SQL of query-builder-aanroepen in de servicelaag zijn niet toegestaan.

Beoordeel: bevat de servicelaag geen ruwe SQL of directe databanktoegang?
