import { createSpecialistAgent } from "./specialist-agent-factory.js";

export const serviceAgent = createSpecialistAgent({
  id: "service-layer-specialist-agent",
  name: "Service Layer Specialist Agent",
  roleSummary:
    "Evaluate service/business layer concerns such as domain logic placement and architectural boundaries.",
  focusChecklist: [
    "Verify domain logic is implemented in service/use-case layer",
    "Detect SQL leakage into service layer and assess boundary violations",
    "Check separation of concerns between controller, service, and repository",
    "Document architecture uncertainty using the tri-state policy",
  ],
});
