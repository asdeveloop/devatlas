# DevAtlas Staging Baseline

Canonical staging layout on the VPS:

- app root: `/var/www/devatlas`
- shared env: `/var/www/devatlas/shared/env/staging.env`
- shared deploy script: `/var/www/devatlas/shared/scripts/deploy-staging.sh`
- current release symlink: `/var/www/devatlas/current/staging`
- PM2 wrappers:
  - `/var/www/devatlas/shared/bin/start-api-staging.sh`
  - `/var/www/devatlas/shared/bin/start-web-staging.sh`

Current staging ports:

- web: `127.0.0.1:3004`
- api: `127.0.0.1:3005`

Current public URL:

- `https://staging.alirezasafeidev.ir`

## Deploy Flow

1. Sync repo snapshot on the VPS only when needed.
2. Build a timestamped release under `/var/www/devatlas/releases/staging`.
3. Update `/var/www/devatlas/current/staging`.
4. Reload PM2 from the `current` symlink, not from a pinned release path.
5. Run smoke checks for:
   - `/api/v1/health/live`
   - `/api/v1/health/ready`
   - web root
6. Roll back to the previous symlink target if deploy fails.

## Local Operator Command

Run the repo-driven helper:

```bash
node scripts/deploy/staging-release.mjs --sync-remote
```

Useful flags:

- `--ref <git-ref>`: deploy a specific remote ref
- `--host <ip-or-host>`: override staging host
- `--user <ssh-user>`: override SSH user
- `--key <path>`: override SSH key path
- `--remote-script <path>`: override remote deploy entrypoint
- `--smoke-url <url>`: override public smoke base URL
- `--skip-deploy`: run smoke checks only
- `--insecure`: allow smoke checks against temporary self-signed TLS

## Current TLS Note

Staging currently uses a temporary self-signed certificate for `staging.alirezasafeidev.ir`.

- Browser and CLI reachability are working.
- Public trusted TLS still depends on successful ACME validation or DNS-01 access.
