#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const MIGRATE_PREFIX = "migrate-app_";
const SKIP_WORKTREE = "migrate-app_base";
const REQUIRED_COMPONENT_DOCS = [
  "02-design-system-foundation.md",
  "06-component-standards.md",
];

function toPosix(inputPath) {
  return inputPath.split(path.sep).join("/");
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function asRelativeFromRepo(repoRoot, absolutePath) {
  return toPosix(path.relative(repoRoot, absolutePath));
}

function asRelativeFromHub(worktreeHub, absolutePath) {
  return toPosix(path.relative(worktreeHub, absolutePath));
}

function printMissing(missingItems) {
  console.error("\nBatch 2 source validation failed. Missing items:");
  for (const item of missingItems) {
    console.error(`- ${item.appName}`);
    for (const missingPath of item.missing) {
      console.error(`  - ${missingPath}`);
    }
  }
}

async function writeFile(targetPath, content) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content, "utf8");
}

function createSourceMapMarkdown(appRecords, generatedAt) {
  const lines = [
    "# Batch 2 App Source Map",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "Use this map when running Batch 2 from `feat_ui` (`feat/ui` branch).",
    "Keep branch on `feat/ui`; do not checkout app migrate branches.",
    "",
    "| App | Branch | APP_PATH override | 02 doc | 06 doc |",
    "| --- | --- | --- | --- | --- |",
  ];

  for (const app of appRecords) {
    const doc02 = app.requiredDocs.find((doc) => doc.fileName === "02-design-system-foundation.md");
    const doc06 = app.requiredDocs.find((doc) => doc.fileName === "06-component-standards.md");

    lines.push(
      `| ${app.appName} | ${app.branch} | \`${app.appPathFromFeatUi}\` | \`${doc02.relativeFromFeatUi}\` | \`${doc06.relativeFromFeatUi}\` |`,
    );
  }

  lines.push("");
  lines.push("## How to execute Batch 2");
  lines.push("");
  lines.push("1. Run `pnpm prepare:batch2-sources` from `feat_ui` to refresh this map.");
  lines.push("2. In your Batch 2 prompt session, read:");
  lines.push("- All files in `packages/ui/docs/normalization/per-app/*_baseline-summary.md`.");
  lines.push("- For each app in table above: its `02-design-system-foundation.md` and `06-component-standards.md`.");
  lines.push("3. When the prompt references `<APP_PATH>`, use the `APP_PATH override` column from this table for that app.");
  lines.push("4. Commit only on `feat/ui`.");

  return `${lines.join("\n")}\n`;
}

function createPromptTemplate(appRecords) {
  const lines = [
    "You are a Principal Design System Architect on branch `feat/ui`.",
    "",
    "Read ALL of these before starting:",
    "- `packages/ui/docs/normalization/per-app/*_baseline-summary.md`",
    ...appRecords.flatMap((app) =>
      app.requiredDocs.map((doc) => `- \`${doc.relativeFromFeatUi}\` (${app.appName})`),
    ),
    "- `packages/ui/src/**`",
    "- `packages/config/**`",
    "- `packages/helper/**`",
    "- `packages/interface/**`",
    "",
    "If any required file is missing, STOP and report it.",
    "",
    "Batch 2 outputs must be created in:",
    "- `packages/ui/docs/normalization/_output/`",
  ];

  return `${lines.join("\n")}\n`;
}

async function main() {
  const repoRoot = process.cwd();
  const worktreeHub = path.dirname(repoRoot);

  const perAppSummaryDir = path.join(
    repoRoot,
    "packages",
    "ui",
    "docs",
    "normalization",
    "per-app",
  );

  if (!(await pathExists(perAppSummaryDir))) {
    throw new Error(`Missing directory: ${perAppSummaryDir}`);
  }

  const siblingEntries = await fs.readdir(worktreeHub, { withFileTypes: true });
  const migrateWorktrees = siblingEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name.startsWith(MIGRATE_PREFIX))
    .filter((name) => name !== SKIP_WORKTREE)
    .sort();

  if (migrateWorktrees.length === 0) {
    throw new Error(`No sibling '${MIGRATE_PREFIX}*' directories found under: ${worktreeHub}`);
  }

  const appRecords = [];
  const missingItems = [];

  for (const worktreeName of migrateWorktrees) {
    const appName = worktreeName.slice(MIGRATE_PREFIX.length);
    const branch = `migrate-app/${appName}`;
    const sourceAppRoot = path.join(worktreeHub, worktreeName, "apps", appName);
    const sourceComponentDir = path.join(sourceAppRoot, "docs", "migration", "component");

    const baselineSummaryPath = path.join(perAppSummaryDir, `${appName}_baseline-summary.md`);

    const missing = [];

    if (!(await pathExists(sourceAppRoot))) {
      missing.push(`source app root not found: ${asRelativeFromHub(worktreeHub, sourceAppRoot)}`);
    }

    if (!(await pathExists(baselineSummaryPath))) {
      missing.push(
        `baseline summary not found: ${asRelativeFromRepo(repoRoot, baselineSummaryPath)}`,
      );
    }

    const requiredDocs = [];
    for (const fileName of REQUIRED_COMPONENT_DOCS) {
      const absolutePath = path.join(sourceComponentDir, fileName);
      const exists = await pathExists(absolutePath);
      if (!exists) {
        missing.push(`required doc not found: ${asRelativeFromHub(worktreeHub, absolutePath)}`);
        continue;
      }

      requiredDocs.push({
        fileName,
        absolutePath: toPosix(absolutePath),
        relativeFromFeatUi: asRelativeFromRepo(repoRoot, absolutePath),
      });
    }

    if (missing.length > 0) {
      missingItems.push({ appName, missing });
      continue;
    }

    appRecords.push({
      appName,
      branch,
      worktree: worktreeName,
      appPathFromFeatUi: asRelativeFromRepo(repoRoot, sourceAppRoot),
      baselineSummaryFromFeatUi: asRelativeFromRepo(repoRoot, baselineSummaryPath),
      requiredDocs,
    });
  }

  if (missingItems.length > 0) {
    printMissing(missingItems);
    process.exitCode = 1;
    return;
  }

  const outputDir = path.join(repoRoot, "packages", "ui", "docs", "normalization", "_batch2");
  const generatedAt = new Date().toISOString();

  const sourceMap = {
    generatedAt,
    repoRoot: toPosix(repoRoot),
    worktreeHub: toPosix(worktreeHub),
    appCount: appRecords.length,
    apps: appRecords,
  };

  await writeFile(path.join(outputDir, "source-map.json"), `${JSON.stringify(sourceMap, null, 2)}\n`);
  await writeFile(path.join(outputDir, "source-map.md"), createSourceMapMarkdown(appRecords, generatedAt));
  await writeFile(path.join(outputDir, "batch2-ready-prompt.md"), createPromptTemplate(appRecords));

  console.log(`Batch 2 sources ready for ${appRecords.length} app(s).`);
  console.log(`Source map: ${toPosix(path.join(outputDir, "source-map.md"))}`);
  console.log(`Prompt seed: ${toPosix(path.join(outputDir, "batch2-ready-prompt.md"))}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});