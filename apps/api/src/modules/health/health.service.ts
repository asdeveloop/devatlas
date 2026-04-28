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

export interface ObservabilityAlert {
  key: 'api_error_rate' | 'api_p95_proxy' | 'api_rate_limited_requests' | 'api_database_ready';
  status: 'ok' | 'warn' | 'critical';
  value: number;
  threshold: number;
  message: string;
}

export interface MetricsExportReport {
  generatedAt: string;
  alerts: ObservabilityAlert[];
  contentType: 'text/plain; version=0.0.4; charset=utf-8';
  body: string;
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

  async exportMetrics(): Promise<MetricsExportReport> {
    const database = await this.getDatabaseStatus();
    const snapshot = this.requestMetrics.snapshot();
    const alerts = this.buildAlerts(snapshot, database);
    const generatedAt = new Date().toISOString();

    return {
      generatedAt,
      alerts,
      contentType: 'text/plain; version=0.0.4; charset=utf-8',
      body: this.toPrometheusMetrics(snapshot, database, alerts, generatedAt),
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

  private buildAlerts(
    snapshot: HealthReport['metrics'],
    database: 'connected' | 'disconnected',
  ): ObservabilityAlert[] {
    return [
      {
        key: 'api_database_ready',
        status: database === 'connected' ? 'ok' : 'critical',
        value: database === 'connected' ? 1 : 0,
        threshold: 1,
        message: database === 'connected' ? 'Database readiness healthy.' : 'Database readiness failed.',
      },
      {
        key: 'api_error_rate',
        status: snapshot.errorRate >= 20 ? 'critical' : snapshot.errorRate >= 5 ? 'warn' : 'ok',
        value: snapshot.errorRate,
        threshold: snapshot.errorRate >= 20 ? 20 : 5,
        message: `API error rate is ${snapshot.errorRate}%.`,
      },
      {
        key: 'api_p95_proxy',
        status: snapshot.averageDurationMs >= 500 ? 'critical' : snapshot.averageDurationMs >= 250 ? 'warn' : 'ok',
        value: snapshot.averageDurationMs,
        threshold: snapshot.averageDurationMs >= 500 ? 500 : 250,
        message: `Average API latency proxy is ${snapshot.averageDurationMs}ms.`,
      },
      {
        key: 'api_rate_limited_requests',
        status: snapshot.rateLimitedRequests >= 20 ? 'warn' : 'ok',
        value: snapshot.rateLimitedRequests,
        threshold: 20,
        message: `Rate-limited requests observed: ${snapshot.rateLimitedRequests}.`,
      },
    ];
  }

  private toPrometheusMetrics(
    snapshot: HealthReport['metrics'],
    database: 'connected' | 'disconnected',
    alerts: ObservabilityAlert[],
    generatedAt: string,
  ): string {
    const lines = [
      '# HELP devatlas_api_up API readiness state.',
      '# TYPE devatlas_api_up gauge',
      `devatlas_api_up{service="devatlas-api",environment="${this.getEnvironment()}"} ${database === 'connected' ? 1 : 0}`,
      '# HELP devatlas_api_requests_total Total API requests observed by in-process metrics.',
      '# TYPE devatlas_api_requests_total counter',
      `devatlas_api_requests_total ${snapshot.totalRequests}`,
      '# HELP devatlas_api_errors_total Total API requests with HTTP status >= 400.',
      '# TYPE devatlas_api_errors_total counter',
      `devatlas_api_errors_total ${snapshot.totalErrors}`,
      '# HELP devatlas_api_error_rate Error rate percentage.',
      '# TYPE devatlas_api_error_rate gauge',
      `devatlas_api_error_rate ${snapshot.errorRate}`,
      '# HELP devatlas_api_average_duration_ms Average API duration in milliseconds.',
      '# TYPE devatlas_api_average_duration_ms gauge',
      `devatlas_api_average_duration_ms ${snapshot.averageDurationMs}`,
      '# HELP devatlas_api_validation_failures_total Validation failures observed.',
      '# TYPE devatlas_api_validation_failures_total counter',
      `devatlas_api_validation_failures_total ${snapshot.validationFailures}`,
      '# HELP devatlas_api_rate_limited_requests_total Rate-limited API requests observed.',
      '# TYPE devatlas_api_rate_limited_requests_total counter',
      `devatlas_api_rate_limited_requests_total ${snapshot.rateLimitedRequests}`,
      '# HELP devatlas_api_metrics_generated_at Unix timestamp when metrics were rendered.',
      '# TYPE devatlas_api_metrics_generated_at gauge',
      `devatlas_api_metrics_generated_at ${Math.floor(new Date(generatedAt).getTime() / 1000)}`,
    ];

    for (const route of snapshot.routes) {
      lines.push(`devatlas_api_route_requests_total{method="${route.method}",route="${route.route}"} ${route.count}`);
      lines.push(`devatlas_api_route_errors_total{method="${route.method}",route="${route.route}"} ${route.errors}`);
      lines.push(`devatlas_api_route_average_duration_ms{method="${route.method}",route="${route.route}"} ${route.averageDurationMs}`);
    }

    for (const alert of alerts) {
      const statusValue = alert.status === 'critical' ? 2 : alert.status === 'warn' ? 1 : 0;
      lines.push(`devatlas_api_alert_status{key="${alert.key}",status="${alert.status}"} ${statusValue}`);
      lines.push(`devatlas_api_alert_value{key="${alert.key}"} ${alert.value}`);
      lines.push(`devatlas_api_alert_threshold{key="${alert.key}"} ${alert.threshold}`);
    }

    return `${lines.join('\n')}\n`;
  }
}
