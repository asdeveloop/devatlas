import { Controller, Get } from '@nestjs/common';

import type { HealthReport, LivenessReport, ReadinessReport } from './health.service';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

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
}
