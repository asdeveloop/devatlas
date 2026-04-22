import { Global, Module } from '@nestjs/common';

import { RequestLoggerInterceptor } from './request-logger.interceptor';
import { RequestMetricsService } from './request-metrics.service';

@Global()
@Module({
  providers: [RequestLoggerInterceptor, RequestMetricsService],
  exports: [RequestLoggerInterceptor, RequestMetricsService],
})
export class ObservabilityModule {}
