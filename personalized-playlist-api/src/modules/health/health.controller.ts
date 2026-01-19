import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { HealthService, HealthStatus } from './health.service';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check endpoint',
    description:
      'Returns the health status of the application including database connectivity, service configuration, uptime, and environment information. This endpoint is public and does not require authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    type: HealthResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Service is unhealthy (database connection failed)',
    type: HealthResponseDto,
  })
  async check(): Promise<HealthStatus> {
    return this.healthService.checkHealth();
  }
}
