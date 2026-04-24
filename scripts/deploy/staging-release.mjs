#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);

function getArg(name, fallback = undefined) {
  const index = args.indexOf(`--${name}`);
  if (index === -1) {
    return fallback;
  }

  return args[index + 1];
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function run(command, commandArgs, options = {}) {
  console.log(`[deploy:staging] $ ${command} ${commandArgs.join(' ')}`);
  execFileSync(command, commandArgs, {
    stdio: 'inherit',
    ...options,
  });
}

const host = getArg('host', process.env['DEVATLAS_STAGING_HOST'] ?? '185.3.124.93');
const user = getArg('user', process.env['DEVATLAS_STAGING_USER'] ?? 'deploy');
const keyPath = getArg('key', process.env['DEVATLAS_STAGING_KEY'] ?? '/home/dev/.ssh/id_ed25519');
const remoteScript = getArg(
  'remote-script',
  process.env['DEVATLAS_STAGING_REMOTE_SCRIPT'] ?? '/var/www/devatlas/shared/scripts/deploy-staging.sh',
);
const targetRef = getArg('ref', process.env['DEVATLAS_TARGET_REF'] ?? '');
const smokeUrl = getArg(
  'smoke-url',
  process.env['DEVATLAS_SMOKE_BASE_URL'] ?? 'https://staging.alirezasafeidev.ir',
);
const syncRemote = hasFlag('sync-remote') ? '1' : process.env['DEVATLAS_SYNC_REMOTE'] ?? '0';
const skipDeploy = hasFlag('skip-deploy');
const insecure = hasFlag('insecure');

const sshArgs = [
  '-i',
  keyPath,
  '-o',
  'IdentitiesOnly=yes',
  '-o',
  'StrictHostKeyChecking=no',
  `${user}@${host}`,
];

if (!skipDeploy) {
  const remoteCommand = [
    `export DEVATLAS_SYNC_REMOTE=${JSON.stringify(syncRemote)}`,
    `export DEVATLAS_SMOKE_BASE_URL=${JSON.stringify(smokeUrl)}`,
    targetRef ? `export DEVATLAS_TARGET_REF=${JSON.stringify(targetRef)}` : '',
    remoteScript,
  ]
    .filter(Boolean)
    .join('; ');

  run('ssh', [...sshArgs, remoteCommand]);
}

const curlArgs = ['-fsS'];
if (insecure) {
  curlArgs.push('-k');
}

run('curl', [...curlArgs, `${smokeUrl}/api/v1/health/live`]);
run('curl', [...curlArgs, `${smokeUrl}/api/v1/health/ready`]);
run('curl', [...curlArgs, smokeUrl]);

console.log('[deploy:staging] pass');
