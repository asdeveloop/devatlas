import { Injectable } from '@nestjs/common';

interface RequestMetricSample {
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
}

interface RouteMetricSnapshot {
  key: string;
  method: string;
  route: string;
  count: number;
  errors: number;
  averageDurationMs: number;
}

export interface RequestMetricsSnapshot {
  totalRequests: number;
  totalErrors: number;
  averageDurationMs: number;
  routes: RouteMetricSnapshot[];
}

interface RouteMetricState {
  method: string;
  route: string;
  count: number;
  errors: number;
  totalDurationMs: number;
}

@Injectable()
export class RequestMetricsService {
  private totalRequests = 0;
  private totalErrors = 0;
  private totalDurationMs = 0;
  private readonly routeMetrics = new Map<string, RouteMetricState>();

  record(sample: RequestMetricSample): void {
    this.totalRequests += 1;
    this.totalDurationMs += sample.durationMs;

    if (sample.statusCode >= 400) {
      this.totalErrors += 1;
    }

    const key = `${sample.method} ${sample.route}`;
    const routeMetric = this.routeMetrics.get(key) ?? {
      method: sample.method,
      route: sample.route,
      count: 0,
      errors: 0,
      totalDurationMs: 0,
    };

    routeMetric.count += 1;
    routeMetric.totalDurationMs += sample.durationMs;

    if (sample.statusCode >= 400) {
      routeMetric.errors += 1;
    }

    this.routeMetrics.set(key, routeMetric);
  }

  snapshot(): RequestMetricsSnapshot {
    const routes = Array.from(this.routeMetrics.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, metric]) => ({
        key: `${metric.method} ${metric.route}`,
        method: metric.method,
        route: metric.route,
        count: metric.count,
        errors: metric.errors,
        averageDurationMs: metric.count === 0 ? 0 : this.round(metric.totalDurationMs / metric.count),
      }));

    return {
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      averageDurationMs: this.totalRequests === 0 ? 0 : this.round(this.totalDurationMs / this.totalRequests),
      routes,
    };
  }

  private round(value: number): number {
    return Number(value.toFixed(2));
  }
}
