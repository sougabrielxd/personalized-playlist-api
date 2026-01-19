import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKey(request);
    const validApiKey = this.configService.get<string>('app.api.key');

    if (!validApiKey) {
      throw new UnauthorizedException('API key is not configured');
    }

    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }

  private extractApiKey(request: Request): string | undefined {
    // Try to get API key from header
    const headerKey = request.headers['x-api-key'] as string;
    if (headerKey) {
      return headerKey;
    }

    // Try to get API key from query parameter
    const queryKey = request.query['api_key'] as string;
    if (queryKey) {
      return queryKey;
    }

    return undefined;
  }
}
