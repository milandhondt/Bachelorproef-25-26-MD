import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import enquirer from "enquirer";
import { runEvaluationPipeline } from "./poc/scripts/run-evaluation.js";

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

async function getFiles(dir, ext = ".md") {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(ext))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

async function startWizard() {
  console.log("==========================================");
  console.log("        Student Project Evaluator         ");
  console.log("==========================================\n");

  // 1. Scan projects
  const projectsDir = path.join(POC, "projecten");
  let projects = await getSubdirectories(projectsDir);
  projects = projects.filter((p) => !p.startsWith("evaluatie"));

  if (projects.length === 0) {
    console.error("No student projects found in src/poc/projecten/");
    process.exit(1);
  }

  try {
    // 2. Prompt for Project
    const { targetProject } = await prompt({
      type: "select",
      name: "targetProject",
      message: "Select a student project to evaluate:",
      choices: projects,
    });

    // 3. Determine applicable domains based on project name
    const isFews = targetProject.startsWith("fews-");
    const domainsToEvaluate = isFews
      ? ["frontend", "webservices"]
      : ["webservices"];

    console.log(
      `\nDetected project type: Evaluating domains: ${domainsToEvaluate.join(", ")}`,
    );

    // 4. Gather all criteria tasks
    const criteriaDir = path.join(POC, "criteria");
    const tasks = [];

    for (const domain of domainsToEvaluate) {
      const criteriaFiles = await getFiles(path.join(criteriaDir, domain));
      for (const criteriaFile of criteriaFiles) {
        tasks.push({ domain, criteriaFile });
      }
    }

    if (tasks.length === 0) {
      console.error(
        `No Markdown criteria files found for the targeted domains.`,
      );
      process.exit(1);
    }

    console.log(
      `\nStarting evaluation pipeline for ${targetProject} against ${tasks.length} criteria...`,
    );

    const results = await runEvaluationPipeline({
      projectDir: path.join(projectsDir, targetProject),
      tasks,
    });

    console.log("\n════════════════════════════════════════════");
    console.log("        Alle evaluaties voltooid              ");
    console.log("══════════════════════════════════════════════");

    for (const result of results) {
      console.log(
        `\n➔ Criterium: [${result.output._meta.domain}] ${result.output.criteria}`,
      );
      console.log(`   Status:    ${result.output.aanwezig}`);
      console.log(`   Bestand:   ${path.basename(result.outputPath)}`);
    }
  } catch (err) {
    if (err !== "") {
      console.error("Evaluatie mislukt.");
      console.error(err instanceof Error ? err.message : err);
    }
    process.exitCode = 1;
  }
}

startWizard();
