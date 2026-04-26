import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectEvaluatiecriteriaTasks } from "./collect-flow-tasks.js";
import { runEvaluationPipeline } from "./run-evaluation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POC = path.resolve(__dirname, "..");

export async function runEvaluatiecriteriaPipeline(opts = {}) {
  const {
    projectDir = path.join(POC, "projecten", "voorbeeld-project"),
    tasks,
  } = opts;

  const resolvedTasks =
    Array.isArray(tasks) && tasks.length > 0
      ? tasks
      : await collectEvaluatiecriteriaTasks(projectDir);

  return runEvaluationPipeline({
    ...opts,
    projectDir,
    tasks: resolvedTasks,
    flowLabel: "evaluatiecriteria",
  });
}
