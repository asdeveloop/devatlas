import { Inject, Injectable } from '@nestjs/common';

import { RequestMetricsService } from '../../common/interceptors/request-metrics.service';
import { DrizzleService } from '../database/drizzle.service';

interface RouteMetrics {
  key: string;
  method: string;
  route: string;
  count: number;
  errors: number;
  averageDurationMs: number;
}

interface HealthMetrics {
  totalRequests: number;
  totalErrors: number;
  errorRate: number;
  validationFailures: number;
  rateLimitedRequests: number;
  averageDurationMs: number;
  statusClasses: Array<{
      label: '2xx' | '3xx' | '4xx' | '5xx';
    count: number;
  }>;
  durationBuckets: Array<{
    label: '<100ms' | '100-299ms' | '300ms+';
    count: number;
  }>;
  routes: RouteMetrics[];
}

export interface HealthReport {
  status: 'ok' | 'error';
  uptime: number;
  service: string;
  environment: string;
  database: 'connected' | 'disconnected';
  timestamp: string;
  metrics: HealthMetrics;
}

export interface LivenessReport {
  status: 'ok';
  service: string;
  environment: string;
  timestamp: string;
}

export interface ReadinessReport {
  status: 'ready' | 'not_ready';
  service: string;
  environment: string;
  database: 'connected' | 'disconnected';
  timestamp: string;
}

@Injectable()
export class HealthService {
  constructor(
    @Inject(DrizzleService) private readonly drizzle: DrizzleService,
    @Inject(RequestMetricsService) private readonly requestMetrics: RequestMetricsService,
  ) {}

  getLiveness(): LivenessReport {
    return {
      status: 'ok',
      service: 'devatlas-api',
      environment: this.getEnvironment(),
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<ReadinessReport> {
    const database = await this.getDatabaseStatus();

    return {
      status: database === 'connected' ? 'ready' : 'not_ready',
      service: 'devatlas-api',
      environment: this.getEnvironment(),
      database,
      timestamp: new Date().toISOString(),
    };
  }

  async getHealthReport(): Promise<HealthReport> {
    const database = await this.getDatabaseStatus();

    return {
      status: database === 'connected' ? 'ok' : 'error',
      service: 'devatlas-api',
      environment: this.getEnvironment(),
      uptime: process.uptime(),
      database,
      timestamp: new Date().toISOString(),
      metrics: this.requestMetrics.snapshot(),
    };
  }

  private async getDatabaseStatus(): Promise<'connected' | 'disconnected'> {
    try {
      await this.drizzle.db.execute('SELECT 1');
      return 'connected';
    } catch {
      return 'disconnected';
    }
  }

  private getEnvironment(): string {
    return process.env['NODE_ENV'] ?? 'development';
  }
}
