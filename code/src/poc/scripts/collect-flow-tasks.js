import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POC = path.resolve(__dirname, "..");

async function getMarkdownFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

function getApplicableDomains(projectDir) {
  const projectName = path.basename(projectDir);
  return projectName.startsWith("fews-")
    ? ["frontend", "webservices"]
    : ["webservices"];
}

async function collectTasks(projectDir, includeFilePredicate, flowLabel) {
  const domains = getApplicableDomains(projectDir);
  const tasks = [];

  for (const domain of domains) {
    const criteriaDir = path.join(POC, "criteria", domain);
    const files = await getMarkdownFiles(criteriaDir);
    const selected = files.filter(includeFilePredicate);

    for (const criteriaFile of selected) {
      tasks.push({ domain, criteriaFile });
    }
  }

  if (tasks.length === 0) {
    throw new Error(
      `Geen criteria gevonden voor flow \"${flowLabel}\". Verwacht markdown-bestanden in src/poc/criteria/<domain>.`,
    );
  }

  return tasks;
}

export async function collectEvaluatiecriteriaTasks(projectDir) {
  return collectTasks(
    projectDir,
    (fileName) => !fileName.toLowerCase().startsWith("ov-"),
    "evaluatiecriteria",
  );
}

export async function collectOntvankelijkheidTasks(projectDir) {
  return collectTasks(
    projectDir,
    (fileName) => fileName.toLowerCase().startsWith("ov-"),
    "ontvankelijkheid",
  );
}
