import "dotenv/config";
import { runEvaluationPipeline } from "./poc/scripts/run-evaluation.js";

try {
  const result = await runEvaluationPipeline();
  console.log("Evaluatie voltooid.");
  console.log(`Resultaat weggeschreven naar: ${result.outputPath}`);
  console.log(JSON.stringify(result.output, null, 2));
} catch (error) {
  console.error("Evaluatie mislukt.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
