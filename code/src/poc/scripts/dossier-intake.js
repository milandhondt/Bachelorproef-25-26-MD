function stripCodeFences(text) {
  const trimmed = String(text ?? "").trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

function extractJsonObjectCandidates(text) {
  const candidates = [];
  let inString = false;
  let escaped = false;
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") {
      if (depth === 0) start = i;
      depth += 1;
      continue;
    }

    if (ch === "}") {
      if (depth === 0) continue;
      depth -= 1;
      if (depth === 0 && start !== -1) {
        candidates.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return candidates;
}

export function getResponseText(response) {
  if (typeof response?.text === "string") return response.text;
  if (typeof response?.outputText === "string") return response.outputText;
  return String(response?.text ?? response?.outputText ?? "");
}

export function parseJsonResponse(rawText, contextLabel) {
  const normalized = stripCodeFences(rawText);
  if (!normalized) {
    throw new Error(`Leeg modelantwoord ontvangen tijdens ${contextLabel}`);
  }

  const candidates = [normalized, ...extractJsonObjectCandidates(normalized)];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Probeer volgende kandidaat.
    }
  }

  const preview = normalized.slice(0, 400).replace(/\s+/g, " ");
  throw new Error(
    `Kon modelantwoord niet als JSON parsen tijdens ${contextLabel}. Preview: ${preview}`,
  );
}

export function normalizeAanwezigStatus(value) {
  if (typeof value === "boolean") {
    return value ? "aanwezig" : "afwezig";
  }

  if (typeof value !== "string") {
    return "onduidelijk";
  }

  const normalized = value.trim().toLowerCase();

  if (["aanwezig", "present", "true", "yes", "ja"].includes(normalized)) {
    return "aanwezig";
  }

  if (
    ["afwezig", "absent", "missing", "false", "no", "nee"].includes(normalized)
  ) {
    return "afwezig";
  }

  if (
    [
      "onduidelijk",
      "unknown",
      "unclear",
      "inconclusive",
      "partially present",
      "gedeeltelijk",
      "twijfelachtig",
    ].includes(normalized)
  ) {
    return "onduidelijk";
  }

  return "onduidelijk";
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item ?? "").trim()).filter(Boolean);
}

function normalizeBestanden(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const pad = String(item.pad ?? item.path ?? "").trim();
      const reden = String(item.reden ?? item.reason ?? "").trim();
      if (!pad) return null;
      return { pad, reden };
    })
    .filter(Boolean);
}

function normalizeDossierIntake(parsed, projectName) {
  const onderdelen =
    parsed?.onderdelen &&
    typeof parsed.onderdelen === "object" &&
    !Array.isArray(parsed.onderdelen)
      ? parsed.onderdelen
      : {};

  return {
    project: String(parsed?.project ?? projectName),
    samenvatting: String(parsed?.samenvatting ?? "").trim(),
    techStack: normalizeStringArray(parsed?.techStack),
    startInstructies: normalizeStringArray(parsed?.startInstructies),
    onderdelen,
    belangrijksteBestanden: normalizeBestanden(parsed?.belangrijksteBestanden),
    risicos: normalizeStringArray(parsed?.risicos),
    onduidelijkheden: normalizeStringArray(parsed?.onduidelijkheden),
  };
}

export function formatDossierContext(dossier) {
  const onderdelen =
    dossier.onderdelen && typeof dossier.onderdelen === "object"
      ? Object.entries(dossier.onderdelen)
          .map(([naam, info]) => {
            if (!info || typeof info !== "object") {
              return `- ${naam}: niet gespecificeerd`;
            }
            const pad = String(info.pad ?? info.path ?? "onbekend");
            const zekerheid = String(info.zekerheid ?? "onbekend");
            const bewijs = String(info.bewijs ?? "").trim();
            return `- ${naam}: pad=${pad}; zekerheid=${zekerheid}; bewijs=${bewijs}`;
          })
          .join("\n")
      : "- Geen onderdelen gevonden";

  const bestanden = dossier.belangrijksteBestanden
    .map((item) => `- ${item.pad}${item.reden ? ` (${item.reden})` : ""}`)
    .join("\n");

  return [
    `Project: ${dossier.project}`,
    `Samenvatting: ${dossier.samenvatting || "(geen samenvatting)"}`,
    `Tech stack: ${dossier.techStack.join(", ") || "onbekend"}`,
    `Startinstructies: ${dossier.startInstructies.join(" | ") || "onbekend"}`,
    "Onderdelen:",
    onderdelen,
    "Belangrijkste bestanden:",
    bestanden || "- Geen bestanden gevonden",
    `Risicos: ${dossier.risicos.join(" | ") || "geen"}`,
    `Onduidelijkheden: ${dossier.onduidelijkheden.join(" | ") || "geen"}`,
  ].join("\n");
}

