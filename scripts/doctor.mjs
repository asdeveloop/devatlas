#!/usr/bin/env node
// filepath: scripts/doctor.mjs

/**
 * DevAtlas Doctor (Sanity Check)
 * Super-fast, fail-fast, short-output
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function fail(msg, hint) {
  console.error(`✗ ${msg}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

function run(cmd, errMsg) {
  try {
    execSync(cmd, { stdio: "pipe", encoding: "utf8" });
  } catch {
    fail(errMsg || `Command failed: ${cmd}`);
  }
}

function readJson(pathname) {
  try {
    return JSON.parse(fs.readFileSync(pathname, "utf8"));
  } catch {
    fail(`Invalid JSON: ${pathname}`);
  }
}

console.log("\n=== DevAtlas Doctor ===\n");

/* 1) Node */
const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 18) fail("Node >=18 required");
ok(`Node v${process.versions.node}`);

/* 2) packageManager */
const pkg = readJson("package.json");

if (pkg.packageManager !== "pnpm@10.33.0") {
  fail(
    "Incorrect pnpm version",
    `Expected: pnpm@10.33.0 (set via corepack)`
  );
}
ok(`packageManager: ${pkg.packageManager}`);

/* 3) pnpm exists */
run("pnpm -v", "pnpm not installed — run: corepack enable");
ok("pnpm available");

/* 4) Required files */
const required = [
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "turbo.json",
  "vitest.config.ts",
  "eslint.config.mjs",
];

for (const f of required) {
  if (!fs.existsSync(f)) fail(`Missing file: ${f}`);
  ok(f);
}

/* 5) Validate TS aliases */
const ts = readJson("tsconfig.base.json");
const paths = ts.compilerOptions?.paths ?? {};

const aliases = [
  "@devatlas/types",
  "@devatlas/types/*",
  "@devatlas/utils",
  "@devatlas/utils/*",
  "@devatlas/config",
  "@devatlas/config/*",
  "@devatlas/content",
  "@devatlas/content/*",
  "@devatlas/api-client",
  "@devatlas/api-client/*",
  "@devatlas/ui",
  "@devatlas/ui/*"
];

for (const a of aliases) {
  if (!paths[a]) fail(`Missing TS alias: ${a}`);
}
ok("TS aliases OK");

/* 6) Workspace integrity */
run("pnpm install --frozen-lockfile", "Workspace install failed");
ok("Workspace OK");

/* 7) Turbo sanity */
run("pnpm turbo run build --dry", "Turbo config invalid");
ok("Turbo OK");

console.log("\n✓ Doctor passed. System looks OK.\n");
