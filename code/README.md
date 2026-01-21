# Mijn BP project opstarten

## .env file
Maak een .env file aan in de **code** map. Hierin komen volgende zaken:
```
OPENAI_API_KEY=sk-proj-...
E2B_API_KEY=e2b_...
MODEL="openai/gpt-4o-mini"
```

De API keys zijn gratis aan te vragen op volgende manier:
- OPENAI_API_KEY:
1. Ga naar https://platform.openai.com/settings/organization/api-keys en log in of maak een account aan.
2. Maak een nieuwe key aan met een naam en project naar keuze. Laat de permissies voor het gemak op 'All' staan.
3. Voeg de key, startende met "sk-proj-" toe aan uw .env file met als variabelenaam "OPENAI_API_KEY".
  
- E2B_API_KEY:
1. Ga naar https://e2b.dev/sign-in en log in of maak een account aan.
2. Ga links naar het tabje "API keys" en maak een nieuwe key aan met een naam naar keuze.
3. Voeg de key, startende met "e2b_" toe aan uw .env file met als variabelenaam "E2B_API_KEY".

Het model is volledig zelf te kiezen. Bij het aanmaken van een nieuwe key is er standaard een gratis budget op uw account wat u kan opgebruiken. Hoe sterker het model, hoe sneller dat budget op zal zijn. 

## Het project opstarten
Om het project op te starten opent u een terminal venster, en navigeert u naar de map "code" binnen deze repo.
Hier voert u het commando ```npm run dev``` uit, om de applicatie op te starten. Wanneer de applicatie is opgestart, kunt u in een browser naar http://localhost:4111 surfen, om via een grafische interface te interacten met de coding agent.
