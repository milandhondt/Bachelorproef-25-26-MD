import { createSpecialistAgent } from "./specialist-agent-factory.js";

export const testAgent = createSpecialistAgent({
  id: "test-specialist-agent",
  name: "Test Specialist Agent",
  roleSummary:
    "Evaluate automated testing quality with focus on e2e and integration evidence.",
  focusChecklist: [
    "Detect presence and scope of integration tests",
    "Detect presence and scope of e2e tests",
    "Verify test scripts/configuration and realistic execution targets",
    "Assess evidence quality and mark onduidelijk when coverage is ambiguous",
  ],
});
