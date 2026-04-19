import { createSpecialistAgent } from "./specialist-agent-factory.js";

export const apiAgent = createSpecialistAgent({
  id: "api-specialist-agent",
  name: "API Specialist Agent",
  roleSummary:
    "Evaluate interface/API layer concerns such as CRUD completeness, validation, authentication, and error handling.",
  focusChecklist: [
    "Check CRUD endpoint completeness and consistency",
    "Check request validation and DTO/schema usage",
    "Check authentication/authorization enforcement",
    "Check error handling, status codes, and failure responses",
  ],
});
