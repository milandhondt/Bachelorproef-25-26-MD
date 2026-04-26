import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectOntvankelijkheidTasks } from "./collect-flow-tasks.js";
import { runEvaluationPipeline } from "./run-evaluation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POC = path.resolve(__dirname, "..");

export async function runOntvankelijkheidPipeline(opts = {}) {
  const {
    projectDir = path.join(POC, "projecten", "voorbeeld-project"),
    tasks,
  } = opts;

  const resolvedTasks =
    Array.isArray(tasks) && tasks.length > 0
      ? tasks
      : await collectOntvankelijkheidTasks(projectDir);

  return runEvaluationPipeline({
    ...opts,
    projectDir,
    tasks: resolvedTasks,
    flowLabel: "ontvankelijkheid",
  });
}
