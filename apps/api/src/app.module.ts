import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { envSchema } from './config/env.validation';
import { DatabaseModule } from './modules/database/database.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { GuidesModule } from './modules/guides/guides.module';
import { HealthModule } from './modules/health/health.module';
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
    HealthModule,
  ],
})
export class AppModule {}
