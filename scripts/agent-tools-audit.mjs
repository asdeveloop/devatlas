#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import process from 'node:process';

const argv = process.argv.slice(2);
const outputJson = argv.includes('--json') || argv.includes('-j');

function fileExists(...paths) {
  return paths.every((p) => fs.existsSync(p));
}

function hasCommand(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'pipe', encoding: 'utf8' });
    return true;
  } catch {
    return false;
  }
}

function parseLocalEnv(filePath) {
  const env = new Map();
  if (!fs.existsSync(filePath)) {
    return env;
  }
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const index = trimmed.indexOf('=');
    if (index < 0) {
      continue;
    }
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    if (key) env.set(key, value);
  }
  return env;
}

async function hasNetwork() {
  const timeout = Number.parseInt(process.env.DEVOPS_NETWORK_TIMEOUT_MS || '1200', 10);
  const endpoints = ['https://api.github.com', 'https://www.gstatic.com/generate_204'];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(endpoint, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timer);
      if (res.ok || res.status === 401) return true;
    } catch {
      // continue
    }
  }
  return false;
}

async function hasNetworkLegacy() {
  try {
    const res = await fetch('https://api.github.com', { method: 'HEAD' });
    return res.ok || res.status === 401;
  } catch {
    return false;
  }
}
async function probeGitHub(token) {
  if (!token) {
    return { status: 'blocked', reason: 'missing_token' };
  }

  try {
    const response = await fetch('https://api.github.com/rate_limit', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { status: 'blocked', reason: `http_${response.status}` };
    return { status: 'ok', reason: 'authenticated' };
  } catch {
    return { status: 'blocked', reason: 'network_error' };
  }
}

function buildCapability(label, available, notes) {
  return { label, available, notes };
}

async function main() {
  const localEnv = parseLocalEnv('.env.local');
  const envOr = (key) => process.env[key] || localEnv.get(key);

  const hasNet = await hasNetwork();
  const deepseekKey = envOr('DEEPSEEK_API_KEY');
  const githubToken = envOr('GITHUB_TOKEN') || envOr('GH_TOKEN');
  const githubState = await probeGitHub(githubToken);
  const deepSeekBase = envOr('DEEPSEEK_BASE_URL') || 'https://api.deepseek.com';

  const workflows = {
    'ci.yml': fs.existsSync('.github/workflows/ci.yml'),
    'codeql.yml': fs.existsSync('.github/workflows/codeql.yml'),
    'dependency-review.yml': fs.existsSync('.github/workflows/dependency-review.yml'),
    'github-ops.yml': fs.existsSync('.github/workflows/github-ops.yml'),
    'agent-ops-guard.yml': fs.existsSync('.github/workflows/agent-ops-guard.yml'),
    '.gitlab-ci.yml': fs.existsSync('.github/workflows/.gitlab-ci.yml'),
  };

  const capability = {
    timestamp: new Date().toISOString(),
    internet: hasNet ? 'online' : 'offline',
    recommended_mode: hasNet && githubToken ? 'online' : 'offline',
    recommended_command: hasNet && githubToken
      ? 'pnpm agent:auto --deepseek --deepseek-diff HEAD~1..HEAD'
      : 'pnpm agent:auto:offline',
    inventory: {
      ci_cd: [],
      code_quality: [],
      automation: [],
      local_dev_tools: [],
      cloud_dev_platforms: [],
      monitoring_logs: [],
      infra_provisioning: [],
      ai_tools: [],
    },
  };

  capability.inventory.ci_cd.push(
    buildCapability(
      'GitHub Actions',
      Object.values(workflows).some(Boolean) ? 'partial' : 'not_available',
      [
        `workflow files: ${Object.entries(workflows)
          .filter(([, enabled]) => enabled)
          .map(([name]) => name)
          .join(', ') || 'none'}`,
        githubState.status === 'ok' ? 'remote status api accessible' : 'requires token + network',
      ],
    ),
  );

  const qualityTools = [
    { name: 'ESLint', ok: hasCommand('eslint'), source: 'apps package scripts + devDep' },
    { name: 'TypeScript', ok: hasCommand('tsc'), source: 'workspace scripts' },
    { name: 'Vitest', ok: hasCommand('vitest'), source: 'workspace scripts' },
    { name: 'Dependency Review Action', ok: fs.existsSync('.github/workflows/dependency-review.yml'), source: 'workflow file' },
    { name: 'CodeQL Action', ok: fs.existsSync('.github/workflows/codeql.yml'), source: 'workflow file' },
  ];
  capability.inventory.code_quality.push(
    buildCapability(
      'Static & contract checks',
      qualityTools.every((t) => t.ok) ? 'full' : qualityTools.some((t) => t.ok) ? 'partial' : 'missing',
      qualityTools.map((t) => `${t.name}:${t.ok ? 'yes' : 'no'} (${t.source})`),
    ),
  );

  capability.inventory.automation.push(
    buildCapability(
      'Agent scripts',
      fileExists('scripts/agent-smart.mjs', 'scripts/agent-ops.mjs', 'scripts/github-hub.mjs') ? 'full' : 'partial',
      [
        'pnpm agent:smart, agent:ops, agent:github, agent:inventory, agent:deepseek',
        `agent workflows: ${capability.internet === 'online' ? 'can run with token' : 'local-only mode supported'}`,
      ],
    ),
  );

  capability.inventory.local_dev_tools.push(
    buildCapability(
      'PNPM+Node+Turbo',
      hasCommand('pnpm') && hasCommand('node') ? 'full' : 'missing',
      [
        `node:${hasCommand('node') ? 'yes' : 'no'}`,
        `pnpm:${hasCommand('pnpm') ? 'yes' : 'no'}`,
        `turbo:${hasCommand('turbo') ? 'yes' : 'no'}`,
      ],
    ),
  );

  capability.inventory.cloud_dev_platforms.push(
    buildCapability(
      'Cloud-hosted execution',
      fs.existsSync('.github/workflows') ? 'partial' : 'missing',
      [
        'GitHub Actions active for CI/automation',
        fs.existsSync('infra/docker/docker-compose.yml') ? 'Docker local runtime available' : 'docker-compose config not found',
      ],
    ),
  );

  capability.inventory.monitoring_logs.push(
    buildCapability(
      'Runtime observability',
      fileExists('scripts/ops-alert.mjs', 'apps/api/src/modules/health/health.controller.ts') ? 'partial' : 'partial',
      [
        'Health endpoints: /api/v1/health, /api/v1/health/metrics',
        'script: pnpm ops:alerts',
      ],
    ),
  );

  const infraNeeds = [
    fileExists('scripts/deploy/staging-release.mjs'),
    fs.existsSync('.ssh/config') || Boolean(envOr('DEVATLAS_STAGING_HOST')),
    Boolean(envOr('DATABASE_URL')),
  ];
  capability.inventory.infra_provisioning.push(
    buildCapability(
      'Staging/VPS workflow',
      infraNeeds.every(Boolean) ? 'partial' : 'limited',
      [
        `staging deploy script: ${infraNeeds[0] ? 'yes' : 'no'}`,
        `ssh/publish prechecks: ${infraNeeds[1] ? 'present' : 'not configured'}`,
        `db rollback rehearsal: ${Boolean(envOr('DATABASE_URL')) ? 'possible' : 'missing DATABASE_URL'}`,
      ],
    ),
  );

  capability.inventory.ai_tools.push(
      buildCapability(
        'DeepSeek review',
        deepseekKey ? 'partial' : 'limited',
        [
          `DeepSeek key: ${deepseekKey ? 'configured' : 'not configured'}`,
          `DeepSeek base: ${deepSeekBase}`,
        ],
      ),
  );

  capability.notes = [
    'Cloud platforms are currently limited to GitHub-hosted Actions (for CI/automation).',
    'AI/code review and remote checks require DEEPSEEK_API_KEY / GITHUB_TOKEN when online.',
    `Internet status: ${hasNet ? 'reachable' : 'unreachable'} (GitHub/Google connectivity test).`,
  ];

  if (outputJson) {
    console.log(JSON.stringify(capability, null, 2));
    return;
  }

  console.log(`Internet: ${capability.internet}`);
  console.log(`Recommended mode: ${capability.recommended_mode}`);
  console.log(`Run next: ${capability.recommended_command}`);
  for (const [key, list] of Object.entries(capability.inventory)) {
    const item = list[0];
    const status = item?.available || 'unknown';
    console.log(`\n- ${key}: ${status}`);
    for (const note of item.notes) {
      console.log(`  - ${note}`);
    }
  }
}

main().catch((error) => {
  console.error('agent-tools-audit failed:', error.message);
  process.exitCode = 1;
});
