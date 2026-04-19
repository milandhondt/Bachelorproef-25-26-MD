import { Agent } from "@mastra/core/agent";

export const specialistProfiles = {
  dossierAgent: {
    name: "Dossier Specialist Agent",
    focus: "documentatie, opstartbaarheid, projectcontext",
  },
  dataLayerAgent: {
    name: "Data Layer Specialist Agent",
    focus: "migraties, seeds, datamodel-relaties",
  },
  serviceAgent: {
    name: "Service Layer Specialist Agent",
    focus: "domeinlogica en architectuurgrenzen (geen SQL in service)",
  },
  apiAgent: {
    name: "API Specialist Agent",
    focus: "CRUD, validatie, authenticatie en foutafhandeling",
  },
  testAgent: {
    name: "Test Specialist Agent",
    focus: "integratie- en e2e-testen",
  },
};

const sharedModel = {
  id: `ollama/${process.env.MODEL || "qwen3-coder:480b-cloud"}`,
  url: process.env.OLLAMA_V1_BASE_URL || "http://localhost:11434/v1",
  apiKey: process.env.OLLAMA_API_KEY || "ollama",
};

function keywordRoute(text) {
  if (
    /\b(readme|documentatie|opstart|installatie|architectuur|projectcontext|context)\b/i.test(
      text,
    )
  ) {
    return {
      agentKey: "dossierAgent",
      reason: "keyword-match op documentatie/context",
    };
  }

  if (
    /\b(migrat|seed|database|datalaag|relatie|entit|orm|repository|prisma|typeorm|sql schema)\b/i.test(
      text,
    )
  ) {
    return {
      agentKey: "dataLayerAgent",
      reason: "keyword-match op datalaag",
    };
  }

  if (
    /\b(service|domeinlogica|business logic|geen sql|use case|application service)\b/i.test(
      text,
    )
  ) {
    return {
      agentKey: "serviceAgent",
      reason: "keyword-match op servicelaag",
    };
  }

  if (
    /\b(crud|rest|endpoint|controller|auth|jwt|token|validatie|fout|error|status code|api)\b/i.test(
      text,
    )
  ) {
    return {
      agentKey: "apiAgent",
      reason: "keyword-match op API-laag",
    };
  }

  if (/\b(test|testen|e2e|integrat)\b/i.test(text)) {
    return {
      agentKey: "testAgent",
      reason: "keyword-match op testen",
    };
  }

  return null;
}

export function routeCriterionToSpecialist({
  domain,
  criteriaFile,
  criteriaText,
}) {
  const file = String(criteriaFile || "").toLowerCase();

  if (file.startsWith("ws-datalaag-")) {
    return {
      agentKey: "dataLayerAgent",
      reason: "bestandsprefix ws-datalaag-*",
    };
  }

  if (file.startsWith("ws-servicelaag-")) {
    return {
      agentKey: "serviceAgent",
      reason: "bestandsprefix ws-servicelaag-*",
    };
  }

  if (file.startsWith("ws-rest-")) {
    return { agentKey: "apiAgent", reason: "bestandsprefix ws-rest-*" };
  }

  if (file.includes("integratietesten") || file.includes("e2e-testen")) {
    return {
      agentKey: "testAgent",
      reason: "testcriteria gedetecteerd in bestandsnaam",
    };
  }

  if (file.includes("readme")) {
    return {
      agentKey: "dossierAgent",
      reason: "readme/documentatie-criterium",
    };
  }

  const byKeyword = keywordRoute(`${domain}\n${criteriaFile}\n${criteriaText}`);
  if (byKeyword) return byKeyword;

  if (String(domain).toLowerCase() === "frontend") {
    return {
      agentKey: "apiAgent",
      reason: "frontend fallback naar interface/API specialist",
    };
  }

  return {
    agentKey: "serviceAgent",
    reason: "default fallback naar servicelaag specialist",
  };
}

export function getSpecialistProfile(agentKey) {
  return specialistProfiles[agentKey] ?? specialistProfiles.serviceAgent;
}

export const evaluationCoordinatorAgent = new Agent({
  id: "evaluation-coordinator-agent",
  name: "Evaluation Coordinator Agent",
  instructions: `
You route criteria to the best specialist agent.

Available specialist keys:
- dossierAgent
- dataLayerAgent
- serviceAgent
- apiAgent
- testAgent

Output format:
{
  "agentKey": "one of the specialist keys",
  "reason": "short routing reason"
}

Return raw JSON only.
`.trim(),
  model: sharedModel,
  defaultGenerateOptions: { maxSteps: 6 },
  defaultStreamOptions: { maxSteps: 6 },
});
