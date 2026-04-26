import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POC = path.resolve(__dirname, "..");

const ONTVANKELIJKHEID_FILES = {
  frontend: new Set([
    "ov-fe-react.md",
    "ov-fe-start-readme-docker.md",
    "ov-fe-geen-gevoelige-bestanden.md",
    "ov-fe-extra-technologie.md",
    "ov-fe-e2e-niet-triviaal.md",
    "ov-fe-voldoende-complex.md",
    "ov-fe-wijkt-voldoende-af-van-voorbeeldapplicatie.md",
  ]),
  webservices: new Set([
    "ov-ws-node-typescript-nest.md",
    "ov-ws-start-readme-docker.md",
    "ov-ws-geen-gevoelige-bestanden.md",
    "ov-ws-extra-technologie.md",
    "ov-ws-integratietesten-niet-triviaal.md",
    "ov-ws-databaseschema-complex-correct.md",
    "ov-ws-auth-op-routes.md",
    "ov-ws-wijkt-voldoende-af-van-voorbeeldapplicatie.md",
  ]),
};

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
  const domains = getApplicableDomains(projectDir);
  const tasks = [];

  for (const domain of domains) {
    const criteriaDir = path.join(POC, "criteria", domain);
    const files = await getMarkdownFiles(criteriaDir);
    const selected = files.filter((fileName) =>
      ONTVANKELIJKHEID_FILES[domain]?.has(fileName),
    );

    for (const criteriaFile of selected) {
      tasks.push({ domain, criteriaFile });
    }
  }

  if (tasks.length === 0) {
    throw new Error(
      "Geen ontvankelijkheidscriteria gevonden. Verwacht ov-bestanden in src/poc/criteria/<domain>.",
    );
  }

  return tasks;
}
