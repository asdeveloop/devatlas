import { Controller, Get } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';

interface HealthResponse {
  status: 'ok' | 'error';
  uptime: number;
  service: string;
  environment: string;
  database: 'connected' | 'disconnected';
  timestamp: string;
}

@Controller('health')
export class HealthController {
  constructor(private readonly drizzle: DrizzleService) {}

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
    };
  }
}
