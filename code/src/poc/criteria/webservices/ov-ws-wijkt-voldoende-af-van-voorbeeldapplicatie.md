Ontvankelijkheidscriterium (Web Services): De applicatie wijkt voldoende af van de voorbeeldapplicatie.

Controle-instructies:

- Open de referentielocatie van de voorbeeldapplicatie die in de prompt wordt meegegeven. Gebruik `listFiles` op die locatie om de mappenstructuur te bekijken.
- Vergelijk de volgende elementen concreet tussen studentenproject en voorbeeldproject:
  - Entiteiten/modellen: zijn de domein-entiteiten anders (andere namen, andere verantwoordelijkheden)?
  - Controllers en routes: bedienen de routes een ander domein of andere use cases?
  - Services: verschilt de business logic inhoudelijk, of zijn het herbenoemde kopieën?
  - Databaseschema: hebben de tabellen een ander doel dan die in het voorbeeldproject?
- Lees bronbestanden in beide projecten voordat je een oordeel vormt. Baseer de beoordeling op concrete code- en bestandsverschillen, niet op veronderstellingen.
- Cosmetische verschillen tellen niet: hernoemde variabelen, omgezette commentaren of licht aangepaste routes in hetzelfde domein zijn onvoldoende.

Beslisstatus:

- aanwezig: het studentenproject heeft een ander applicatiedomein of andere use cases dan het voorbeeldproject, aantoonbaar via andere entiteiten, routes of business logic.
- afwezig: het studentenproject gebruikt grotendeels hetzelfde domein, dezelfde entiteiten of dezelfde logica als het voorbeeldproject — ook als namen zijn aangepast.
- onduidelijk: referentieproject niet beschikbaar, of de verschillen zijn te beperkt om een betrouwbaar oordeel te vormen.

Geef een kort, concreet bewijs met bestandsverwijzingen naar beide projecten.