function buildDossierIntakePrompt({ sandboxId, sandboxProjectPath }) {
  return `
Voer een VERPLICHTE dossier-intake uit voor dit studentenproject voordat criteria worden geevalueerd.

Sandbox ID: ${sandboxId}
Project root: ${sandboxProjectPath}

Doel van de intake:
- Bouw een algemeen begrip op van het project.
- Zoek eerst documentatie en contextbestanden (README, docs, architectuur, installatie-instructies).
- Lokaliseer de belangrijkste projectonderdelen (frontend, webservices/backend, database, tests).

Gebruik je tools in deze volgorde:
1. listFiles op de project root
2. readFile op relevante documentatiebestanden
3. readFile op configuratiebestanden (bijv. package.json, docker/config files, env voorbeelden)
4. Eventueel runCommand als startprocedure of structuur onduidelijk is

Geef je antwoord als geldige JSON (geen markdown code-fences) met exact deze structuur:
{
  "project": "projectnaam",
  "samenvatting": "korte algemene samenvatting",
  "techStack": ["..."],
  "startInstructies": ["..."],
  "onderdelen": {
    "dossier": { "pad": "...", "zekerheid": "hoog|middel|laag", "bewijs": "..." },
    "frontend": { "pad": "...", "zekerheid": "hoog|middel|laag", "bewijs": "..." },
    "webservices": { "pad": "...", "zekerheid": "hoog|middel|laag", "bewijs": "..." },
    "database": { "pad": "...", "zekerheid": "hoog|middel|laag", "bewijs": "..." },
    "tests": { "pad": "...", "zekerheid": "hoog|middel|laag", "bewijs": "..." }
  },
  "belangrijksteBestanden": [
    { "pad": "...", "reden": "..." }
  ],
  "risicos": ["..."],
  "onduidelijkheden": ["..."]
}
`.trim();
}

export function buildCriteriaPrompt({
  sandboxId,
  sandboxProjectPath,
  domain,
  criteriaText,
  dossierContext,
  specialistName = "Specialist Agent",
  specialistFocus = "algemene criteria-evaluatie",
  coordinatorReason = "geen expliciete routeinformatie",
}) {
  return `
Evalueer het studentenproject dat zich bevindt in de sandbox.

Sandbox ID: ${sandboxId}
Project root: ${sandboxProjectPath}
Topic: Dit criterium is gericht op de ${domain} van het project. Zoek de juiste map op binnen het project alvorens je diepgaand bestanden inleest.

Coordinator routing:
- Gekozen specialist-agent: ${specialistName}
- Focus van deze specialist: ${specialistFocus}
- Routing reden: ${coordinatorReason}

VERPLICHT: gebruik eerst onderstaande dossier-intake context als startpunt en verfijn die met extra tool-calls voor dit specifieke criterium.

${dossierContext}

Gebruik je tools om het project te verkennen:
1. Gebruik listFiles met sandboxId "${sandboxId}" en path "${sandboxProjectPath}" om de mappenstructuur te bekijken
2. Gebruik readFile om relevante bronbestanden te lezen
3. Gebruik runCommand als je commando's wilt uitvoeren

Evalueer het project op basis van het volgende criterium:

${criteriaText}

Beslisstatus (verplicht):
- Gebruik "aanwezig" alleen als je direct en overtuigend bewijs ziet in code/configuratie.
- Gebruik "afwezig" als je voldoende hebt gezocht op relevante plaatsen en het criterium niet aantreft.
- Gebruik "onduidelijk" als bewijs tegenstrijdig is of te beperkt voor een harde ja/nee conclusie.

Geef je antwoord als geldige JSON (geen markdown code-fences) met exact deze structuur:
{
  "criteria": "naam van het criterium",
  "aanwezig": "aanwezig" | "afwezig" | "onduidelijk",
  "bewijs": "uitleg met verwijzingen naar specifieke bestanden en code",
  "feedback": "constructieve feedback voor de student"
}
`.trim();
}

export async function runDossierIntake({
  dossierAgent,
  sandboxId,
  sandboxProjectPath,
  projectName,
  maxSteps = 20,
}) {
  if (!dossierAgent || typeof dossierAgent.generate !== "function") {
    throw new Error("Dossier intake failed: dossierAgent is ongeldig");
  }

  console.log("Running mandatory dossier intake...");
  const prompt = buildDossierIntakePrompt({ sandboxId, sandboxProjectPath });
  const response = await dossierAgent.generate(prompt, { maxSteps });
  const responseText = getResponseText(response);
  const parsed = parseJsonResponse(responseText, "dossier intake");
  const dossier = normalizeDossierIntake(parsed, projectName);

  if (!dossier.samenvatting) {
    throw new Error("Dossier intake failed: samenvatting ontbreekt");
  }

  return dossier;
}
