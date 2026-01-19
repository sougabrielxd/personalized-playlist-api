import { registerAs } from '@nestjs/config';

export interface AppConfig {
  nodeEnv: string;
  port: number;
  database: {
    url: string;
    postgresUser: string;
    postgresPassword: string;
    postgresDb: string;
    postgresPort: number;
  };
  spotify: {
    clientId: string;
    clientSecret: string;
  };
  api: {
    key: string;
  };
}

export default registerAs('app', (): AppConfig => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      url: process.env.DATABASE_URL || '',
      postgresUser: process.env.POSTGRES_USER || 'postgres',
      postgresPassword: process.env.POSTGRES_PASSWORD || 'postgres',
      postgresDb: process.env.POSTGRES_DB || 'personalized_playlist_db',
      postgresPort: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    },
    api: {
      key: process.env.API_KEY || '',
    },
  };
});
