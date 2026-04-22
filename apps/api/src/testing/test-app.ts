import 'reflect-metadata';

import type { AddressInfo } from 'net';

import type { INestApplication } from '@nestjs/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { RequestLoggerInterceptor } from '../common/interceptors/request-logger.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { applySecurityHeaders } from '../common/security/security-headers';

export async function createTestApp(): Promise<{
  app: INestApplication;
  baseUrl: string;
  swaggerDocument: ReturnType<typeof SwaggerModule.createDocument>;
}> {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    credentials: false,
  });
  app.use(applySecurityHeaders);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('DevAtlas API')
    .setDescription('API documentation for DevAtlas platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, swaggerDocument);

  app.useGlobalInterceptors(app.get(RequestLoggerInterceptor), new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(0);
  const address = app.getHttpServer().address() as AddressInfo;

  return {
    app,
    baseUrl: `http://127.0.0.1:${address.port}`,
    swaggerDocument,
  };
}
