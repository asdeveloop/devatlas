#!/usr/bin/env node

const target = process.argv[2] ?? "repo";

const CONTEXT = {
  repo: [
    "AGENTS.md",
    "package.json",
    "docs/STANDARDS.md",
    "docs/API-CONTRACE.md",
  ],
  api: [
    "AGENTS.md",
    "apps/api/package.json",
    "apps/api/src/modules",
    "apps/api/src/common",
    "apps/api/src/config",
    "docs/STANDARDS.md",
    "docs/API-CONTRACE.md",
  ],
  web: [
    "AGENTS.md",
    "apps/web/package.json",
    "apps/web/app",
    "apps/web/features",
    "apps/web/lib",
    "next.config.ts",
    "docs/STANDARDS.md",
  ],
  shared: [
    "AGENTS.md",
    "package.json",
    "packages/types",
    "packages/utils",
    "packages/config",
    "packages/ui",
    "docs/STANDARDS.md",
  ],
};

if (!CONTEXT[target]) {
  console.error(`Unknown target "${target}"`);
  process.exit(1);
}

console.log(`# Suggested context for ${target}\n`);
for (const item of CONTEXT[target]) {
  console.log(`- ${item}`);
}
