import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { SearchIndexingService } from '../modules/search/search-indexing.service';

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    const searchIndexingService = app.get(SearchIndexingService);

    console.log('Rebuilding search documents...');
    await searchIndexingService.rebuildSearchDocuments();
    console.log('Search reindex complete.');
  } finally {
    await app.close();
  }
}

void main().catch((error: unknown) => {
  console.error('Search reindex failed:', error);
  process.exit(1);
});
