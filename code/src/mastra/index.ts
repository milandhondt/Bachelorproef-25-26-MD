import { Mastra } from "@mastra/core/mastra";
import {
  DefaultExporter,
  CloudExporter,
  SensitiveDataFilter,
} from "@mastra/core/ai-tracing";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { evaluationAgent } from "./agents/evaluation-agent.js";

export const mastra = new Mastra({
  agents: { evaluationAgent },
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
