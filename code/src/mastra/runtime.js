import { Mastra } from "@mastra/core/mastra";
import { evaluationAgent } from "./agents/evaluation-agent.js";

export const mastra = new Mastra({
  agents: { evaluationAgent },
});
