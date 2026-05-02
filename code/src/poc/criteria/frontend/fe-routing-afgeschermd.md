Controleer de client-side routebeveiliging.

Zoek actief naar het volgende in de React-codebase:

- Zoek naar routeringsconfiguratie via `react-router-dom` (`<Routes>`, `<Route>`, `createBrowserRouter`) of een vergelijkbare bibliotheek.
- Verifieer dat er een beveiligde route-wrapper aanwezig is (`PrivateRoute`, `ProtectedRoute`, `AuthGuard` of vergelijkbaar) die controleert op authenticatiestatus (token, gebruikersobject of auth-context) vóór het renderen van beschermde pagina's.
- Controleer dat niet-geauthenticeerde gebruikers worden doorgestuurd (`<Navigate to="/login" />` of `navigate('/login')`) in plaats van de beschermde pagina te renderen.

Beoordeel: zijn beschermde routes aantoonbaar afgeschermd van niet-geauthenticeerde gebruikers?
