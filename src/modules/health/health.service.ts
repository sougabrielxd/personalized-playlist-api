import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
    };
    spotify?: {
      status: 'configured' | 'not_configured';
    };
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async checkHealth(): Promise<HealthStatus> {
    const databaseCheck = await this.checkDatabase();
    const spotifyCheck = this.checkSpotify();

    const overallStatus = databaseCheck.status === 'up' ? 'ok' : 'error';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      environment: this.configService.get<string>('app.nodeEnv', 'development'),
      version: '1.0.0',
      checks: {
        database: databaseCheck,
        spotify: spotifyCheck,
      },
    };
  }

  private async checkDatabase(): Promise<{
    status: 'up' | 'down';
    responseTime?: number;
  }> {
    try {
      const startTime = Date.now();
      // Simple query to check database connectivity
      await this.prisma.$queryRaw`SELECT 1 as health_check`;
      const responseTime = Date.now() - startTime;

      return {
        status: 'up',
        responseTime,
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'down',
      };
    }
  }

  private checkSpotify(): {
    status: 'configured' | 'not_configured';
  } {
    const clientId = this.configService.get<string>('app.spotify.clientId');
    const clientSecret = this.configService.get<string>('app.spotify.clientSecret');

    return {
      status: clientId && clientSecret ? 'configured' : 'not_configured',
    };
  }
}
