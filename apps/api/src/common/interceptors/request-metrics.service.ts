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

interface StatusClassSnapshot {
  label: '2xx' | '3xx' | '4xx' | '5xx';
  count: number;
}

interface DurationBucketSnapshot {
  label: '<100ms' | '100-299ms' | '300ms+';
  count: number;
}

export interface RequestMetricsSnapshot {
  totalRequests: number;
  totalErrors: number;
  averageDurationMs: number;
  statusClasses: StatusClassSnapshot[];
  durationBuckets: DurationBucketSnapshot[];
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
  private readonly statusClassCounts = new Map<RequestMetricsSnapshot['statusClasses'][number]['label'], number>([
    ['2xx', 0],
    ['3xx', 0],
    ['4xx', 0],
    ['5xx', 0],
  ]);
  private readonly durationBucketCounts = new Map<RequestMetricsSnapshot['durationBuckets'][number]['label'], number>([
    ['<100ms', 0],
    ['100-299ms', 0],
    ['300ms+', 0],
  ]);

  record(sample: RequestMetricSample): void {
    this.totalRequests += 1;
    this.totalDurationMs += sample.durationMs;

    if (sample.statusCode >= 400) {
      this.totalErrors += 1;
    }

    this.incrementStatusClass(sample.statusCode);
    this.incrementDurationBucket(sample.durationMs);

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
      statusClasses: this.toNamedCounts(this.statusClassCounts),
      durationBuckets: this.toNamedCounts(this.durationBucketCounts),
      routes,
    };
  }

  private incrementStatusClass(statusCode: number): void {
    const label = this.resolveStatusClass(statusCode);
    this.statusClassCounts.set(label, (this.statusClassCounts.get(label) ?? 0) + 1);
  }

  private incrementDurationBucket(durationMs: number): void {
    const label = this.resolveDurationBucket(durationMs);
    this.durationBucketCounts.set(label, (this.durationBucketCounts.get(label) ?? 0) + 1);
  }

  private resolveStatusClass(statusCode: number): RequestMetricsSnapshot['statusClasses'][number]['label'] {
    if (statusCode >= 500) {
      return '5xx';
    }

    if (statusCode >= 400) {
      return '4xx';
    }

    if (statusCode >= 300) {
      return '3xx';
    }

    return '2xx';
  }

  private resolveDurationBucket(durationMs: number): RequestMetricsSnapshot['durationBuckets'][number]['label'] {
    if (durationMs >= 300) {
      return '300ms+';
    }

    if (durationMs >= 100) {
      return '100-299ms';
    }

    return '<100ms';
  }

  private toNamedCounts<TLabel extends string>(counts: Map<TLabel, number>): Array<{ label: TLabel; count: number }> {
    return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
  }

  private round(value: number): number {
    return Number(value.toFixed(2));
  }
}
