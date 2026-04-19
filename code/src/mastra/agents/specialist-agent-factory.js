import { Agent } from "@mastra/core/agent";
import {
  listFiles,
  readFile,
  runCommand,
  checkFileExists,
  getFileInfo,
} from "../tools/index.js";

const sharedModel = {
  id: `ollama/${process.env.MODEL || "qwen3-coder:480b-cloud"}`,
  url: process.env.OLLAMA_V1_BASE_URL || "http://localhost:11434/v1",
  apiKey: process.env.OLLAMA_API_KEY || "ollama",
};

const sharedTools = {
  listFiles,
  readFile,
  runCommand,
  checkFileExists,
  getFileInfo,
};

function formatChecklist(items) {
  return items.map((item, idx) => `${idx + 1}. ${item}`).join("\n");
}

export function createSpecialistAgent({
  id,
  name,
  roleSummary,
  focusChecklist,
}) {
  return new Agent({
    id,
    name,
    instructions: `
# ${name}

You are a specialist evaluation agent for student software projects.

## Scope
${roleSummary}

## Focus Checklist
${formatChecklist(focusChecklist)}

## Tool Usage Rules
- Every tool call requires a sandboxId from the user prompt.
- Start with listFiles on the given project root.
- Read only files that are relevant for the criterion.
- Use runCommand only when file inspection is not enough.

## Output Contract (MANDATORY)
Return valid JSON with exactly this structure:

{
  "criteria": "name of the criterion",
  "aanwezig": "aanwezig" | "afwezig" | "onduidelijk",
  "bewijs": "evidence with concrete file paths and code references",
  "feedback": "constructive, actionable feedback"
}

Status policy:
- Use "aanwezig" only for strong, direct evidence.
- Use "afwezig" only when relevant places were checked and criterion is missing.
- Use "onduidelijk" for insufficient or contradictory evidence.

Return only raw JSON, never markdown fences.
`.trim(),
    model: sharedModel,
    tools: sharedTools,
    defaultGenerateOptions: { maxSteps: 20 },
    defaultStreamOptions: { maxSteps: 20 },
  });
}
