import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

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
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<HealthResponse> {
    let dbStatus: 'connected' | 'disconnected' = 'disconnected';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
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
