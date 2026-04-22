import { Controller, Get } from '@nestjs/common';

import { RequestMetricsService } from '../../common/interceptors/request-metrics.service';
import type { DrizzleService } from '../database/drizzle.service';

interface HealthResponse {
  status: 'ok' | 'error';
  uptime: number;
  service: string;
  environment: string;
  database: 'connected' | 'disconnected';
  timestamp: string;
  metrics: {
    totalRequests: number;
    totalErrors: number;
    averageDurationMs: number;
    statusClasses: Array<{
      label: '2xx' | '3xx' | '4xx' | '5xx';
      count: number;
    }>;
    durationBuckets: Array<{
      label: '<100ms' | '100-299ms' | '300ms+';
      count: number;
    }>;
    routes: Array<{
      key: string;
      method: string;
      route: string;
      count: number;
      errors: number;
      averageDurationMs: number;
    }>;
  };
}

@Controller('health')
export class HealthController {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly requestMetrics: RequestMetricsService,
  ) {}

  @Get()
  async check(): Promise<HealthResponse> {
    let dbStatus: 'connected' | 'disconnected' = 'disconnected';

    try {
      await this.drizzle.db.execute('SELECT 1');
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected';
    }

    return {
      status: dbStatus === 'connected' ? 'ok' : 'error',
      service: 'devatlas-api',
      environment: process.env['NODE_ENV'] ?? 'development',
      uptime: process.uptime(),
      database: dbStatus,
      timestamp: new Date().toISOString(),
      metrics: this.requestMetrics.snapshot(),
    };
  }
}
