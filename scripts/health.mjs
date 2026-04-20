#!/usr/bin/env node
// filepath: scripts/health.mjs

/**
 * DevAtlas Health Pipeline
 * Parallel, Short-Output, Production-Grade
 */

import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const verbose = process.argv.includes("--verbose");

const errors = [];
function ok(msg) { console.log(`✓ ${msg}`); }
function shortFail(msg) { console.error(`✗ ${msg}`); }
function step(title) { console.log(`\n🔷 ${title}\n`); }

/* Find workspace packages */
function getPackages() {
  const roots = [
    "packages/types",
    "packages/utils",
    "packages/config",
    "packages/content",
    "packages/api-client",
    "packages/ui",
    "apps/api",
    "apps/web",
  ];

  return roots
    .filter(dir => fs.existsSync(path.join(root, dir, "package.json")))
    .map(dir => ({
      dir,
      name: JSON.parse(fs.readFileSync(path.join(root, dir, "package.json"), "utf8")).name
    }));
}

const packages = getPackages();

/* Run a command and capture first error line */
function run(task, pkg, cmd) {
  const label = `[${task}] ${pkg}`;
  const res = spawnSync(cmd, {
    cwd: root,
    shell: true,
    stdio: verbose ? "inherit" : "pipe",
    encoding: "utf8",
  });

  if (res.status === 0) {
    ok(label);
    return;
  }

  const firstLine =
    (res.stderr || "").split("\n")[0] ||
    (res.stdout || "").split("\n")[0] ||
    "Failed";

  errors.push({ task, pkg, message: firstLine });
  shortFail(label);

  if (verbose) {
    console.error(res.stderr);
    console.error(res.stdout);
  }
}

/* Final summary */
function summary() {
  if (errors.length === 0) {
    console.log("\n✓ All systems healthy!\n");
    process.exit(0);
  }

  console.log("\n✗ Health check failed.\n");

  for (const e of errors) {
    console.log(`  → [${e.task}] ${e.pkg}: ${e.message}`);
  }

  console.log("\nUse --verbose for detailed logs.\n");
  process.exit(1);
}

console.log("\n=== DevAtlas Health Check (Parallel) ===\n");
console.log(`Found ${packages.length} workspaces.\n`);

/* 1) Install */
step("Workspace Integrity");
try {
  execSync("pnpm install --frozen-lockfile", {
    stdio: verbose ? "inherit" : "pipe",
  });
  ok("install");
} catch (err) {
  shortFail("install");
  if (verbose) console.error(err.stderr?.toString?.());
  errors.push({
    task: "install",
    pkg: "root",
    message: (err.stderr || "").toString().split("\n")[0] || "Failed",
  });
  summary();
}

/* Define tasks */
const tasks = {
  typecheck: pkg => run("typecheck", pkg.name, `pnpm --filter ${pkg.name} run typecheck`),
  lint:      pkg => run("lint",      pkg.name, `pnpm --filter ${pkg.name} run lint`),
  test:      pkg => run("test",      pkg.name, `pnpm --filter ${pkg.name} run test`),
  build:     pkg => run("build",     pkg.name, `pnpm --filter ${pkg.name} run build`),
};

/* 2) Parallel Execution */
async function runParallel(title, taskFn) {
  step(title);
  await Promise.all(
    packages.map(pkg => new Promise(resolve => {
      try {
        taskFn(pkg);
      } finally {
        resolve();
      }
    }))
  );
}

await runParallel("Typecheck", tasks.typecheck);
await runParallel("Lint", tasks.lint);
await runParallel("Tests", tasks.test);
await runParallel("Build", tasks.build);

summary();
