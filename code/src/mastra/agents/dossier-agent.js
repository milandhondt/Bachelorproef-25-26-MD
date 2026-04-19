import { createSpecialistAgent } from "./specialist-agent-factory.js";

export const dossierAgent = createSpecialistAgent({
  id: "dossier-specialist-agent",
  name: "Dossier Specialist Agent",
  roleSummary:
    "Analyze project documentation, startup procedure, and high-level project context before detailed criterion checks.",
  focusChecklist: [
    "Locate README/docs and extract setup and run instructions",
    "Determine project structure and major components",
    "Detect context risks and ambiguities that impact evaluation certainty",
    "Reference concrete files that justify the project-level understanding",
  ],
});
