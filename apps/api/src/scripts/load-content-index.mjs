import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const contentDir = process.argv[2];

if (!contentDir) {
  console.error('Missing content directory argument.');
  process.exit(1);
}

const moduleUrl = pathToFileURL(resolve(process.cwd(), '../../packages/content/src/index.ts')).href;
const { buildContentIndex } = await import(moduleUrl);
const index = await buildContentIndex(resolve(contentDir));
process.stdout.write(JSON.stringify(index));
