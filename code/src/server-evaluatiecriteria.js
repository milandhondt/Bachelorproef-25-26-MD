import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import enquirer from "enquirer";
import { runEvaluatiecriteriaPipeline } from "./poc/scripts/run-evaluatiecriteria.js";

const { prompt } = enquirer;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POC = path.resolve(__dirname, "poc");

async function getSubdirectories(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

async function startWizard() {
  console.log("==========================================");
  console.log("      Evaluatiecriteria Evaluator         ");
  console.log("==========================================\n");

  const projectsDir = path.join(POC, "projecten");
  let projects = await getSubdirectories(projectsDir);
  projects = projects.filter((p) => !p.startsWith("evaluatie"));

  if (projects.length === 0) {
    console.error("No student projects found in src/poc/projecten/");
    process.exit(1);
  }

  try {
    const { targetProject } = await prompt({
      type: "select",
      name: "targetProject",
      message: "Select a student project:",
      choices: projects,
    });

    const { results, bundleOutputPath, failures } =
      await runEvaluatiecriteriaPipeline({
        projectDir: path.join(projectsDir, targetProject),
      });

    console.log("\n════════════════════════════════════════════");
    console.log("      Evaluatiecriteria voltooid           ");
    console.log("══════════════════════════════════════════════");

    for (const result of results) {
      console.log(
        `\n➔ Criterium: [${result.output._meta.domain}] ${result.output.criteria}`,
      );
      console.log(`   Status:    ${result.output.aanwezig}`);
    }

    if (failures.length > 0) {
      console.log(`\nMislukte criteria: ${failures.length}`);
    }

    console.log(`\nBundle bestand: ${path.basename(bundleOutputPath)}`);
  } catch (err) {
    console.error("Evaluatiecriteria-flow mislukt.");
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}

startWizard();
