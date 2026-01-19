import { ApiProperty } from '@nestjs/swagger';

export class DatabaseCheckDto {
  @ApiProperty({
    example: 'up',
    enum: ['up', 'down'],
    description: 'Database connection status',
  })
  status: 'up' | 'down';

  @ApiProperty({
    example: 5,
    description: 'Database response time in milliseconds',
    required: false,
  })
  responseTime?: number;
}

export class SpotifyCheckDto {
  @ApiProperty({
    example: 'configured',
    enum: ['configured', 'not_configured'],
    description: 'Spotify API configuration status',
  })
  status: 'configured' | 'not_configured';
}

export class HealthChecksDto {
  @ApiProperty({ type: DatabaseCheckDto })
  database: DatabaseCheckDto;

  @ApiProperty({ type: SpotifyCheckDto, required: false })
  spotify?: SpotifyCheckDto;
}

export class HealthResponseDto {
  @ApiProperty({
    example: 'ok',
    enum: ['ok', 'error'],
    description: 'Overall health status',
  })
  status: 'ok' | 'error';

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Timestamp of the health check',
  })
  timestamp: string;

  @ApiProperty({
    example: 3600,
    description: 'Application uptime in seconds',
  })
  uptime: number;

  @ApiProperty({
    example: 'development',
    description: 'Current environment',
  })
  environment: string;

  @ApiProperty({
    example: '1.0.0',
    description: 'Application version',
  })
  version: string;

  @ApiProperty({ type: HealthChecksDto })
  checks: HealthChecksDto;
}
