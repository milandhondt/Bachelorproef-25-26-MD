import { Mastra } from "@mastra/core/mastra";
import {
  DefaultExporter,
  CloudExporter,
  SensitiveDataFilter,
} from "@mastra/core/ai-tracing";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
// @ts-expect-error - No declaration file inside JS evaluation agent
import { evaluationAgent } from "./agents/evaluation-agent.js";
// @ts-expect-error - No declaration file inside JS coordinator/specialist agents
import { evaluationCoordinatorAgent } from "./agents/coordinator-agent.js";
// @ts-expect-error - No declaration file inside JS coordinator/specialist agents
import { dossierAgent } from "./agents/dossier-agent.js";
// @ts-expect-error - No declaration file inside JS coordinator/specialist agents
import { dataLayerAgent } from "./agents/data-layer-agent.js";
// @ts-expect-error - No declaration file inside JS coordinator/specialist agents
import { serviceAgent } from "./agents/service-agent.js";
// @ts-expect-error - No declaration file inside JS coordinator/specialist agents
import { apiAgent } from "./agents/api-agent.js";
// @ts-expect-error - No declaration file inside JS coordinator/specialist agents
import { testAgent } from "./agents/test-agent.js";

export const mastra = new Mastra({
  agents: {
    evaluationAgent,
    evaluationCoordinatorAgent,
    dossierAgent,
    dataLayerAgent,
    serviceAgent,
    apiAgent,
    testAgent,
  },
  bundler: {
    externals: ["supports-color", "bufferutil", "utf-8-validate"],
  },
  storage: new LibSQLStore({ url: "file:../../mastra.db" }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "debug",
  }),
  observability: {
    configs: {
      default: {
        serviceName: "mastra",
        exporters: [
          new DefaultExporter(), // Persists traces to storage for Mastra Studio
          new CloudExporter(), // Sends traces to Mastra Cloud (if MASTRA_CLOUD_ACCESS_TOKEN is set)
        ],
        processors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  },
});
