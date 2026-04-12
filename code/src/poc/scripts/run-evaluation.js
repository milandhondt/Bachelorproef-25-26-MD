import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Sandbox } from "@e2b/code-interpreter";
import { mastra } from "../../mastra/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POC = path.resolve(__dirname, "..");

/**
 * Recursively upload a local directory into an E2B sandbox.
 * Skips node_modules and .git directories.
 */
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

/**
 * Run the full evaluation pipeline:
 *  1. Create an E2B sandbox
 *  2. Upload the student project into it
 *  3. Ask the evaluation agent to explore & evaluate the project
 *  4. Parse the structured JSON response
 *  5. Save results to disk
 *  6. Tear down the sandbox
 *
 * @param {object}  opts
 * @param {string}  [opts.projectDir]
 * @param {Array<{domain: string, criteriaFile: string}>} opts.tasks
 */
export async function runEvaluationPipeline(opts = {}) {
  const {
    projectDir = path.join(POC, "projecten", "voorbeeld-project"),
    tasks = [],
  } = opts;

  if (tasks.length === 0) {
    throw new Error("No evaluation tasks provided");
  }

  // ── 1. Create sandbox ────────────────────────────────────────────
  console.log("Creating E2B sandbox...");
  const sandbox = await Sandbox.create({ timeoutMs: 30 * 60 * 1000 });
  console.log(`Sandbox created: ${sandbox.sandboxId}`);

  try {
    // ── 3. Upload project files ──────────────────────────────────────
    const projectName = path.basename(projectDir);
    const sandboxProjectPath = `/home/user/${projectName}`;

    console.log(`Uploading project "${projectName}" to sandbox...`);
    await uploadDirectory(sandbox, projectDir, sandboxProjectPath);
    console.log("Project uploaded.");

    // ── 4. Loop through tasks ─────────────────────────────────────────
    const results = [];
    for (const { domain, criteriaFile } of tasks) {
      console.log(`\nEvaluating [${domain}] criteria: ${criteriaFile}...`);
      
      const criteriaText = await fs.readFile(
        path.join(POC, "criteria", domain, criteriaFile),
        "utf8",
      );

      const agentPrompt = `
Evalueer het studentenproject dat zich bevindt in de sandbox.

Sandbox ID: ${sandbox.sandboxId}
Project root: ${sandboxProjectPath}
Topic: Dit criterium is gericht op de ${domain} van het project. Zoek de juiste map op binnen het project alvorens je diepgaand bestanden inleest.

Gebruik je tools om het project te verkennen:
1. Gebruik listFiles met sandboxId "${sandbox.sandboxId}" en path "${sandboxProjectPath}" om de mappenstructuur te bekijken
2. Gebruik readFile om relevante bronbestanden te lezen
3. Gebruik runCommand als je commando's wilt uitvoeren

Evalueer het project op basis van het volgende criterium:

${criteriaText}

Geef je antwoord als geldige JSON (geen markdown code-fences) met exact deze structuur:
{
  "criteria": "naam van het criterium",
  "aanwezig": true of false,
  "bewijs": "uitleg met verwijzingen naar specifieke bestanden en code",
  "feedback": "constructieve feedback voor de student"
}
`.trim();

      try {
        console.log(`Running agent...`);
        const response = await agent().generate(agentPrompt, { maxSteps: 15 });
        console.log("Agent response received.");

        let parsed;
        try {
          parsed = JSON.parse(response.text);
        } catch {
          const match = String(response.text || "").match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
          } else {
            console.error("Raw response:", response.text);
            throw new Error("Could not parse agent response as JSON");
          }
        }

        const output = {
          criteria: String(parsed.criteria ?? ""),
          aanwezig: Boolean(parsed.aanwezig),
          bewijs: String(parsed.bewijs ?? ""),
          feedback: String(parsed.feedback ?? ""),
          _meta: {
            model: process.env.MODEL || "qwen3-coder:480b-cloud",
            sandboxId: sandbox.sandboxId,
            project: projectName,
            domain,
            criteriaFile,
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
    // ── 8. Cleanup ───────────────────────────────────────────────────
    console.log("Destroying sandbox...");
    await sandbox.kill();
    console.log("Sandbox destroyed.");
  }
}

/** Lazily resolve the agent so the Mastra instance is fully initialised. */
function agent() {
  return mastra.getAgent("evaluationAgent");
}
