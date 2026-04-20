#!/usr/bin/env node

import { execSync } from "node:child_process";

const target = process.argv[2];
const requestedChecks = process.argv.slice(3);

const TARGETS = {
  api: {
    label: "@devatlas/api",
    checks: {
      lint: "pnpm lint:api",
      typecheck: "pnpm typecheck:api",
      test: "pnpm test:api",
      build: "pnpm build:api",
      verify: "pnpm verify:api",
    },
  },
  web: {
    label: "@devatlas/web",
    checks: {
      lint: "pnpm lint:web",
      typecheck: "pnpm typecheck:web",
      test: "pnpm test:web",
      build: "pnpm build:web",
      verify: "pnpm verify:web",
    },
  },
  types: {
    label: "@devatlas/types",
    checks: {
      lint: "pnpm --filter @devatlas/types lint",
      typecheck: "pnpm --filter @devatlas/types typecheck",
      test: "pnpm --filter @devatlas/types test",
      build: "pnpm --filter @devatlas/types build",
    },
    consumers: ["api"],
  },
  utils: {
    label: "@devatlas/utils",
    checks: {
      lint: "pnpm --filter @devatlas/utils lint",
      typecheck: "pnpm --filter @devatlas/utils typecheck",
      test: "pnpm --filter @devatlas/utils test",
      build: "pnpm --filter @devatlas/utils build",
    },
    consumers: ["api", "web"],
  },
  config: {
    label: "@devatlas/config",
    checks: {
      lint: "pnpm --filter @devatlas/config lint",
      typecheck: "pnpm --filter @devatlas/config typecheck",
      test: "pnpm --filter @devatlas/config test",
      build: "pnpm --filter @devatlas/config build",
    },
    consumers: ["api", "web"],
  },
  content: {
    label: "@devatlas/content",
    checks: {
      lint: "pnpm --filter @devatlas/content lint",
      typecheck: "pnpm --filter @devatlas/content typecheck",
      test: "pnpm --filter @devatlas/content test",
      build: "pnpm --filter @devatlas/content build",
    },
    consumers: ["web"],
  },
  "api-client": {
    label: "@devatlas/api-client",
    checks: {
      lint: "pnpm --filter @devatlas/api-client lint",
      typecheck: "pnpm --filter @devatlas/api-client typecheck",
      test: "pnpm --filter @devatlas/api-client test",
      build: "pnpm --filter @devatlas/api-client build",
    },
    consumers: ["web"],
  },
  ui: {
    label: "@devatlas/ui",
    checks: {
      lint: "pnpm --filter @devatlas/ui lint",
      typecheck: "pnpm --filter @devatlas/ui typecheck",
      test: "pnpm --filter @devatlas/ui test",
      build: "pnpm --filter @devatlas/ui build",
    },
    consumers: ["web"],
  },
};

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function run(command) {
  console.log(`→ ${command}`);
  try {
    execSync(command, { stdio: "inherit" });
  } catch {
    fail(`Command failed: ${command}`);
  }
}

function usage() {
  const available = Object.keys(TARGETS).join(", ");
  console.log(`Usage: pnpm agent:verify <target> [check...]

Targets: ${available}
Checks: lint, typecheck, test, build, verify, consumers

Examples:
  pnpm agent:verify api verify
  pnpm agent:verify web lint typecheck
  pnpm agent:verify utils lint typecheck consumers`);
}

if (!target || target === "--help" || target === "-h") {
  usage();
  process.exit(target ? 0 : 1);
}

const config = TARGETS[target];
if (!config) {
  fail(`Unknown target "${target}"`);
}

const defaultChecks = target === "api" || target === "web"
  ? ["verify"]
  : ["lint", "typecheck"];
const checks = requestedChecks.length > 0 ? requestedChecks : defaultChecks;

for (const check of checks) {
  if (check === "consumers") {
    if (!config.consumers?.length) {
      console.log(`• No consumer checks configured for ${config.label}`);
      continue;
    }

    console.log(`\n# consumers for ${config.label}`);
    for (const consumer of config.consumers) {
      run(TARGETS[consumer].checks.verify);
    }
    continue;
  }

  const command = config.checks[check];
  if (!command) {
    fail(`Unsupported check "${check}" for ${config.label}`);
  }

  console.log(`\n# ${check} for ${config.label}`);
  run(command);
}

console.log(`\n✓ Scoped validation finished for ${config.label}`);
