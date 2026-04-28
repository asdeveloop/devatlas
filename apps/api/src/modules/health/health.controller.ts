import { Controller, Get, Header, Inject } from '@nestjs/common';

import type { HealthReport, LivenessReport, MetricsExportReport, ReadinessReport } from './health.service';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(@Inject(HealthService) private readonly healthService: HealthService) {}

  @Get('live')
  live(): LivenessReport {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  async ready(): Promise<ReadinessReport> {
    return this.healthService.getReadiness();
  }

  @Get()
  async check(): Promise<HealthReport> {
    return this.healthService.getHealthReport();
  }

  @Get('metrics')
  @Header('content-type', 'text/plain; version=0.0.4; charset=utf-8')
  async metrics(): Promise<string> {
    const report: MetricsExportReport = await this.healthService.exportMetrics();
    return report.body;
  }
}
