import "dotenv/config";
import { runEvaluationPipeline } from "./poc/scripts/run-evaluation.js";

try {
  const result = await runEvaluationPipeline();
  console.log("Evaluation completed.");
} catch (error) {
  console.error("Evaluation failed.");
}
