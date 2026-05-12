Controleer formuliervalidatie in de React-componenten.

Zoek actief naar het volgende in de React-codebase:

- Zoek componenten die een `<form>`-element of formulier-JSX bevatten en lees hun implementatie.
- Verifieer dat validatie aantoonbaar aanwezig is via een van de volgende patronen: `react-hook-form` (`useForm()`, `register()`, `handleSubmit()`, `errors`), `formik` (`useFormik()`, `<Formik>`, `validationSchema`), `yup`/`zod` validators, of expliciete state-gebaseerde checks die het verzenden blokkeren en een foutmelding renderen bij ongeldige invoer.
- Telt niet mee: een `required`-attribuut op een HTML-input zonder verdere validatielogica in de React-code.

Beoordeel: is formuliervalidatie aantoonbaar geïmplementeerd in React-code, niet enkel via HTML-attributen?
