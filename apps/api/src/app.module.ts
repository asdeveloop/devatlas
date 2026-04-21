import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { envSchema } from './config/env.validation';
import { CategoriesModule } from './modules/categories/categories.module';
import { DatabaseModule } from './modules/database/database.module';
import { GuidesModule } from './modules/guides/guides.module';
import { HealthModule } from './modules/health/health.module';
import { SearchModule } from './modules/search/search.module';
import { TagsModule } from './modules/tags/tags.module';
import { ToolsModule } from './modules/tools/tools.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
      expandVariables: true,
      validate: (env) => envSchema.parse(env),
    }),
    DatabaseModule,
    GuidesModule,
    ToolsModule,
    CategoriesModule,
    TagsModule,
    SearchModule,
    HealthModule,
  ],
})
export class AppModule {}
