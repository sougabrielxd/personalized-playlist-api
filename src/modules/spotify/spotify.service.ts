import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  SpotifyTokenResponse,
  SpotifyTrack,
  SpotifySearchResponse,
  SpotifyRecommendationsResponse,
  SpotifyRecommendationsParams,
} from './interfaces/spotify.interface';

@Injectable()
export class SpotifyService implements OnModuleInit {
  private readonly logger = new Logger(SpotifyService.name);
  private readonly baseUrl = 'https://api.spotify.com/v1';
  private readonly tokenUrl = 'https://accounts.spotify.com/api/token';
  private httpClient: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(private configService: ConfigService) {
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
    });
  }

  onModuleInit() {
    // Don't authenticate on startup - authenticate lazily when needed
    // This allows the app to start even if Spotify credentials are not configured
    this.logger.log('Spotify service initialized');
  }

  /**
   * Get or refresh Spotify access token
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    await this.ensureAuthenticated();
    return this.accessToken!;
  }

  /**
   * Authenticate with Spotify API using Client Credentials flow
   */
  private async ensureAuthenticated(): Promise<void> {
    const clientId = this.configService.get<string>('app.spotify.clientId');
    const clientSecret = this.configService.get<string>('app.spotify.clientSecret');

    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials are not configured');
    }

    // Check if credentials are placeholders
    if (
      clientId.includes('your_spotify') ||
      clientId.includes('here') ||
      clientSecret.includes('your_spotify') ||
      clientSecret.includes('here') ||
      clientId.trim() === '' ||
      clientSecret.trim() === ''
    ) {
      throw new Error(
        'Spotify credentials are not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file',
      );
    }

    try {
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const response = await axios.post<SpotifyTokenResponse>(
        this.tokenUrl,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      this.accessToken = response.data.access_token;
      // Set expiration time (subtract 60 seconds as buffer)
      this.tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;

      this.logger.log('Successfully authenticated with Spotify API');
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 400
      ) {
        const errorResponse = error.response as { data?: { error?: string } };
        const errorData = errorResponse.data;
        if (errorData?.error === 'invalid_client') {
          this.logger.error(
            'Invalid Spotify credentials. Please check your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env file',
          );
          throw new Error(
            'Invalid Spotify credentials. Please configure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file',
          );
        }
      }
      this.logger.error('Failed to authenticate with Spotify API', error);
      throw new Error('Failed to authenticate with Spotify API');
    }
  }

  /**
   * Search for tracks on Spotify
   */
  async searchTracks(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<SpotifyTrack[]> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get<SpotifySearchResponse>(`${this.baseUrl}/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: 'track',
          limit,
          offset,
        },
      });

      return response.data.tracks.items;
    } catch (error) {
      this.logger.error(`Failed to search tracks: ${query}`, error);
      throw new Error('Failed to search tracks on Spotify');
    }
  }

  /**
   * Get track recommendations based on parameters
   */
  async getRecommendations(params: SpotifyRecommendationsParams): Promise<SpotifyTrack[]> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get<SpotifyRecommendationsResponse>(
        `${this.baseUrl}/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ...params,
            limit: params.limit || 20,
          },
        },
      );

      return response.data.tracks;
    } catch (error) {
      this.logger.error('Failed to get recommendations', error);
      throw new Error('Failed to get track recommendations from Spotify');
    }
  }

  /**
   * Get track by ID
   */
  async getTrack(trackId: string): Promise<SpotifyTrack> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get<SpotifyTrack>(`${this.baseUrl}/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get track: ${trackId}`, error);
      throw new Error('Failed to get track from Spotify');
    }
  }
}
