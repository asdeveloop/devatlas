// packages/ui/report-ui-violations.ts

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// --- ESM Support for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// چون فایل در ریشه packages/ui قرار دارد
const UI_ROOT = __dirname;
const SRC_ROOT = path.join(UI_ROOT, "src");
const exts = [".ts", ".tsx", ".js", ".jsx"];

function isCodeFile(file: string) {
  return exts.includes(path.extname(file));
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (isCodeFile(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  if (!fs.existsSync(SRC_ROOT)) {
    console.error(`No src directory found at: ${SRC_ROOT}`);
    process.exit(1);
  }

  const files = walk(SRC_ROOT);
  const report: { file: string; issues: string[] }[] = [];

  for (const file of files) {
    const code = fs.readFileSync(file, "utf8");
    const issues: string[] = [];

    // Check for violations
    if (code.match(/@\/registry\//)) {
      issues.push('Uses "@/registry/..." alias');
    }
    if (code.match(/@\/app\//)) {
      issues.push('Uses "@/app/..." alias (app-level import)');
    }
    if (code.match(/from\s+["']radix-ui["']/)) {
      issues.push('Uses bare "radix-ui" import');
    }
    if (code.match(/from\s+["']apps\//)) {
      issues.push('Imports from apps/* (forbidden)');
    }

    if (issues.length > 0) {
      report.push({
        file: path.relative(UI_ROOT, file),
        issues,
      });
    }
  }

  if (report.length === 0) {
    console.log("✅ No violations found.");
    return;
  }

  console.log(`❌ Found ${report.length} files with violations:\n`);
  for (const item of report) {
    console.log(`- ${item.file}`);
    item.issues.forEach((issue) => console.log(`    • ${issue}`));
  }
}

main();
