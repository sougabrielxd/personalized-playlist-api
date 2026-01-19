import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');
  const port = configService.get<number>('app.port', 3000);

  if (nodeEnv === 'production') {
    console.log('⚠️  Swagger is enabled in production. Consider protecting it.');
  }

  const config = new DocumentBuilder()
    .setTitle('Personalized Playlist API')
    .setDescription(
      `## Overview
      
Public REST API for generating personalized music playlists based on user preferences such as mood, genre, energy level and duration. 

This API integrates with the Spotify Web API to provide high-quality music recommendations.

## Features

- 🎵 Generate personalized playlists based on mood, genre, and energy level
- 🎧 Integration with Spotify Web API
- 🔒 API Key authentication
- 📊 Health check endpoints
- 📚 Comprehensive API documentation

## Authentication

All endpoints (except health check) require an API key. Include your API key in the request header:

\`\`\`
X-API-Key: your-api-key-here
\`\`\`

Alternatively, you can pass it as a query parameter:

\`\`\`
?api_key=your-api-key-here
\`\`\`

## Rate Limiting

API requests are rate-limited to ensure fair usage. Please respect the rate limits.

## Support

For issues, questions, or feature requests, please contact the API administrator.`,
    )
    .setVersion('1.0.0')
    .setContact(
      'API Support',
      'https://github.com/sougabrielxd/personalized-playlist-api',
      'support@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(`http://localhost:${port}`, 'Development Server')
    .addServer('https://api.example.com', 'Production Server')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'Enter your API key. You can get your API key from the API administrator.',
      },
      'api-key',
    )
    .addTag('Health', 'Health check and system status endpoints')
    .addTag('Playlists', 'Playlist generation and management endpoints')
    .addTag('API', 'General API information')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Personalized Playlist API - Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      tryItOutEnabled: true,
      requestSnippetsEnabled: true,
      requestSnippets: {
        generators: {
          curl: {
            title: 'cURL',
          },
        },
      },
    },
    jsonDocumentUrl: '/docs/json',
    yamlDocumentUrl: '/docs/yaml',
  });

  // Also setup JSON and YAML endpoints
  app
    .getHttpAdapter()
    .get(
      '/docs/json',
      (
        req: unknown,
        res: { setHeader: (key: string, value: string) => void; send: (data: unknown) => void },
      ) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(document);
      },
    );

  app
    .getHttpAdapter()
    .get(
      '/docs/yaml',
      (
        req: unknown,
        res: { setHeader: (key: string, value: string) => void; send: (data: string) => void },
      ) => {
        res.setHeader('Content-Type', 'application/yaml');
        // Convert JSON to YAML (you might want to use a library like js-yaml)
        res.send(JSON.stringify(document, null, 2));
      },
    );
}
