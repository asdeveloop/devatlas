#!/usr/bin/env node
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const getArg = (key, fallback = undefined) => {
  const index = args.indexOf(`--${key}`);
  if (index === -1) {
    return fallback;
  }
  return args[index + 1];
};
const hasFlag = (key) => args.includes(`--${key}`);
const apiBaseUrl = getArg('api', process.env.API_BASE_URL ?? 'http://127.0.0.1:3001');
const searchQuery = getArg('query', 'React');
const requirePositive = hasFlag('require-positive');
const runPipeline = hasFlag('pipeline');

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, options);
  const bodyText = await response.text();
  let body = null;

  try {
    body = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    body = { parseError: bodyText };
  }

  return { response, body };
}

async function checkHealth() {
  const live = await request('/api/v1/health/live');
  if (!live.response.ok || live.body?.success !== true) {
    throw new Error(`Health live probe failed: status=${live.response.status}`);
  }

  const ready = await request('/api/v1/health/ready');
  if (!ready.response.ok || ready.body?.success !== true) {
    throw new Error(`Health ready probe failed: status=${ready.response.status}`);
  }
}

async function checkSearch() {
  const search = await request('/api/v1/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: searchQuery, limit: 5 }),
  });

  if (search.response.status !== 201) {
    throw new Error(`Search returned ${search.response.status}, expected 201`);
  }

  if (!search.body?.data || typeof search.body.data.query !== 'string' || !Array.isArray(search.body.data.results)) {
    throw new Error('Search response contract mismatch');
  }

  if (requirePositive && search.body.data.total <= 0) {
    throw new Error('Search returned no results, but --require-positive was set');
  }
}

async function runSearchReindex() {
  if (!runPipeline) {
    return;
  }

  const reindexCommand = 'pnpm --filter @devatlas/api search:reindex';
  const output = execSync(reindexCommand, { encoding: 'utf8', stdio: 'pipe' });
  const summaryLine = output
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('{') && line.includes('search-reindex-complete'));

  if (!summaryLine) {
    throw new Error('search:reindex did not emit machine-readable summary');
  }

  const parsed = JSON.parse(summaryLine);
  if (!parsed?.summary || typeof parsed.summary.total !== 'number') {
    throw new Error('search:reindex summary malformed');
  }
}

async function main() {
  console.log(`[search-smoke] API base: ${apiBaseUrl}`);
  console.log(`[search-smoke] query: ${searchQuery}`);
  await checkHealth();
  await checkSearch();

  if (runPipeline) {
    await runSearchReindex();
  }

  console.log('[search-smoke] pass');
}

main().catch((error) => {
  console.error('[search-smoke] fail:', error instanceof Error ? error.message : error);
  process.exit(1);
});
