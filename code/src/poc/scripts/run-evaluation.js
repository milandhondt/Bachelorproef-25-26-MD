import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mastra } from "../../mastra/runtime.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POC = path.resolve(__dirname, "..");

export async function runEvaluationPipeline() {
  const criteria = await fs.readFile(
    path.join(POC, "criteria", "testing.md"),
    "utf8",
  );
  const prompt = await fs.readFile(
    path.join(POC, "prompts", "detecteer_testing.txt"),
    "utf8",
  );
  const project = await fs.readFile(
    path.join(POC, "projecten", "voorbeeld-project.md"),
    "utf8",
  );

  const agentPrompt = `Evalueer dit studentenproject op basis van een criterium.
Geef ALLEEN geldige JSON terug met exact deze opbouw:
{"criteria": string, "aanwezig": boolean, "bewijs": string}

Criteriumdetails:
${criteria}

Extra evaluatie-instructies:
${prompt}

Projectcontext:
${project}`;

  const agent = mastra.getAgent("evaluationAgent");
  const response = await agent.generate(agentPrompt);

  let parsed;
  try {
    parsed = JSON.parse(response.text);
  } catch {
    const match = String(response.text || "").match(/\{[\s\S]*\}/);
    parsed = JSON.parse(match ? match[0] : "{}");
  }

  const output = {
    criteria: String(parsed.criteria ?? ""),
    aanwezig: Boolean(parsed.aanwezig),
    bewijs: String(parsed.bewijs ?? ""),
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = path.join(
    POC,
    "resultaten",
    `test-voorbeeld-project-${timestamp}.json`,
  );

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(output, null, 2) + "\n",
    "utf8",
  );

  return { outputPath, output };
}
