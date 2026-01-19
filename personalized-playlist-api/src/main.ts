import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Setup Swagger documentation
  setupSwagger(app);

  const port = configService.get<number>('app.port', 3000);
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');

  await app.listen(port);

  console.log('\n' + '='.repeat(50));
  console.log('🚀 Application is running!');
  console.log('='.repeat(50));
  console.log(`📍 Environment: ${nodeEnv}`);
  console.log(`🌐 Server: http://localhost:${port}`);
  console.log(`📚 Swagger UI: http://localhost:${port}/docs`);
  console.log(`📄 Swagger JSON: http://localhost:${port}/docs/json`);
  console.log(`📄 Swagger YAML: http://localhost:${port}/docs/yaml`);
  console.log(`❤️  Health Check: http://localhost:${port}/health`);
  console.log('='.repeat(50) + '\n');
}

void bootstrap();
