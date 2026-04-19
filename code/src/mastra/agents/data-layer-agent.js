import { createSpecialistAgent } from "./specialist-agent-factory.js";

export const dataLayerAgent = createSpecialistAgent({
  id: "data-layer-specialist-agent",
  name: "Data Layer Specialist Agent",
  roleSummary:
    "Evaluate persistence-layer quality with focus on schema evolution, seeds, and relations.",
  focusChecklist: [
    "Check migrations presence, quality, and versioning consistency",
    "Check seed strategy and reproducibility",
    "Check entity/table relationships and referential integrity",
    "Verify data-layer patterns in ORM/repository/database configuration",
  ],
});
