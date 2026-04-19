import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Sandbox } from "@e2b/code-interpreter";
import { mastra } from "../../mastra/index.js";
import {
  getSpecialistProfile,
  routeCriterionToSpecialist,
} from "../../mastra/agents/coordinator-agent.js";
import {
  buildCriteriaPrompt,
  formatDossierContext,
  getResponseText,
  normalizeAanwezigStatus,
  parseJsonResponse,
  runDossierIntake,
} from "./dossier-intake.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POC = path.resolve(__dirname, "..");

async function uploadDirectory(sandbox, localDir, sandboxDir) {
  const entries = await fs.readdir(localDir, { withFileTypes: true });

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = `${sandboxDir}/${entry.name}`;

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      await uploadDirectory(sandbox, localPath, remotePath);
    } else {
      const content = await fs.readFile(localPath, "utf8");
      await sandbox.files.write(remotePath, content);
    }
  }
}

export async function runEvaluationPipeline(opts = {}) {
  const {
    projectDir = path.join(POC, "projecten", "voorbeeld-project"),
    tasks = [],
  } = opts;

  if (tasks.length === 0) {
    throw new Error("No evaluation tasks provided");
  }

  console.log("Creating E2B sandbox...");
  const sandbox = await Sandbox.create({ timeoutMs: 30 * 60 * 1000 });
  console.log(`Sandbox created: ${sandbox.sandboxId}`);

  try {
    const projectName = path.basename(projectDir);
    const sandboxProjectPath = `/home/user/${projectName}`;

    console.log(`Uploading project "${projectName}" to sandbox...`);
    await uploadDirectory(sandbox, projectDir, sandboxProjectPath);
    console.log("Project uploaded.");

    const dossierAgent = getAgentOrThrow("dossierAgent");
    const dossierIntake = await runDossierIntake({
      dossierAgent,
      sandboxId: sandbox.sandboxId,
      sandboxProjectPath,
      projectName,
    });

    const intakeTs = new Date().toISOString().replace(/[:.]/g, "-");
    const dossierOutputPath = path.join(
      POC,
      "resultaten",
      `dossier-${projectName}-${intakeTs}.json`,
    );
    await fs.mkdir(path.dirname(dossierOutputPath), { recursive: true });
    await fs.writeFile(
      dossierOutputPath,
      JSON.stringify(
        {
          ...dossierIntake,
          _meta: {
            model: process.env.MODEL || "qwen3-coder:480b-cloud",
            sandboxId: sandbox.sandboxId,
            project: projectName,
            timestamp: new Date().toISOString(),
            type: "dossier-intake",
          },
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );
    console.log(`Dossier intake saved to: ${dossierOutputPath}`);

    const dossierContext = formatDossierContext(dossierIntake);

    const results = [];
    for (const { domain, criteriaFile } of tasks) {
      console.log(`\nEvaluating [${domain}] criteria: ${criteriaFile}...`);

      const criteriaText = await fs.readFile(
        path.join(POC, "criteria", domain, criteriaFile),
        "utf8",
      );

      const route = routeCriterionToSpecialist({
        domain,
        criteriaFile,
        criteriaText,
      });
      const specialist = getSpecialistProfile(route.agentKey);
      const specialistAgent = getAgentOrThrow(route.agentKey);
      console.log(
        `Coordinator routed to [${specialist.name}] (${route.reason})`,
      );

      const agentPrompt = buildCriteriaPrompt({
        sandboxId: sandbox.sandboxId,
        sandboxProjectPath,
        domain,
        criteriaText,
        dossierContext,
        specialistName: specialist.name,
        specialistFocus: specialist.focus,
        coordinatorReason: route.reason,
      });

      try {
        console.log(`Running agent...`);
        const response = await specialistAgent.generate(agentPrompt, {
          maxSteps: 15,
        });
        console.log("Agent response received.");

        const parsed = parseJsonResponse(
          getResponseText(response),
          `criteria ${criteriaFile}`,
        );

        const output = {
          criteria: String(parsed.criteria ?? ""),
          aanwezig: normalizeAanwezigStatus(parsed.aanwezig ?? parsed.status),
          bewijs: String(parsed.bewijs ?? ""),
          feedback: String(parsed.feedback ?? ""),
          _meta: {
            model: process.env.MODEL || "qwen3-coder:480b-cloud",
            sandboxId: sandbox.sandboxId,
            project: projectName,
            domain,
            criteriaFile,
            dossierIntakePath: dossierOutputPath,
            specialistAgent: route.agentKey,
            coordinatorReason: route.reason,
            timestamp: new Date().toISOString(),
          },
        };

        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const outputPath = path.join(
          POC,
          "resultaten",
          `eval-${projectName}-${domain}-${criteriaFile.replace(".md", "")}-${ts}.json`,
        );

        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(
          outputPath,
          JSON.stringify(output, null, 2) + "\n",
          "utf8",
        );

        results.push({ outputPath, output });
      } catch (err) {
        console.error(`Evaluation for ${criteriaFile} failed:`, err.message);
      }
    }

    return results;
  } finally {
    console.log("Destroying sandbox...");
    await sandbox.kill();
    console.log("Sandbox destroyed.");
  }
}

function getAgentOrThrow(agentKey) {
  const resolved = mastra.getAgent(agentKey);
  if (!resolved) {
    throw new Error(`Configured agent not found: ${agentKey}`);
  }
  return resolved;
}
